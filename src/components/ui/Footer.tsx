import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-16 mt-auto w-full border-t border-neutral-100 dark:border-zinc-900/50">
      <div className="max-w-2xl mx-auto px-4 flex flex-col items-center gap-8">

        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-zinc-100 hover:opacity-80 transition-opacity"
        >
          chasr
        </Link>

        {/* <div className="flex items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 dark:text-zinc-500">
          <Link href="/privacy" className="hover:text-neutral-900 dark:hover:text-zinc-100 transition-colors">
            privacy
          </Link>
          <Link href="/terms" className="hover:text-neutral-900 dark:hover:text-zinc-100 transition-colors">
            terms
          </Link>
          <Link href="https://x.com/erramix01" target="_blank" className="hover:text-neutral-900 dark:hover:text-zinc-100 transition-colors">
            twitter
          </Link>
        </div> */}

        <div className="text-[10px] tracking-[0.15em] uppercase text-neutral-400/80 dark:text-zinc-600 text-center leading-relaxed">
          © {new Date().getFullYear()} chasr. powered by{" "}
          <Link
            href="https://announcify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 dark:text-zinc-400 hover:text-[#C13D19] dark:hover:text-[#E85D38] transition-colors font-semibold"
          >
            announcify
          </Link>
          .<br className="block sm:hidden my-1" /> built with love by{" "}
          <Link
            href="https://x.com/erramix01"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 dark:text-zinc-400 hover:text-[#C13D19] dark:hover:text-[#E85D38] transition-colors font-semibold lowercase"
          >
            @erramix01
          </Link>
        </div>

      </div>
    </footer>
  );
}