import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "./Icons";

type Variant = "ink" | "light" | "teal" | "on-dark";
const variantClass: Record<Variant, string> = {
  ink: "",
  light: "btn-light",
  teal: "btn-teal",
  "on-dark": "btn-on-dark",
};

export function ArrowBadge() {
  return (
    <span className="btn-icon">
      <span className="flip-rtl inline-flex">
        <ArrowRight />
      </span>
    </span>
  );
}

export function ButtonLink({
  children,
  variant = "ink",
  className,
  ...props
}: { children: ReactNode; variant?: Variant } & ComponentProps<typeof Link>) {
  return (
    <Link {...props} className={`btn ${variantClass[variant]} ${className ?? ""}`}>
      <span>{children}</span>
      <ArrowBadge />
    </Link>
  );
}
