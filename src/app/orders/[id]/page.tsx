import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getOrderById } from "@/lib/actions/orders";
import { notFound } from "next/navigation";
import OrderDetailsClient from "@/components/OrderDetailsClient";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: orderId } = await params;
  
  const order = await getOrderById(orderId);

  if (!order) {
    notFound();
  }

  return <OrderDetailsClient order={order} />;
}
