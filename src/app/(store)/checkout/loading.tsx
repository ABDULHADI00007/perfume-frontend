import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="border-b border-border/80 py-4">
        <Container>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
        </Container>
      </div>

      <main className="py-8 sm:py-12 lg:py-16">
        <Container>
          <div className="mb-8 space-y-2">
            <Skeleton className="h-9 w-44" />
            <Skeleton className="h-4 w-64" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-7 space-y-8">
              <div className="p-8 border border-border space-y-6">
                <Skeleton className="h-6 w-52" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              <div className="p-8 border border-border space-y-6">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-10 w-full" />
                <div className="grid grid-cols-3 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="p-8 border border-border space-y-6">
                <Skeleton className="h-6 w-40" />
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
