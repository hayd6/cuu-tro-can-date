import { prisma } from "../src/lib/prisma";

async function main() {
  // Find a user to attach notifications to (e.g. the first buyer)
  const user = await prisma.user.findFirst();
  
  if (!user) {
    console.log("No users found to seed notifications");
    return;
  }

  console.log(`Seeding notifications for user: ${user.name || user.email} (${user.id})`);

  // Clear existing notifications
  await prisma.notification.deleteMany({
    where: { userId: user.id }
  });

  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const older = new Date(now);
  older.setDate(older.getDate() - 3);

  // Seed Today
  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        title: "Khẩn cấp",
        message: "<span class='text-error'>KHẨN CẤP:</span> Tiệm Bánh Mì Xanh vừa đăng 5 túi mù xả hàng! Cứu ngay kẻo lỡ.",
        type: "EMERGENCY",
        isRead: false,
        createdAt: now
      },
      {
        userId: user.id,
        title: "Đơn hàng",
        message: "Đơn hàng #847-291 đang chờ bạn lấy. Hết hạn lúc <span class='font-bold text-primary'>21:00</span>.",
        type: "ORDER",
        isRead: true,
        createdAt: new Date(now.getTime() - 15 * 60000) // 15 mins ago
      }
    ]
  });

  // Seed Yesterday
  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        title: "Hệ thống",
        message: "Chúc mừng! Bạn đã giúp giảm thiểu <span class='font-bold'>2kg CO2</span> trong tuần này. Xem báo cáo chi tiết.",
        type: "SYSTEM",
        isRead: true,
        createdAt: yesterday
      },
      {
        userId: user.id,
        title: "Khuyến mãi",
        message: "Nhận voucher giảm <span class='text-tertiary font-bold'>10k</span> cho đơn hàng cứu trợ tiếp theo.",
        type: "PROMOTION",
        isRead: true,
        createdAt: yesterday
      }
    ]
  });

  // Seed Older
  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        title: "Đơn hàng",
        message: "Đơn hàng tại <strong class='text-on-surface'>Lò Bánh Mì Hưng Phát</strong> đã hoàn tất thành công.",
        type: "ORDER",
        isRead: true,
        createdAt: older
      },
      {
        userId: user.id,
        title: "Đánh giá",
        message: "Bạn đã đánh giá 5 sao cho đơn hàng <strong class='text-on-surface'>Cơm Chay An Nhiên</strong>.",
        type: "REVIEW",
        isRead: true,
        createdAt: older
      }
    ]
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
