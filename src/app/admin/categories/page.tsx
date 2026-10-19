"use client";

import React, { useEffect, useState, useCallback } from "react";
import { adminService } from "@/features/admin/services/adminService";
import { AdminCategory } from "@/features/admin/types";
import { useAdminAuth } from "@/features/admin/context/AdminAuthContext";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/ui/icons";

export default function AdminCategoriesPage() {
  const { hasPermission } = useAdminAuth();
  const initialCached = adminService.getCachedCategories();
  const [categories, setCategories] = useState<AdminCategory[]>(initialCached || []);
  const [isLoading, setIsLoading] = useState(!initialCached);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sortOrder, setSortOrder] = useState<string>("0");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  // Delete & Archive Dialogs
  const [categoryToDelete, setCategoryToDelete] = useState<AdminCategory | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const fetchCategories = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setIsLoading(true);
      setError(null);
      const data = await adminService.getCategories();
      setCategories(data);
    } catch (err: unknown) {
      if (!isSilent) {
        setError(err instanceof Error ? err.message : "Failed to load categories");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasPermission("categories.manage")) {
      const hasCache = Boolean(adminService.getCachedCategories());
      fetchCategories(hasCache);
    }
  }, [fetchCategories, hasPermission]);

  if (!hasPermission("categories.manage")) {
    return <AdminAccessDenied requiredPermission="categories.manage" />;
  }

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setImageUrl("");
    setSortOrder("0");
    setStatus("active");
    setError(null);
    setSuccessMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: AdminCategory) => {
    setEditingCategory(category);
    setName(category.name);
    setSlug(category.slug || "");
    setDescription(category.description || "");
    setImageUrl(category.image?.url || "");
    setSortOrder(String(category.sortOrder || 0));
    setStatus(category.status);
    setError(null);
    setSuccessMessage(null);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    const payload: Partial<AdminCategory> = {
      name: name.trim(),
      slug: slug.trim() || undefined,
      description: description.trim() || undefined,
      image: imageUrl.trim() ? { url: imageUrl.trim() } : undefined,
      sortOrder: Number(sortOrder) || 0,
      status,
    };

    try {
      setIsSubmitting(true);
      setError(null);
      if (editingCategory) {
        await adminService.updateCategory(editingCategory._id, payload);
        setSuccessMessage("Category updated successfully.");
      } else {
        await adminService.createCategory(payload);
        setSuccessMessage("Category created successfully.");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchive = async (cat: AdminCategory) => {
    try {
      setIsLoading(true);
      setError(null);
      await adminService.archiveCategory(cat._id);
      setSuccessMessage(`Category "${cat.name}" has been archived.`);
      fetchCategories();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to archive category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      setIsDeleteLoading(true);
      setError(null);
      await adminService.deleteCategory(categoryToDelete._id);
      setSuccessMessage(`Category "${categoryToDelete.name}" deleted successfully.`);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete category (products may still reference it)");
      setCategoryToDelete(null);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const columns: Column<AdminCategory>[] = [
    {
      header: "Category",
      cell: (row) => (
        <div className="flex items-center space-x-3 py-1">
          <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] border border-[#E6E2EA] flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
            {row.image?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={row.image.url} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              <Icons.Tag size={18} className="text-[#64748B]" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-[#0B1938] leading-tight">{row.name}</span>
            <span className="text-[11px] text-[#64748B] font-mono mt-0.5">{row.slug}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Description",
      cell: (row) => (
        <span className="text-xs text-[#64748B] truncate max-w-xs block font-sans">
          {row.description || "—"}
        </span>
      ),
    },
    {
      header: "Order",
      cell: (row) => (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#FAF8F5] text-xs font-bold font-mono text-[#0B1938] border border-[#EFECE6]">
          {row.sortOrder || 0}
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
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenEdit(row)}
            className="h-8 px-3 text-xs gap-1.5 bg-white hover:bg-[#FAF8F5] text-[#0B1938] border-[#E2DED6] rounded-lg shadow-2xs transition-all cursor-pointer"
          >
            <Icons.Edit size={13} />
            <span>Edit</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-lg hover:bg-[#FAF8F5] text-[#64748B] hover:text-[#0B1938] cursor-pointer"
              >
                <Icons.MoreVertical size={15} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 font-sans border-[#E6E2EA] bg-white shadow-md">
              {row.status === "active" && (
                <DropdownMenuItem
                  onClick={() => handleArchive(row)}
                  className="cursor-pointer text-xs flex items-center gap-2 text-[#64748B] focus:bg-[#FAF8F5]"
                >
                  <Icons.Archive size={14} />
                  <span>Archive</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => setCategoryToDelete(row)}
                className="cursor-pointer text-xs flex items-center gap-2 text-rose-600 focus:text-rose-600 focus:bg-rose-50"
              >
                <Icons.Trash size={14} />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-foreground-muted font-medium block">
            Taxonomy & Organization
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-foreground font-normal">
            Categories
          </h1>
        </div>

        <Button variant="primary" size="sm" onClick={handleOpenCreate}>
          <Icons.Plus size={14} className="mr-1.5" />
          Add Category
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
        data={categories}
        isLoading={isLoading}
        emptyMessage="No categories created yet."
      />

      {/* Create / Edit Category Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingCategory ? "Edit Category" : "New Category"}
          maxWidth="md"
        >
          <form onSubmit={handleSaveCategory} className="space-y-4 font-sans">
            <Input
              label="Category Name *"
              placeholder="e.g. Extrait de Parfum"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Custom Slug (optional)"
              placeholder="extrait-de-parfum"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />

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
              label="Description"
              placeholder="Sensory character of this category..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />

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
                {editingCategory ? "Save Changes" : "Create Category"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(categoryToDelete)}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to permanently delete category "${categoryToDelete?.name}"? If products currently reference this category, deletion will be blocked by backend.`}
        confirmLabel="Delete Category"
        isDestructive
        isLoading={isDeleteLoading}
      />
    </div>
  );
}
