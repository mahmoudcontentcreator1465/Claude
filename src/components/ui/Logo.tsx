import Image from "next/image";
import logoDark from "@/assets/brand/different-logo-dark.png";
import logoWhite from "@/assets/brand/different-logo-white.png";

/**
 * Official Different logo.
 * - `dark`: black + teal version for light backgrounds (derived from the official
 *   white file by recolouring only the white parts to #111111).
 * - `white`: the original white + teal file, for dark backgrounds.
 */
export function Logo({
  variant = "dark",
  className,
  priority,
}: {
  variant?: "dark" | "white";
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={variant === "dark" ? logoDark : logoWhite}
      alt="Different"
      className={className}
      priority={priority}
      sizes="(min-width: 768px) 180px, 140px"
    />
  );
}
