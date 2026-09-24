"use client";

import React, { useEffect, useState, useCallback } from "react";
import { adminService } from "@/features/admin/services/adminService";
import { AdminCollection, AdminProduct } from "@/features/admin/types";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Modal } from "@/components/ui/modal";
import { Icons } from "@/components/ui/icons";

export default function AdminCollectionsPage() {
  const { hasPermission } = useAdminAuth();
  const [collections, setCollections] = useState<AdminCollection[]>([]);
  const [availableProducts, setAvailableProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<AdminCollection | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sortOrder, setSortOrder] = useState<string>("0");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Delete & Archive Dialogs
  const [collectionToDelete, setCollectionToDelete] = useState<AdminCollection | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const fetchCollections = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [colsData, prodsData] = await Promise.all([
        adminService.getCollections(),
        adminService.getProducts({ limit: 100 }),
      ]);
      setCollections(colsData);
      setAvailableProducts(prodsData.products);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load collections");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasPermission("collections.manage")) {
      fetchCollections();
    }
  }, [fetchCollections, hasPermission]);

  if (!hasPermission("collections.manage")) {
    return <AdminAccessDenied requiredPermission="collections.manage" />;
  }

  const handleOpenCreate = () => {
    setEditingCollection(null);
    setName("");
    setSlug("");
    setDescription("");
    setImageUrl("");
    setSortOrder("0");
    setStatus("active");
    setSelectedProductIds([]);
    setError(null);
    setSuccessMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (col: AdminCollection) => {
    setEditingCollection(col);
    setName(col.name);
    setSlug(col.slug || "");
    setDescription(col.description || "");
    setImageUrl(col.image?.url || "");
    setSortOrder(String(col.sortOrder || 0));
    setStatus(col.status);
    setSelectedProductIds(
      col.products?.map((p) => (typeof p === "object" ? p._id : p)) || []
    );
    setError(null);
    setSuccessMessage(null);
    setIsModalOpen(true);
  };

  const handleToggleProduct = (prodId: string) => {
    if (selectedProductIds.includes(prodId)) {
      setSelectedProductIds(selectedProductIds.filter((id) => id !== prodId));
    } else {
      setSelectedProductIds([...selectedProductIds, prodId]);
    }
  };

  const handleSaveCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Collection name is required.");
      return;
    }

    const payload: Partial<AdminCollection> = {
      name: name.trim(),
      slug: slug.trim() || undefined,
      description: description.trim() || undefined,
      image: imageUrl.trim() ? { url: imageUrl.trim() } : undefined,
      products: selectedProductIds,
      sortOrder: Number(sortOrder) || 0,
      status,
    };

    try {
      setIsSubmitting(true);
      setError(null);
      if (editingCollection) {
        await adminService.updateCollection(editingCollection._id, payload);
        setSuccessMessage("Collection updated successfully.");
      } else {
        await adminService.createCollection(payload);
        setSuccessMessage("Collection created successfully.");
      }
      setIsModalOpen(false);
      fetchCollections();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save collection");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchive = async (col: AdminCollection) => {
    try {
      setIsLoading(true);
      setError(null);
      await adminService.archiveCollection(col._id);
      setSuccessMessage(`Collection "${col.name}" archived.`);
      fetchCollections();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to archive collection");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!collectionToDelete) return;
    try {
      setIsDeleteLoading(true);
      setError(null);
      await adminService.deleteCollection(collectionToDelete._id);
      setSuccessMessage(`Collection "${collectionToDelete.name}" deleted.`);
      setCollectionToDelete(null);
      fetchCollections();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete collection");
      setCollectionToDelete(null);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const columns: Column<AdminCollection>[] = [
    {
      header: "Collection",
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-surface-subtle border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
            {row.image?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={row.image.url} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              <Icons.Layers size={16} className="text-foreground-muted" />
            )}
          </div>
          <div>
            <span className="font-semibold text-xs text-foreground">{row.name}</span>
            <p className="text-[11px] text-foreground-muted font-mono">{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Products Assigned",
      cell: (row) => (
        <span className="text-xs text-foreground-muted font-mono">
          {row.products?.length || row.productCount || 0} product(s)
        </span>
      ),
    },
    {
      header: "Order",
      cell: (row) => <span className="text-xs font-mono">{row.sortOrder || 0}</span>,
    },
    {
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Actions",
      align: "right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(row)}>
            Edit
          </Button>

          {row.status === "active" ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleArchive(row)}
              className="text-foreground-muted"
            >
              Archive
            </Button>
          ) : null}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollectionToDelete(row)}
            className="text-status-error hover:bg-status-error/10"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-foreground-muted font-medium block">
            Curations & Themes
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-foreground font-normal">
            Collections
          </h1>
        </div>

        <Button variant="primary" size="sm" onClick={handleOpenCreate}>
          <Icons.Plus size={14} className="mr-1.5" />
          Add Collection
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-status-error/10 border border-status-error/20 text-status-error text-xs font-medium">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="p-4 bg-status-success/10 border border-status-success/20 text-status-success text-xs font-medium">
          {successMessage}
        </div>
      )}

      <DataTable
        columns={columns}
        data={collections}
        isLoading={isLoading}
        emptyMessage="No collections created yet."
      />

      {/* Create / Edit Collection Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingCollection ? "Edit Collection" : "New Collection"}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveCollection} className="space-y-4 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Collection Name *"
                placeholder="e.g. Private Reserve Collection"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Custom Slug (optional)"
                placeholder="private-reserve-collection"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            <Input
              label="Cover Image URL (optional)"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Sort Order"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              />

              <Select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
                options={[
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                ]}
              />
            </div>

            <Textarea
              label="Editorial Description"
              placeholder="Sensory context and narrative theme..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />

            {/* Products Assignment */}
            <div className="pt-2 border-t border-border-subtle">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-2">
                Assign Fragrances ({selectedProductIds.length} selected)
              </label>
              <div className="max-h-48 overflow-y-auto divide-y divide-border-subtle border border-border p-2 bg-surface-subtle">
                {availableProducts.map((p) => (
                  <div key={p._id} className="py-1.5 flex items-center justify-between">
                    <Checkbox
                      label={`${p.name} (${p.sku})`}
                      checked={selectedProductIds.includes(p._id)}
                      onChange={() => handleToggleProduct(p._id)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border-subtle">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmitting}
              >
                {editingCollection ? "Save Changes" : "Create Collection"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(collectionToDelete)}
        onClose={() => setCollectionToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Collection"
        message={`Are you sure you want to delete collection "${collectionToDelete?.name}"?`}
        confirmLabel="Delete Collection"
        isDestructive
        isLoading={isDeleteLoading}
      />
    </div>
  );
}
