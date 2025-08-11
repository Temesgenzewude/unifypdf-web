export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-foreground/70 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© {new Date().getFullYear()} UnifyPDF. All rights reserved.</span>
        <div className="flex items-center gap-3">
          <span>No storage: files processed in-memory only.</span>
          <a href="/privacy" className="underline underline-offset-2 hover:opacity-80">Privacy</a>
        </div>
      </div>
    </footer>
  );
}

