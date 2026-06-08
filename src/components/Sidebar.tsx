"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n, type DictKey } from "@/lib/i18n";

type NavItem = {
  href: string;
  key: DictKey;
  icon: React.ReactNode;
};

const iconClass = "h-5 w-5 shrink-0";

const NAV: NavItem[] = [
  {
    href: "/pipeline",
    key: "navPipeline",
    icon: (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 7h7a3 3 0 0 1 3 3v4a3 3 0 0 0 3 3h3" />
        <rect x="2" y="4" width="4" height="6" rx="1" />
        <rect x="18" y="14" width="4" height="6" rx="1" />
      </svg>
    ),
  },
  {
    href: "/series",
    key: "navSeries",
    icon: (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="6" cy="6" r="2.5" />
        <rect x="14.5" y="3.5" width="5" height="5" rx="1" />
        <path d="M4 15.5 6.5 21h-5z" />
        <path d="M14.5 18.5h5M17 16v5" />
      </svg>
    ),
  },
  {
    href: "/numerical",
    key: "navNumerical",
    icon: (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { t, lang, toggle } = useI18n();

  return (
    <aside className="flex w-16 shrink-0 flex-col border-r border-gray-200 bg-gray-50/60 px-2 py-5 sm:w-60 sm:px-4">
      {/* Brand */}
      <div className="mb-8 flex items-center gap-2.5 px-1 sm:px-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white shadow-sm">
          P
        </span>
        <span className="hidden truncate text-base font-semibold tracking-tight text-slate-900 sm:block">
          {t("appName")}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              title={t(item.key)}
              className={[
                "flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors sm:px-3",
                "justify-center sm:justify-start",
                active
                  ? "bg-indigo-50 font-medium text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
              ].join(" ")}
            >
              {item.icon}
              <span className="hidden truncate sm:block">{t(item.key)}</span>
            </Link>
          );
        })}
      </nav>

      {/* Language toggle */}
      <button
        type="button"
        onClick={toggle}
        title={t("language")}
        className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-2 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 sm:px-3"
      >
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
        </svg>
        <span className="hidden sm:block">
          {lang === "zh" ? "English" : "中文"}
        </span>
      </button>
    </aside>
  );
}
