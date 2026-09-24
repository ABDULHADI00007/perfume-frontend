"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

export const AdminAccessDenied: React.FC<{
  title?: string;
  message?: string;
  requiredPermission?: string;
}> = ({
  title = "Access Restricted",
  message = "Your administrative role does not have permission to view or manage this module.",
  requiredPermission,
}) => {
  return (
    <div className="bg-surface border border-border p-8 sm:p-12 text-center max-w-xl mx-auto my-12 font-sans">
      <div className="w-12 h-12 bg-status-warning/10 border border-status-warning/20 text-status-warning mx-auto flex items-center justify-center mb-4">
        <Icons.ShieldCheck size={24} />
      </div>
      <h2 className="font-serif text-2xl text-foreground mb-2">{title}</h2>
      <p className="text-sm text-foreground-muted mb-4 leading-relaxed font-sans">
        {message}
      </p>
      {requiredPermission && (
        <p className="text-xs text-foreground-subtle font-mono mb-6">
          Required permission: <span className="bg-surface-subtle px-2 py-1 border border-border">{requiredPermission}</span>
        </p>
      )}
      <div className="flex justify-center gap-3">
        <Link href="/admin">
          <Button variant="outline" size="sm">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
