"use client";

import React, { useEffect, useState, useCallback } from "react";
import { adminService } from "@/features/admin/services/adminService";
import { AdminCollection, AdminProduct } from "@/features/admin/types";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { TableActionButton, TableActionGroup } from "@/components/admin/TableAction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/ui/icons";

export default function AdminCollectionsPage() {
  const { hasPermission } = useAdminAuth();
  const initialCached = adminService.getCachedCollections();
  const [collections, setCollections] = useState<AdminCollection[]>(initialCached || []);
  const [availableProducts, setAvailableProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(!initialCached);
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

  const fetchCollections = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setIsLoading(true);
      setError(null);
      const [colsData, prodsData] = await Promise.all([
        adminService.getCollections(),
        adminService.getProducts({ limit: 100 }),
      ]);
      setCollections(colsData);
      setAvailableProducts(prodsData.products);
    } catch (err: unknown) {
      if (!isSilent) {
        setError(err instanceof Error ? err.message : "Failed to load collections");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasPermission("collections.manage")) {
      const hasCache = Boolean(adminService.getCachedCollections());
      fetchCollections(hasCache);
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
        <div className="flex items-center space-x-3 py-1">
          <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] border border-[#E6E2EA] flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
            {row.image?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={row.image.url} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              <Icons.Layers size={18} className="text-[#64748B]" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-xs sm:text-sm text-[#0B1938] hover:text-[#590B16] transition-colors leading-tight truncate">
              {row.name}
            </span>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
              {row.slug}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Products Assigned",
      cell: (row) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-medium bg-[#FAF7EE] text-[#590B16] border border-[#590B16]/20 shadow-2xs">
          <Icons.Package size={11} className="text-[#590B16]" />
          <span>{row.products?.length || row.productCount || 0} items</span>
        </span>
      ),
    },
    {
      header: "Order",
      cell: (row) => (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] font-semibold border border-slate-200/80">
          #{row.sortOrder || 0}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Actions",
      align: "right",
      cell: (row) => (
        <TableActionGroup>
          <TableActionButton
            variant="outline"
            onClick={() => handleOpenEdit(row)}
            icon={<Icons.Edit size={12} />}
          >
            Edit
          </TableActionButton>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-lg hover:bg-slate-100/70 text-slate-500 hover:text-[#0C134F] cursor-pointer"
              >
                <Icons.MoreVertical size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 font-sans border-slate-200/80 bg-white shadow-md">
              {row.status === "active" && (
                <DropdownMenuItem
                  onClick={() => handleArchive(row)}
                  className="cursor-pointer text-xs flex items-center gap-2 text-slate-600 focus:bg-slate-50"
                >
                  <Icons.Archive size={14} />
                  <span>Archive</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => setCollectionToDelete(row)}
                className="cursor-pointer text-xs flex items-center gap-2 text-rose-600 focus:text-rose-600 focus:bg-rose-50"
              >
                <Icons.Trash size={14} />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableActionGroup>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <AdminPageHeader
        category="CURATIONS & THEMES"
        title="Collections"
        description="Curate themed fragrance anthologies, seasonal releases, and limited edition drops."
        count={collections.length}
        breadcrumbs={[{ label: "Collections" }]}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCreate}
            className="bg-[#0C134F] hover:bg-[#121A4B] text-white rounded-xl px-4 py-2 text-xs font-semibold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
          >
            <Icons.Plus size={14} />
            <span>Add Collection</span>
          </Button>
        }
      />

      {/* Alert Messages */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
          <Icons.AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <Icons.Check size={16} className="shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={collections}
        isLoading={isLoading}
        emptyMessage="No collections created yet."
      />

      {/* Create / Edit Collection Modal (Powered by Shadcn Dialog) */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingCollection ? "Edit Collection" : "New Collection"}
          description={editingCollection ? "Update collection details and assigned fragrances." : "Create a new curated fragrance collection."}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveCollection} className="space-y-4 font-sans pt-2">
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
            <div className="pt-3 border-t border-[#E6E2EA]">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em] text-[#6B6F80]">
                  Assign Fragrances
                </label>
                <Badge variant="secondary" size="sm" className="font-mono text-[9px]">
                  {selectedProductIds.length} selected
                </Badge>
              </div>

              <div className="max-h-40 overflow-y-auto divide-y divide-[#E6E2EA] border border-[#E6E2EA] rounded-xl p-2 bg-[#FBF9F5] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {availableProducts.length === 0 ? (
                  <p className="text-xs text-[#6B6F80] text-center py-4">No products available to assign.</p>
                ) : (
                  availableProducts.map((p) => (
                    <div key={p._id} className="py-2 px-1 flex items-center justify-between hover:bg-white rounded-lg transition-colors">
                      <Checkbox
                        label={`${p.name} (${p.sku})`}
                        checked={selectedProductIds.includes(p._id)}
                        onCheckedChange={() => handleToggleProduct(p._id)}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 bg-white sticky bottom-0 z-10 mt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="border-slate-200 text-slate-600 hover:bg-[#FAF7EE] hover:text-[#590B16] rounded-xl text-xs h-9 px-4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="brand"
                size="sm"
                isLoading={isSubmitting}
                className="rounded-xl text-xs font-bold uppercase tracking-wider h-9 px-5 shadow-xs"
              >
                {editingCollection ? "Save Changes" : "Create Collection"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Dialog (Powered by Shadcn Dialog & Button) */}
      <ConfirmDialog
        isOpen={Boolean(collectionToDelete)}
        onClose={() => setCollectionToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Collection"
        message={`Are you sure you want to delete collection "${collectionToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Collection"
        isDestructive
        isLoading={isDeleteLoading}
      />
    </div>
  );
}
