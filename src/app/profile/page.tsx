import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfileClient from "@/components/ProfileClient";
import { authOptions } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  // Import directly inside async function if needed, or at the top
  const { getUserGreenStats } = await import("@/lib/actions/users");
  const greenStats = await getUserGreenStats(user.id);

  return (
    <ProfileClient 
      key={user.role} 
      user={{
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        role: user.role,
      }} 
      greenStats={greenStats}
    />
  );
}
