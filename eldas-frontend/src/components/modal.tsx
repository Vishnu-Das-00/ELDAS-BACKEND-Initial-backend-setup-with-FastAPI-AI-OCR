import type { PropsWithChildren } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/button";
import { cn } from "@/lib/cn";

interface ModalProps extends PropsWithChildren {
  open: boolean;
  title: string;
  onClose: () => void;
  description?: string;
  className?: string;
}

export function Modal({ open, title, onClose, description, className, children }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-8 backdrop-blur-sm">
      <div className={cn("panel w-full max-w-2xl p-6", className)}>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">{title}</h2>
            {description ? <p className="mt-2 text-sm text-slate-500">{description}</p> : null}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-10 w-10 rounded-full p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
