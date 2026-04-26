import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // 1. Dọn dẹp dữ liệu cũ
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.store.deleteMany({});
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ["buyer@test.com", "merchant@test.com"],
        },
      },
    });

    const hashedPassword = await bcrypt.hash("123456", 10);

    // 2. Tạo User Buyer
    await prisma.user.create({
      data: {
        email: "buyer@test.com",
        password: hashedPassword,
        name: "Người Mua Test",
        phone: "0900000001",
        role: "BUYER",
      },
    });

    // 3. Tạo User Merchant
    const merchant = await prisma.user.create({
      data: {
        email: "merchant@test.com",
        password: hashedPassword,
        name: "Người Bán Test",
        phone: "0900000002",
        role: "MERCHANT",
      },
    });

    // 4. Tạo Cửa hàng (Store) cho Merchant
    const store = await prisma.store.create({
      data: {
        name: "Tiệm Bánh Ánh Dương",
        address: "123 Đường Số 1, Quận 1, TP.HCM",
        lat: 10.7769,
        lng: 106.7009,
        ownerId: merchant.id,
      },
    });

    // 5. Thêm 4 sản phẩm mẫu
    const today = new Date();
    const tonight = new Date(today);
    tonight.setHours(20, 0, 0, 0); // 8 PM today
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(20, 0, 0, 0);

    await prisma.product.createMany({
      data: [
        {
          name: "Túi Bánh Mì Ngọt Hỗn Hợp",
          originalPrice: 100000,
          discountPrice: 40000,
          discountPercent: 60,
          quantityTotal: 5,
          quantityLeft: 5,
          expiryTime: tomorrow,
          pickupStart: tonight,
          pickupEnd: tomorrow,
          category: "BAKED_GOODS",
          storeId: store.id,
          imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwk2aO-yNfJt_uQ0w8V119430YxtJc-5MmM2U2T46O8T6zL7nRb7GZ3LwO6V-D43S4Hj3_18R1x5rN5iM4mG-g4wOa5u187t-W-z-PqO728T_xM992-U9oJ2yMzGIf2qG-t0z_gTnM-128RjW4pCg=s800",
          description: "Gồm 3-4 loại bánh ngọt thay đổi theo ngày.",
        },
        {
          name: "Cơm Chiên Hải Sản",
          originalPrice: 60000,
          discountPrice: 20000,
          discountPercent: 66,
          quantityTotal: 3,
          quantityLeft: 3,
          expiryTime: tonight,
          pickupStart: tonight,
          pickupEnd: tomorrow,
          category: "HOT_FOOD",
          storeId: store.id,
          imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1P9X-Z0lR-V-BkWqX52U-P5kG9zL-V_S61xLhR7c5m2v6GfVvE_O-2y0wO0L_U9Z9rS-nL65pYkV7O_F9L0K8D_hB5S2W5N7QJvWv85l0H0gR697zS2K7x3xO9F333G-x67kM-r0vO9r9lS9k3Pz0B9I=s800",
          description: "Cơm nóng nguyên hộp, an toàn chất lượng.",
        },
        {
          name: "Trái Cây Cắt Sẵn",
          originalPrice: 45000,
          discountPrice: 20000,
          discountPercent: 55,
          quantityTotal: 10,
          quantityLeft: 10,
          expiryTime: tonight,
          pickupStart: tonight,
          pickupEnd: tomorrow,
          category: "FRUIT_VEG",
          storeId: store.id,
          imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrC5bXfXmP2hWq2FqZp_A6w0N6_hQwL8kIuP8Yl9pEfZl8w2Y7hZqZ9Ew0lH5FfZn0wH_gL_nQmVyMvqR8LwQh_hF_tO0vA39hN7K9r9d2P5V-Wl_H6S0C_J0P-0nZfO0L-4vO6t_4M-_YmH3P4I-Yq9U=s800",
          description: "Mix Dưa hấu, ổi, xoài... Tươi ngon.",
        },
        {
          name: "Sữa Chua Dâu Tây",
          originalPrice: 35000,
          discountPrice: 15000,
          discountPercent: 57,
          quantityTotal: 20,
          quantityLeft: 20,
          expiryTime: tomorrow,
          pickupStart: tonight,
          pickupEnd: tomorrow,
          category: "DRINKS",
          storeId: store.id,
          imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA23-qF36Vf64K68q9YnO0D-yL-p4a29u91N11vM3jX9H3O_cE76Q_-9K-qJ1P0O3hGq0T-nL-Z9L51_86E1VlQ-iM1_UqT6f7nI883F-h9Q-_E7_6M_n5L_-vF2uT--pA6v4K_KqhR-_K2oA0qA33fTQ=s800",
          description: "Cần bảo quản lạnh.",
        },
      ],
    });

    return NextResponse.json({ message: "Seeding thành công! Tài khoản: buyer@test.com / 123456 và merchant@test.com / 123456" });
  } catch (error: any) {
    console.error("Error seeding:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
