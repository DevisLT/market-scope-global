import { Link } from "react-router-dom";
import priceflowLogo from "@/assets/priceflow-logo.png";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  linkTo?: string | null;
}

const sizeMap = {
  sm: "h-7",
  md: "h-10",
  lg: "h-12",
  xl: "h-16",
  "2xl": "h-24",
};

export function Logo({ className, size = "md", linkTo = "/" }: LogoProps) {
  const img = (
    <img
      src={priceflowLogo}
      alt="PriceFlow — AI Market Intelligence"
      className={cn(sizeMap[size], "w-auto object-contain drop-shadow-[0_0_18px_hsl(var(--primary)/0.35)]", className)}
    />
  );
  if (linkTo === null) return img;
  return (
    <Link to={linkTo} className="inline-flex items-center" aria-label="PriceFlow home">
      {img}
    </Link>
  );
}
