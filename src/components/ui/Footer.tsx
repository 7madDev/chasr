import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border py-6 mt-auto">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs text-muted-foreground/70">
        <span>
          Powered by{" "}
          <Link
            href="https://announcify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
          >
            Announcify
          </Link>
        </span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
