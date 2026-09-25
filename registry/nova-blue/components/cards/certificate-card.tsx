import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { CredlyBadgeItem } from "../../../lib/portfolio/credly";
import Image from "next/image";

export default function CertificateBadge({
  item,
}: Readonly<{ item: CredlyBadgeItem }>) {
  const badge = item;

  const date = item.issued_at
    ? new Date(item.issued_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  const shortId = item.id?.slice(-8).toUpperCase() ?? "—";

  // Credly's public verify URL pattern
  const verifyUrl = `https://www.credly.com/badges/${item.id}/public_url`;

  return (
    <div className="border group transition-colors duration-300 flex items-center  hover:bg-white/2  p-6  border-slate-600/50 hover:border-blue-400/50">
      {/* Header Row */}
      <div className="flex items-center gap-6 ">
        <div className="p-3  scale-110 transition-transform duration-500 shrink-0">
          {badge.image_url ? (
            <Image
              src={badge.image_url}
              alt={badge.name}
              width={160}
              height={160}
              className="size-30 md:size-40 object-contain"
            />
          ) : (
            <span className="text-2xl">🏅</span>
          )}
        </div>

        <div className="grow min-w-0">
          <div className="mb-4 ">
            <div className="flex items-center gap-2 mb-1 ">
              <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider group-hover:text-white">
                {date}
              </span>
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest group-hover:text-white">
                ID: {shortId}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">
              {badge.name}
            </h3>
          </div>

          <div className="max-w-4xl ">
            {badge.description && (
              <p className="text-sm text-zinc-500 leading-relaxed  group-hover:text-white line-clamp-3 mt-4 mb-4">
                {badge.description}
              </p>
            )}

            {/* Footer Info Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-white/5 gap-4">
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm   tracking-[0.2em] text-white/60 hover:text-blue-400 transition-all group/link group-hover:text-white"
                >
                  View Certificate
                  <ChevronRight
                    size={14}
                    className="group-hover/link:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
