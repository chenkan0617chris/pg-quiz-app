"use client";

import { useI18n } from "@/lib/i18n";

export default function ComingSoon() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex w-full max-w-md flex-col items-center rounded-xl border border-gray-200 bg-white px-8 py-12 text-center shadow-sm">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50">
          <svg
            className="h-10 w-10 text-indigo-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">
          {t("comingSoon")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          {t("comingSoonBody")}
        </p>
      </div>
    </div>
  );
}
