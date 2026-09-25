"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navSections } from "@/data/Navlinks";
import { Icon } from "@/components";
import Logo from "@/components/ui/Logo";
import Container from "@/layout/Container";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [generalSection, logoSection] = navSections;
  const closeMenu = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.closest("details")?.removeAttribute("open");
  };
  const currentLink = logoSection.links.find(
    (link) => pathname === link.href || pathname.startsWith(`${link.href}/`),
  );

  return (
    <Container className="items-center">
      <nav className="flex w-full flex-wrap items-center justify-between gap-y-2 py-3">
        <div className="flex items-center gap-4">
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-2 [&::-webkit-details-marker]:hidden  px-3 py-2 text-md font-medium text-white transition-colors h">
              <Logo variant="logo" />
              <span className="text-md font-medium">
                {currentLink?.label ?? logoSection.label}
              </span>
              <ChevronDown className=" text-foreground transition-transform group-open:rotate-180" />
            </summary>
            <ul className="absolute left-0 top-full z-50 mt-3 min-w-52 select-none rounded-md bg-base-300 p-2 text-white shadow-xl">
              {logoSection.links.map((link) => (
                <li key={link.href}>
                  <Link
                    className="flex items-center gap-3 px-3 py-2 text-md font-medium text-white transition-colors hover:bg-base-200 hover:text-primary-content"
                    href={link.href}
                    onClick={closeMenu}
                  >
                    <Icon name={link.icon} size={20} aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </div>
        <ul className="flex items-center gap-4">
          {generalSection.links.map((link) => (
            <li key={link.href}>
              <Link
                aria-label={link.label}
                className="flex items-center gap-3 px-3 py-2 text-md font-medium text-white transition-colors hover:bg-base-200 hover:text-primary-content"
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
              >
                {link.icon && (
                  <link.icon aria-hidden="true" className="size-5" />
                )}
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
}
