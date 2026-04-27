import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, UserRole, ProductCategory, ProductStatus, OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import pg from "pg";

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL || "";
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Bắt đầu seed database...");

  // Xóa dữ liệu cũ theo thứ tự đúng (tránh vi phạm foreign key)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Đã xóa dữ liệu cũ");

  // ============================================================
  // TẠO NGƯỜI DÙNG (Merchant + Buyers)
  // ============================================================
  const merchant = await prisma.user.create({
    data: {
      email: "tiemanxanh@cuutrocandate.vn",
      name: "Tiệm Ăn Xanh",
      phone: "0901234567",
      role: UserRole.MERCHANT,
      avatarUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400",
    },
  });

  const buyer1 = await prisma.user.create({
    data: {
      email: "nguyen.thi.a@gmail.com",
      name: "Nguyễn Thị A",
      phone: "0912345678",
      role: UserRole.BUYER,
    },
  });

  const buyer2 = await prisma.user.create({
    data: {
      email: "tran.van.b@gmail.com",
      name: "Trần Văn B",
      phone: "0987654321",
      role: UserRole.BUYER,
    },
  });

  console.log("👥 Đã tạo users:", merchant.name, buyer1.name, buyer2.name);

  // ============================================================
  // TẠO CỬA HÀNG
  // ============================================================
  const store = await prisma.store.create({
    data: {
      name: "Tiệm Ăn Xanh",
      description: "Cửa hàng thực phẩm cận date uy tín tại TP.HCM. Chúng tôi cam kết thực phẩm sạch, an toàn, giảm giá sâu.",
      address: "123 Nguyễn Văn Cừ, Phường 2, Quận 5, TP.HCM",
      lat: 10.762622,
      lng: 106.660172,
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800",
      rating: 4.8,
      isActive: true,
      ownerId: merchant.id,
    },
  });

  console.log("🏪 Đã tạo cửa hàng:", store.name);

  // ============================================================
  // TẠO SẢN PHẨM
  // ============================================================
  const now = new Date();
  const tonight2130 = new Date(now);
  tonight2130.setHours(21, 30, 0, 0);
  if (tonight2130 < now) tonight2130.setDate(tonight2130.getDate() + 1);
  const tonight2000 = new Date(now);
  tonight2000.setHours(20, 0, 0, 0);
  if (tonight2000 < now) tonight2000.setDate(tonight2000.getDate() + 1);
  const tonight2100 = new Date(now);
  tonight2100.setHours(21, 0, 0, 0);
  if (tonight2100 < now) tonight2100.setDate(tonight2100.getDate() + 1);
  const tomorrow1200 = new Date(now);
  tomorrow1200.setDate(tomorrow1200.getDate() + 1);
  tomorrow1200.setHours(12, 0, 0, 0);

  const product1 = await prisma.product.create({
    data: {
      storeId: store.id,
      name: "Túi bánh mì tổng hợp cuối ngày",
      description: "Gồm bánh mì que, bánh mì ngọt, croissant làm trong ngày. Còn thơm ngon, chưa hết hạn nhưng cần giải phóng kho.",
      imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
      category: ProductCategory.BAKED_GOODS,
      originalPrice: 80000,
      discountPrice: 30000,
      discountPercent: 63,
      quantityTotal: 10,
      quantityLeft: 7,
      expiryTime: tonight2130,
      pickupStart: tonight2000,
      pickupEnd: tonight2130,
      status: ProductStatus.AVAILABLE,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      storeId: store.id,
      name: "Cơm hộp thập cẩm cuối ngày",
      description: "Cơm trắng + 3 món mặn (thịt kho, canh, rau xào). Nấu buổi trưa, còn tươi ngon.",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
      category: ProductCategory.HOT_FOOD,
      originalPrice: 45000,
      discountPrice: 15000,
      discountPercent: 67,
      quantityTotal: 5,
      quantityLeft: 3,
      expiryTime: tonight2100,
      pickupStart: tonight2000,
      pickupEnd: tonight2100,
      status: ProductStatus.AVAILABLE,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      storeId: store.id,
      name: "Giỏ trái cây hỗn hợp",
      description: "Táo, cam, nho nhập khẩu. Sắp đến ngày best-before nhưng vẫn tươi ngon hoàn toàn.",
      imageUrl: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=800",
      category: ProductCategory.FRUIT_VEG,
      originalPrice: 120000,
      discountPrice: 50000,
      discountPercent: 58,
      quantityTotal: 8,
      quantityLeft: 5,
      expiryTime: tomorrow1200,
      pickupStart: tonight2000,
      pickupEnd: tonight2130,
      status: ProductStatus.AVAILABLE,
    },
  });

  const product4 = await prisma.product.create({
    data: {
      storeId: store.id,
      name: "Combo cơm chay 3 trong 1",
      description: "Đậu hũ kho, cải xào, canh rau. Hoàn toàn thuần chay, không hành không tỏi.",
      imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
      category: ProductCategory.VEGETARIAN,
      originalPrice: 55000,
      discountPrice: 20000,
      discountPercent: 64,
      quantityTotal: 6,
      quantityLeft: 4,
      expiryTime: tonight2100,
      pickupStart: tonight2000,
      pickupEnd: tonight2100,
      status: ProductStatus.AVAILABLE,
    },
  });

  console.log("🍱 Đã tạo 4 sản phẩm");

  // ============================================================
  // TẠO ĐƠN HÀNG MẪU
  // ============================================================

  // Đơn 1: CONFIRMED - Buyer1 đang chờ lấy hàng
  const order1Code = `CT-${Math.floor(100000 + Math.random() * 900000)}`;
  const order1 = await prisma.order.create({
    data: {
      orderCode: order1Code,
      totalAmount: 30000,
      status: OrderStatus.CONFIRMED,
      paymentMethod: PaymentMethod.MOMO,
      paymentStatus: PaymentStatus.PAID,
      pickupCode: `${Math.floor(100000 + Math.random() * 900000)}`,
      buyerId: buyer1.id,
      storeId: store.id,
      items: {
        create: {
          productId: product1.id,
          quantity: 1,
          unitPrice: 30000,
        },
      },
    },
  });

  // Đơn 2: PICKED_UP - Buyer2 đã hoàn thành
  const order2Code = `CT-${Math.floor(100000 + Math.random() * 900000)}`;
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const order2 = await prisma.order.create({
    data: {
      orderCode: order2Code,
      totalAmount: 35000,
      status: OrderStatus.PICKED_UP,
      paymentMethod: PaymentMethod.COD,
      paymentStatus: PaymentStatus.PAID,
      pickupCode: `${Math.floor(100000 + Math.random() * 900000)}`,
      buyerId: buyer2.id,
      storeId: store.id,
      createdAt: twoDaysAgo,
      items: {
        create: [
          { productId: product2.id, quantity: 1, unitPrice: 15000 },
          { productId: product4.id, quantity: 1, unitPrice: 20000 },
        ],
      },
    },
  });

  // Đơn 3: CANCELLED - Buyer1 đã hủy
  const order3Code = `CT-${Math.floor(100000 + Math.random() * 900000)}`;
  const threeDaysAgo = new Date(now);
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  await prisma.order.create({
    data: {
      orderCode: order3Code,
      totalAmount: 50000,
      status: OrderStatus.CANCELLED,
      paymentMethod: PaymentMethod.MOMO,
      paymentStatus: PaymentStatus.UNPAID,
      buyerId: buyer1.id,
      storeId: store.id,
      createdAt: threeDaysAgo,
      items: {
        create: { productId: product3.id, quantity: 1, unitPrice: 50000 },
      },
    },
  });

  console.log("📦 Đã tạo 3 đơn hàng mẫu");

  console.log("\n✅ Seed hoàn tất!");
  console.log("--------------------------------------");
  console.log(`🏪 Cửa hàng: ${store.name}`);
  console.log(`👤 Merchant: ${merchant.email}`);
  console.log(`🛒 Sản phẩm: ${[product1, product2, product3, product4].map(p => p.name).join(", ")}`);
  console.log(`📋 Đơn CONFIRMED: ${order1.orderCode}`);
  console.log(`📋 Đơn PICKED_UP: ${order2.orderCode}`);
  console.log("--------------------------------------");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error("❌ Seed thất bại:", e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
