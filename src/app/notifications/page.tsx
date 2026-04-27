import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getUserNotifications } from "@/lib/actions/notifications";
import NotificationsClient from "@/components/NotificationsClient";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!user?.id) {
    redirect("/login");
  }

  const notifications = await getUserNotifications(user.id);

  return <NotificationsClient notifications={notifications} />;
}
