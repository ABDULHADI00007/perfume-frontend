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
  message = "Your administrative role credentials do not currently have clearance to access this module.",
  requiredPermission,
}) => {
  return (
    <div className="bg-white border border-slate-200/80 p-8 sm:p-12 text-center max-w-lg mx-auto my-12 font-sans rounded-3xl shadow-sm">
      <div className="w-14 h-14 bg-amber-50 border border-amber-200 text-amber-600 mx-auto rounded-2xl flex items-center justify-center mb-5 shadow-2xs">
        <Icons.ShieldCheck size={26} />
      </div>
      <h2 className="font-display text-2xl font-bold text-[#0C134F] mb-2">{title}</h2>
      <p className="text-xs sm:text-sm text-slate-500 mb-5 leading-relaxed max-w-sm mx-auto">
        {message}
      </p>
      {requiredPermission && (
        <p className="text-xs text-slate-400 font-mono mb-6">
          Required Permission:{" "}
          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-semibold">
            {requiredPermission}
          </span>
        </p>
      )}
      <div className="flex justify-center gap-3">
        <Link href="/admin">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl px-4 py-2 text-xs font-semibold text-[#0C134F] border-slate-200 bg-white hover:bg-slate-50 shadow-2xs"
          >
            ← Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
