"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Search, Upload, Check, X, Folder, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FolderImage {
  filename: string;
  url: string;
  size: number;
  updatedAt: number;
}

interface FolderImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (image: { url: string; altText: string }) => void;
  selectedUrls?: string[];
}

export const FolderImagePickerModal: React.FC<FolderImagePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  selectedUrls = [],
}) => {
  const [images, setImages] = useState<FolderImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    async function fetchImages() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch("/api/perfume-images");
        const data = await res.json();
        if (isMounted) {
          if (data.success && Array.isArray(data.images)) {
            setImages(data.images);
          } else {
            setError(data.message || "Failed to load perfume images");
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Error connecting to server");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchImages();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const filteredImages = useMemo(() => {
    if (!searchQuery.trim()) return images;
    const query = searchQuery.toLowerCase().trim();
    return images.filter((img) => img.filename.toLowerCase().includes(query));
  }, [images, searchQuery]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.url) {
          const newImg: FolderImage = {
            filename: data.filename,
            url: data.url,
            size: data.size || file.size,
            updatedAt: Date.now(),
          };
          setImages((prev) => [newImg, ...prev]);
          onSelectImage({
            url: data.url,
            altText: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          });
        } else {
          throw new Error(data.message || "Failed to upload file");
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[88vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#0C134F]/10 text-[#0C134F] rounded-xl">
              <Folder className="w-5 h-5 text-[#0C134F]" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#0C134F]">
                Perfumes Media Folder
              </h2>
              <p className="text-[11px] text-slate-500">
                Select images from <code className="font-mono text-slate-700 bg-slate-200/60 px-1 py-0.5 rounded text-[10px]">/public/images/perfumes</code> or upload new ones
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="gap-1.5 text-xs h-8 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-[#0C134F] shadow-2xs font-medium cursor-pointer"
            >
              {isUploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0C134F]" />
              ) : (
                <Upload className="w-3.5 h-3.5 text-[#0C134F]" />
              )}
              <span>Upload to Folder</span>
            </Button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Stats Bar */}
        <div className="px-6 py-3 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              placeholder="Search perfume pictures by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-8 bg-slate-50 border-slate-200 rounded-xl"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-semibold text-slate-800">{filteredImages.length}</span> of {images.length} images in folder
          </div>
        </div>

        {error && (
          <div className="px-6 py-2.5 bg-rose-50 text-rose-700 text-xs border-b border-rose-200">
            {error}
          </div>
        )}

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-6 min-h-[320px] max-h-[55vh] scrollbar-thin scrollbar-thumb-slate-200">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#0C134F] mb-3" />
              <p className="text-xs font-medium">Scanning perfumes folder...</p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
              <ImageIcon className="w-10 h-10 mb-2 text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">No perfume images found</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                {searchQuery ? `No matches for "${searchQuery}". Try a different keyword.` : "Click 'Upload to Folder' to add perfume photos from your computer."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {filteredImages.map((img) => {
                const isSelected = selectedUrls.includes(img.url);
                return (
                  <div
                    key={img.filename}
                    onClick={() => {
                      onSelectImage({
                        url: img.url,
                        altText: img.filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
                      });
                    }}
                    className={`group relative flex flex-col bg-slate-50 rounded-xl border p-2 cursor-pointer transition-all hover:shadow-md hover:border-[#0C134F]/40 ${
                      isSelected
                        ? "border-[#0C134F] ring-2 ring-[#0C134F]/20 bg-slate-100/80"
                        : "border-slate-200/90"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="aspect-square w-full rounded-lg bg-white border border-slate-100 overflow-hidden flex items-center justify-center relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.filename}
                        className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />

                      {/* Selected checkmark badge */}
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 bg-[#0C134F] text-white p-1 rounded-full shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Image Name */}
                    <div className="mt-2 text-left">
                      <p
                        className="text-[11px] font-medium text-slate-700 truncate"
                        title={img.filename}
                      >
                        {img.filename}
                      </p>
                      <p className="text-[9.5px] text-slate-400 font-mono">
                        {(img.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Click any image to add it directly to your fragrance profile.</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs h-8 px-4 rounded-xl border-slate-200 bg-white hover:bg-slate-100 text-slate-700 cursor-pointer"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};
