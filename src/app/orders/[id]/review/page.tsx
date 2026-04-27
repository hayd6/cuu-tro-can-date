import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReviewClient from "@/components/ReviewClient";
import { authOptions } from "@/lib/auth";

export default async function OrderReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true
        }
      },
      store: true,
      reviews: {
        where: { userId: (session.user as any).id },
        take: 1
      }
    }
  });

  const existingReview = order?.reviews?.[0] || null;

  if (!order || order.buyerId !== (session.user as any).id) {
    return notFound();
  }

  // Check if order is eligible for review (PICKED_UP)
  if (order.status !== "PICKED_UP") {
    redirect("/orders");
  }

  return (
    <div className="bg-surface min-h-screen">
      <ReviewClient 
        order={order} 
        userId={(session.user as any).id} 
        initialReview={existingReview}
      />
    </div>
  );
}
