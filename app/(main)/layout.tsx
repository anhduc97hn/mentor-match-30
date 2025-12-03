import MainLayout from "@/src/layout/MainLayout";

export default async function MainPagesLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
