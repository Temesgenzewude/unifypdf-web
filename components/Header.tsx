import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-40">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <a href="/" className="font-semibold tracking-tight">UnifyPDF</a>
        <div className="flex items-center gap-4">
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <a href="/" className="hover:opacity-80">Merge</a>
           
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

