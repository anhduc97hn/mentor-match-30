// app/(auth)/layout.tsx

import BlankLayout from "@/src/layout/BlankLayout"; 

export default function AuthPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BlankLayout>{children}</BlankLayout>;
}