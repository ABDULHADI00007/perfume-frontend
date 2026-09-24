"use client";

import React, { useEffect, useState, useCallback } from "react";
import { adminService } from "@/features/admin/services/adminService";
import { AdminBlogPost } from "@/features/admin/types";
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
import { Icons } from "@/components/ui/icons";
import { formatDate } from "@/lib/utils";


export default function AdminJournalPage() {
  const { hasPermission } = useAdminAuth();
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<AdminBlogPost | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [category, setCategory] = useState("Art of Perfumery");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "archived">("draft");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  // Delete State
  const [postToDelete, setPostToDelete] = useState<AdminBlogPost | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await adminService.getAdminBlogPosts();
      setPosts(res.posts);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load journal articles");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasPermission("blog.manage")) {
      fetchPosts();
    }
  }, [fetchPosts, hasPermission]);

  if (!hasPermission("blog.manage")) {
    return <AdminAccessDenied requiredPermission="blog.manage" />;
  }

  const handleOpenCreate = () => {
    setEditingPost(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setFeaturedImageUrl("");
    setCategory("Art of Perfumery");
    setTags("");
    setStatus("draft");
    setMetaTitle("");
    setMetaDescription("");
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: AdminBlogPost) => {
    setEditingPost(p);
    setTitle(p.title);
    setSlug(p.slug || "");
    setExcerpt(p.excerpt || "");
    setContent(p.content || "");
    setFeaturedImageUrl(p.featuredImage?.url || "");
    setCategory(p.category || "Art of Perfumery");
    setTags(p.tags?.join(", ") || "");
    setStatus(p.status);
    setMetaTitle("");
    setMetaDescription("");
    setError(null);
    setIsModalOpen(true);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || title.trim().length < 3) {
      setError("Article title must be at least 3 characters.");
      return;
    }
    if (!content.trim() || content.trim().length < 10) {
      setError("Article content must be at least 10 characters.");
      return;
    }

    const payload: Partial<AdminBlogPost> = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      excerpt: excerpt.trim() || undefined,
      content: content.trim(),
      featuredImage: featuredImageUrl.trim() ? { url: featuredImageUrl.trim() } : undefined,
      category: category.trim() || undefined,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      status,
      seo: {
        metaTitle: metaTitle.trim() || undefined,
        metaDescription: metaDescription.trim() || undefined,
      },
    };

    try {
      setIsSubmitting(true);
      setError(null);
      if (editingPost) {
        await adminService.updateBlogPost(editingPost._id, payload);
        setSuccessMessage(`Article "${payload.title}" updated.`);
      } else {
        await adminService.createBlogPost(payload);
        setSuccessMessage(`Article "${payload.title}" created.`);
      }
      setIsModalOpen(false);
      fetchPosts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save article");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async (p: AdminBlogPost) => {
    try {
      setIsLoading(true);
      await adminService.publishBlogPost(p._id);
      setSuccessMessage(`Article "${p.title}" published!`);
      fetchPosts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to publish article");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnpublish = async (p: AdminBlogPost) => {
    try {
      setIsLoading(true);
      await adminService.unpublishBlogPost(p._id);
      setSuccessMessage(`Article "${p.title}" moved to draft.`);
      fetchPosts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to unpublish article");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!postToDelete) return;
    try {
      setIsDeleteLoading(true);
      setError(null);
      await adminService.deleteBlogPost(postToDelete._id);
      setSuccessMessage(`Article "${postToDelete.title}" deleted.`);
      setPostToDelete(null);
      fetchPosts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete article");
      setPostToDelete(null);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const columns: Column<AdminBlogPost>[] = [
    {
      header: "Article",
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-surface-subtle border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
            {row.featuredImage?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={row.featuredImage.url} alt={row.title} className="w-full h-full object-cover" />
            ) : (
              <Icons.Edit size={16} className="text-foreground-muted" />
            )}
          </div>
          <div>
            <span className="font-semibold text-xs text-foreground">{row.title}</span>
            <p className="text-[11px] text-foreground-muted font-mono">{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      cell: (row) => (
        <span className="text-xs text-foreground-muted">{row.category || "Journal"}</span>
      ),
    },
    {
      header: "Created / Published",
      cell: (row) => (
        <span className="text-xs text-foreground-muted">
          {formatDate(row.publishedAt || row.createdAt)}
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
        <div className="flex items-center justify-end gap-1.5">
          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(row)}>
            Edit
          </Button>

          {row.status !== "published" ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePublish(row)}
              className="text-status-success hover:bg-status-success/10"
            >
              Publish
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleUnpublish(row)}
              className="text-status-warning hover:bg-status-warning/10"
            >
              Unpublish
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPostToDelete(row)}
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
            Editorial Publications
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-foreground font-normal">
            Journal Management
          </h1>
        </div>

        <Button variant="primary" size="sm" onClick={handleOpenCreate}>
          <Icons.Plus size={14} className="mr-1.5" />
          Write Article
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
        data={posts}
        isLoading={isLoading}
        emptyMessage="No journal articles found."
      />

      {/* Create / Edit Article Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingPost ? "Edit Journal Article" : "Write Journal Article"}
          maxWidth="lg"
        >
          <form onSubmit={handleSavePost} className="space-y-4 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Article Title *"
                placeholder="e.g. The Alchemy of Grasse Rose Harvest"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <Input
                label="Custom Slug (optional)"
                placeholder="the-alchemy-of-grasse-rose"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />

              <Input
                label="Tags (comma-separated)"
                placeholder="Harvest, Grasse, Heritage"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />

              <Select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published" | "archived")}
                options={[
                  { label: "Draft", value: "draft" },
                  { label: "Published", value: "published" },
                  { label: "Archived", value: "archived" },
                ]}
              />
            </div>

            <Input
              label="Cover Image URL"
              placeholder="https://images.unsplash.com/..."
              value={featuredImageUrl}
              onChange={(e) => setFeaturedImageUrl(e.target.value)}
            />

            <Textarea
              label="Article Excerpt (max 500 chars)"
              placeholder="Brief summary for listings and SEO..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
            />

            <Textarea
              label="Full Editorial Content *"
              placeholder="Write article body in text/markdown..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              required
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
                {editingPost ? "Save Changes" : "Save Article"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(postToDelete)}
        onClose={() => setPostToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Article"
        message={`Are you sure you want to permanently delete "${postToDelete?.title}"?`}
        confirmLabel="Delete Article"
        isDestructive
        isLoading={isDeleteLoading}
      />
    </div>
  );
}
