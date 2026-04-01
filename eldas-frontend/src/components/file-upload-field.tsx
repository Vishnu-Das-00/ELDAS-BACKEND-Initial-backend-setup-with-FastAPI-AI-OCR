import { ImagePlus, Paperclip } from "lucide-react";

import { cn } from "@/lib/cn";

interface FileUploadFieldProps {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
}

export function FileUploadField({ label, file, onChange, accept = "image/*" }: FileUploadFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <div
        className={cn(
          "flex min-h-[132px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 p-6 text-center transition hover:border-tide hover:bg-tide/5",
          file && "border-tide bg-tide/5",
        )}
      >
        {file ? <Paperclip className="mb-3 h-6 w-6 text-tide" /> : <ImagePlus className="mb-3 h-6 w-6 text-tide" />}
        <span className="text-sm font-semibold text-ink">{file ? file.name : "Choose or drop an image file"}</span>
        <span className="mt-2 text-xs text-slate-500">PNG, JPG, or handwritten work snapshots are supported.</span>
      </div>
      <input
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
    </label>
  );
}
