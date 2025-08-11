"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type QueuedPdf = {
  file: File;
  id: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3050";
const MAX_FILES = 20;
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25MB per file

export default function Home() {
  const [queue, setQueue] = useState<QueuedPdf[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (mergedUrl) URL.revokeObjectURL(mergedUrl);
    };
  }, [mergedUrl]);

  // When queue becomes empty, clear any existing merged preview and buttons
  useEffect(() => {
    if (queue.length === 0 && mergedUrl) {
      URL.revokeObjectURL(mergedUrl);
      setMergedUrl(null);
    }
  }, [queue.length, mergedUrl]);

  const totalSize = useMemo(() => queue.reduce((acc, q) => acc + q.file.size, 0), [queue]);

  const addFiles = useCallback((files: FileList | File[]) => {
    setError(null);
    const list = Array.from(files);
    const sanitized = list.filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    const tooLarge = sanitized.find((f) => f.size > MAX_FILE_SIZE_BYTES);
    if (tooLarge) {
      setError(`File too large: ${tooLarge.name}. Max 25MB per file.`);
      return;
    }

    setQueue((prev) => {
      const available = Math.max(0, MAX_FILES - prev.length);
      const next = sanitized.slice(0, available).map((file) => ({ file, id: crypto.randomUUID() }));
      if (sanitized.length > available) {
        setError(`Only ${MAX_FILES} files allowed per merge.`);
      }
      // reset preview when queue changes
      if (mergedUrl) URL.revokeObjectURL(mergedUrl);
      setMergedUrl(null);
      return [...prev, ...next];
    });
  }, [mergedUrl]);

  const removeAt = useCallback((index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const move = useCallback((index: number, direction: -1 | 1) => {
    setQueue((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      addFiles(e.dataTransfer.files);
    }
  }, [addFiles]);

  const handleMerge = useCallback(async () => {
    if (queue.length < 2) {
      setError("Please add at least two PDFs.");
      return;
    }
    setIsMerging(true);
    setError(null);
    try {
      const form = new FormData();
      for (const item of queue) {
        form.append("files", item.file, item.file.name);
      }
      const res = await fetch(`${API_BASE_URL}/pdf/merge`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Merge failed with status ${res.status}`);
      }
      const blob = await res.blob();
      if (mergedUrl) URL.revokeObjectURL(mergedUrl);
      const url = URL.createObjectURL(blob);
      setMergedUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to merge PDFs");
    } finally {
      setIsMerging(false);
    }
  }, [queue, mergedUrl]);

  const handleDownload = useCallback(() => {
    if (!mergedUrl) return;
    const a = document.createElement("a");
    a.href = mergedUrl;
    a.download = "merged.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [mergedUrl]);

  const clearAll = useCallback(() => {
    setQueue([]);
    setError(null);
    if (mergedUrl) URL.revokeObjectURL(mergedUrl);
    setMergedUrl(null);
  }, [mergedUrl]);

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">UnifyPDF</h1>
        <p className="text-foreground/70 mt-2">Upload, merge, preview, and download PDFs. Files never leave your browser except to merge on server. No storage.</p>

        <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-border rounded-lg p-6 sm:p-8 flex flex-col items-center justify-center text-center bg-card"
            >
              <p className="text-sm text-foreground/70">Drag and drop PDFs here</p>
              <p className="text-xs text-foreground/50 mt-1">or</p>
              <button
                onClick={() => inputRef.current?.click()}
                className="mt-3 inline-flex items-center justify-center rounded-md bg-primary hover:bg-[--color-primary-hover] px-4 py-2 text-primary-foreground text-sm font-medium disabled:opacity-50"
              >
                Choose files
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) addFiles(e.target.files);
                  // Reset input to allow re-adding same files
                  if (inputRef.current) inputRef.current.value = "";
                }}
              />
              <div className="mt-3 text-xs text-foreground/60">Up to {MAX_FILES} files, ≤ 25MB each</div>
            </div>

            {queue.length > 0 && (
              <div className="mt-6 bg-card rounded-lg border border-border">
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="text-sm text-foreground">
                    {queue.length} file{queue.length > 1 ? "s" : ""} • {(totalSize / (1024 * 1024)).toFixed(2)} MB total
                  </div>
                  <button onClick={clearAll} className="text-sm text-foreground/70 hover:text-foreground">Clear</button>
                </div>
                <ul className="divide-y divide-border">
                  {queue.map((item, idx) => (
                    <li key={item.id} className="flex items-center justify-between px-4 py-3">
                      <div className="min-w-0 pr-3">
                        <p className="truncate text-sm font-medium">{item.file.name}</p>
                        <p className="text-xs text-foreground/60">{(item.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          aria-label="Move up"
                          onClick={() => move(idx, -1)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded border border-border hover:bg-muted disabled:opacity-40"
                          disabled={idx === 0}
                        >
                          ↑
                        </button>
                        <button
                          aria-label="Move down"
                          onClick={() => move(idx, 1)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded border border-border hover:bg-muted disabled:opacity-40"
                          disabled={idx === queue.length - 1}
                        >
                          ↓
                        </button>
                        <button
                          aria-label="Remove"
                          onClick={() => removeAt(idx)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded border border-danger text-danger hover:bg-danger/10"
                        >
                          ✕
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleMerge}
                disabled={queue.length < 2 || isMerging}
                className="inline-flex items-center justify-center rounded-md bg-primary hover:bg-[--color-primary-hover] px-4 py-2 text-primary-foreground text-sm font-medium disabled:opacity-50"
              >
                {isMerging ? "Merging..." : "Merge PDFs"}
              </button>
              {mergedUrl && queue.length > 0 && (
                <>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2 text-background text-sm font-medium hover:opacity-90"
                  >
                    Download merged.pdf
                  </button>
                  <a
                    href={mergedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
                  >
                    Open in new tab
                  </a>
                </>
              )}
            </div>

            {error && (
              <div className="mt-4 text-sm text-danger">{error}</div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-4 h-full">
              <h2 className="font-medium">Preview</h2>
              <div className="mt-3 aspect-[1/1.414] w-full border border-border rounded overflow-hidden bg-muted flex items-center justify-center">
                {mergedUrl && queue.length > 0 ? (
                  <iframe src={mergedUrl} className="w-full h-full" title="Merged PDF preview" />
                ) : (
                  <span className="text-xs text-foreground/60">Merged PDF will appear here</span>
                )}
              </div>
            </div>
          </div>
        </section>

        <p className="text-xs text-foreground/60 mt-6">
          Processing happens in-memory. No files are stored server-side. Clear your browser tab to remove the preview from memory.
        </p>
      </div>
    </div>
  );
}
