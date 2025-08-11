import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-40">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">UnifyPDF</Link>
        <div className="flex items-center gap-4">
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <Link href="/" className="hover:opacity-80">Merge</Link>
           
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

