import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import MyReviewsClient from "@/components/MyReviewsClient";
import { getUserReviews, getUserReviewStats } from "@/lib/actions/reviews";

export default async function MyReviewsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!user?.id) {
    redirect("/login");
  }

  // Fetch real reviews and stats
  const reviews = await getUserReviews(user.id);
  const stats = await getUserReviewStats(user.id);

  return <MyReviewsClient initialReviews={reviews} stats={stats} />;
}
