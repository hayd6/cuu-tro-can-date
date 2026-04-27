import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MerchantReviewsClient from "@/components/MerchantReviewsClient";
import { redirect } from "next/navigation";

const DEMO_MERCHANT_EMAIL = "tiemanxanh@cuutrocandate.vn";

export default async function MerchantReviewsPage() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email || DEMO_MERCHANT_EMAIL;

  const merchantUser = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      store: {
        include: {
          reviews: {
            include: {
              user: {
                select: { name: true, avatarUrl: true }
              }
            },
            orderBy: { createdAt: "desc" }
          }
        }
      }
    }
  });

  if (!merchantUser?.store) {
    redirect("/merchant");
  }

  return (
    <div className="bg-surface min-h-[100dvh] pb-32">
      <MerchantReviewsClient reviews={merchantUser.store.reviews} />
    </div>
  );
}
