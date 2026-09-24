import { AdminPermission, AdminRole } from "./types";

export const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  superadmin: [
    "users.read",
    "users.create",
    "users.update",
    "users.delete",
    "products.read",
    "products.create",
    "products.update",
    "products.archive",
    "inventory.read",
    "inventory.adjust",
    "orders.read",
    "orders.update",
    "orders.cancel",
    "customers.read",
    "customers.update",
    "reviews.read",
    "reviews.moderate",
    "coupons.read",
    "coupons.create",
    "coupons.update",
    "categories.manage",
    "collections.manage",
    "blog.manage",
    "newsletter.manage",
    "settings.read",
    "settings.update",
  ],
  admin: [
    "products.read",
    "products.create",
    "products.update",
    "products.archive",
    "inventory.read",
    "inventory.adjust",
    "orders.read",
    "orders.update",
    "orders.cancel",
    "customers.read",
    "customers.update",
    "reviews.read",
    "reviews.moderate",
    "coupons.read",
    "coupons.create",
    "coupons.update",
    "categories.manage",
    "collections.manage",
    "blog.manage",
    "newsletter.manage",
    "settings.read",
  ],
  scent_specialist: [
    "products.read",
    "products.create",
    "products.update",
    "categories.manage",
    "collections.manage",
    "reviews.read",
    "reviews.moderate",
    "blog.manage",
  ],
  inventory_manager: [
    "products.read",
    "inventory.read",
    "inventory.adjust",
    "orders.read",
  ],
  staff: [
    "products.read",
    "inventory.read",
    "orders.read",
    "customers.read",
  ],
};

export function hasPermission(role: AdminRole | undefined | null, permission: AdminPermission): boolean {
  if (!role) return false;
  if (role === "superadmin") return true;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}
