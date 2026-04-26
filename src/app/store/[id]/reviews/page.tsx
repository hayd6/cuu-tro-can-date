import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import StoreReviewsClient from "@/components/StoreReviewsClient";
import { getStoreReviews, getStoreReviewStats } from "@/lib/actions/reviews";
import { notFound } from "next/navigation";

export default async function StoreReviewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: storeId } = await params;
  
  const store = await prisma.store.findUnique({
    where: { id: storeId },
    select: { ownerId: true }
  });

  if (!store) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as any)?.id;
  const isOwner = currentUserId === store.ownerId;

  // Fetch real reviews and stats
  const reviews = await getStoreReviews(storeId);
  const stats = await getStoreReviewStats(storeId);

  return (
    <StoreReviewsClient 
      initialReviews={reviews} 
      stats={stats} 
      isOwner={isOwner} 
    />
  );
}
