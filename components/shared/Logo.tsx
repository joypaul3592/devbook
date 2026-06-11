"use client";
import logoWhiteImg from "@/public/images/branding/logo-white.png";
import logoBlackImg from "@/public/images/branding/logo-black.png";
import Image from "next/image";
import { useTheme } from "../providers";
import Link from "next/link";

export default function Logo() {
  const { theme } = useTheme();
  return (
    <Link href="/" className="block">
      <Image
        src={theme === "light" ? logoBlackImg : logoWhiteImg}
        alt="branding Logo"
        className="h-8 w-fit"
      />
    </Link>
  );
}
