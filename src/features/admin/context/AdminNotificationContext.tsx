"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { adminService } from "../services/adminService";
import { AdminOrder } from "../types";
import { useAdminAuth } from "./AdminAuthContext";

export interface AdminNotificationContextType {
  pendingOrdersCount: number;
  unreadOrdersCount: number;
  readOrderIds: Set<string>;
  markAsRead: (orderId: string) => void;
  markAllAsRead: () => void;
  isOrderUnread: (orderId: string) => boolean;
  recentOrders: AdminOrder[];
  newOrderAlert: AdminOrder | null;
  dismissAlert: () => void;
  refreshOrdersCount: () => Promise<void>;
  playChime: () => void;
  pushPermission: NotificationPermission | "unsupported";
  requestPushPermission: () => Promise<void>;
}

const AdminNotificationContext = createContext<AdminNotificationContextType | undefined>(
  undefined
);

/**
 * Play a luxury high-end chime using browser Web Audio API
 * No external mp3 or network asset required.
 */
export function playNotificationChime() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Note 1: E5 (659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Note 2: B5 (987.77 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(987.77, now + 0.12);
    gain2.gain.setValueAtTime(0.25, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.6);
  } catch {
    // Autoplay restrictions or unsupported environment
  }
}

const STORAGE_KEY = "ss_admin_read_orders";

const getSavedReadIds = (): Set<string> => {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
};

export const AdminNotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, hasPermission } = useAdminAuth();
  const [pendingOrdersCount, setPendingOrdersCount] = useState<number>(0);
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);
  const [readOrderIds, setReadOrderIds] = useState<Set<string>>(() => getSavedReadIds());
  const [newOrderAlert, setNewOrderAlert] = useState<AdminOrder | null>(null);
  const [pushPermission, setPushPermission] = useState<NotificationPermission | "unsupported">("default");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setReadOrderIds(getSavedReadIds());
      if ("Notification" in window) {
        setPushPermission(Notification.permission);
      } else {
        setPushPermission("unsupported");
      }
    }
  }, []);

  const markAsRead = useCallback((orderId: string) => {
    setReadOrderIds((prev) => {
      if (prev.has(orderId)) return prev;
      const next = new Set(prev);
      next.add(orderId);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setReadOrderIds((prev) => {
      const next = new Set(prev);
      recentOrders.forEach((o) => {
        if (o._id) next.add(o._id);
      });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  }, [recentOrders]);

  const isOrderUnread = useCallback(
    (orderId: string) => {
      return !readOrderIds.has(orderId);
    },
    [readOrderIds]
  );

  // Unread orders count based on recentOrders that are not marked as read
  const unreadOrdersCount = recentOrders.filter(
    (o) => o._id && !readOrderIds.has(o._id)
  ).length;

  const requestPushPermission = useCallback(async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      try {
        const perm = await Notification.requestPermission();
        setPushPermission(perm);
      } catch (err) {
        console.warn("Could not request notification permission:", err);
      }
    }
  }, []);

  const isInitialLoadRef = useRef(true);
  const knownOrderIdsRef = useRef<Set<string>>(new Set());
  const alertTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dismissAlert = useCallback(() => {
    setNewOrderAlert(null);
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
      alertTimeoutRef.current = null;
    }
  }, []);

  const fetchOrdersStatus = useCallback(async () => {
    if (!isAuthenticated || !hasPermission("orders.read")) return;

    try {
      // Helper to parse total items from backend pagination meta
      const getMetaCount = (res: { meta?: unknown }): number => {
        const m = res?.meta as Record<string, unknown> | undefined;
        if (!m) return 0;
        if (typeof m.totalItems === "number") return m.totalItems;
        if (typeof m.total === "number") return m.total;
        return 0;
      };

      // Query recent orders and pending orders with skipCache = true
      const [allRes, pendingRes, verificationRes] = await Promise.all([
        adminService.getOrders({ page: 1, limit: 20 }, true),
        adminService.getOrders({ orderStatus: "pending", limit: 1 }, true),
        adminService.getOrders({ orderStatus: "awaiting_payment_verification", limit: 1 }, true),
      ]);

      const metaPending = getMetaCount(pendingRes) + getMetaCount(verificationRes);
      const incomingOrders = allRes.orders || [];
      const listPending = incomingOrders.filter(
        (o) => o.orderStatus === "pending" || o.orderStatus === "awaiting_payment_verification"
      ).length;

      const finalPending = Math.max(metaPending, listPending);
      setPendingOrdersCount(finalPending);
      setRecentOrders(incomingOrders);

      if (isInitialLoadRef.current) {
        // First load: record existing order IDs and seed readOrderIds if first visit so count is 0 by default
        const saved = getSavedReadIds();
        if (saved.size === 0 && incomingOrders.length > 0) {
          const seeded = new Set<string>();
          incomingOrders.forEach((o) => {
            if (o._id) seeded.add(o._id);
          });
          setReadOrderIds(seeded);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(seeded)));
          } catch {}
        }
        incomingOrders.forEach((o) => {
          if (o._id) knownOrderIdsRef.current.add(o._id);
        });
        isInitialLoadRef.current = false;
      } else {
        // Subsequent polls: check if any new order arrived
        const newlyDiscovered = incomingOrders.find(
          (o) => o._id && !knownOrderIdsRef.current.has(o._id)
        );

        if (newlyDiscovered) {
          // 1. Play audio chime
          playNotificationChime();

          // 2. Vibrate mobile device (if supported)
          if (typeof navigator !== "undefined" && "vibrate" in navigator) {
            try {
              navigator.vibrate([200, 100, 250, 100, 200]);
            } catch {
              // Ignore if vibration fails
            }
          }

          // 3. Native system / mobile push notification (if permission granted)
          if (
            typeof window !== "undefined" &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            try {
              const custName =
                newlyDiscovered.customerSnapshot?.name ||
                newlyDiscovered.shippingAddress?.fullName ||
                "Customer";
              const totalVal = (
                newlyDiscovered.totalAmount ||
                newlyDiscovered.total ||
                0
              ).toLocaleString();

              const notif = new Notification(`New Order #${newlyDiscovered.orderNumber}`, {
                body: `${custName} placed an order of PKR ${totalVal}!`,
                icon: "/images/perfumes/1789763707946.png",
                badge: "/images/perfumes/1789763707946.png",
                tag: newlyDiscovered._id || "new-order",
              });

              notif.onclick = () => {
                window.focus();
                if (newlyDiscovered._id) {
                  window.location.href = `/admin/orders/${newlyDiscovered._id}`;
                }
              };
            } catch {
              // Fallback silently if notification construction fails
            }
          }

          // 4. Show in-app popup toast banner
          setNewOrderAlert(newlyDiscovered);

          // Auto-dismiss toast after 8 seconds
          if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
          alertTimeoutRef.current = setTimeout(() => {
            setNewOrderAlert(null);
          }, 8000);
        }

        // Add all current IDs to known set
        incomingOrders.forEach((o) => {
          if (o._id) knownOrderIdsRef.current.add(o._id);
        });
      }
    } catch (err) {
      console.warn("Could not check for new orders:", err);
    }
  }, [isAuthenticated, hasPermission]);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchOrdersStatus();

    // Poll every 12 seconds for real-time order detection
    const interval = setInterval(() => {
      fetchOrdersStatus();
    }, 12000);

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchOrdersStatus]);

  return (
    <AdminNotificationContext.Provider
      value={{
        pendingOrdersCount,
        unreadOrdersCount,
        readOrderIds,
        markAsRead,
        markAllAsRead,
        isOrderUnread,
        recentOrders,
        newOrderAlert,
        dismissAlert,
        refreshOrdersCount: fetchOrdersStatus,
        playChime: playNotificationChime,
        pushPermission,
        requestPushPermission,
      }}
    >
      {children}
    </AdminNotificationContext.Provider>
  );
};

export function useAdminNotification(): AdminNotificationContextType {
  const context = useContext(AdminNotificationContext);
  if (!context) {
    throw new Error(
      "useAdminNotification must be used within an AdminNotificationProvider"
    );
  }
  return context;
}

