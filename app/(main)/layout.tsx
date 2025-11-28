// app/(main)/layout.tsx

import MainLayout from "@/src/layout/MainLayout"; // Adjust path as needed

export default function MainPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}