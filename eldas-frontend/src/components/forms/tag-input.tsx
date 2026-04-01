import { useMemo, useState } from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Input } from "@/components/input";

interface TagInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function TagInput({ label, values, onChange, placeholder }: TagInputProps) {
  const [draft, setDraft] = useState("");

  const normalizedValues = useMemo(() => values.filter(Boolean), [values]);

  function addTag() {
    const value = draft.trim();
    if (!value || normalizedValues.includes(value)) {
      setDraft("");
      return;
    }
    onChange([...normalizedValues, value]);
    setDraft("");
  }

  return (
    <div>
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {normalizedValues.map((value) => (
            <Badge key={value} tone="accent" className="gap-2 py-2">
              {value}
              <button type="button" onClick={() => onChange(normalizedValues.filter((item) => item !== value))}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="mt-3 flex gap-3">
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={placeholder ?? "Type and add"}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addTag();
              }
            }}
          />
          <Button variant="outline" onClick={addTag}>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
