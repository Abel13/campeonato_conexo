"use client";
import { useRouter } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  const router = useRouter();
  return <div onClick={() => router.push(href)}>{children}</div>;
}
