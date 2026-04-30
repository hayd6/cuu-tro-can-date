## Nhóm 12: Dự án Cứu Trợ Cận Date

## Danh sách thành viên

Tên: Nguyễn Huynh Đệ
MSSV: 24126046
Vai trò: Full-stack Developer
Tên: Lương Mỹ Hân
MSSV: 24126065
Vai trò: Developer Support

## Mô tả dự án:

Cứu Trợ Cận Date là nền tảng Thương mại điện tử O2O chuyên biệt, được xây dựng nhằm giải quyết bài toán lãng phí thực phẩm. Ứng dụng kết nối người mua với các cửa hàng đang có thực phẩm cận hạn sử dụng hoặc cần bán nhanh trong ngày, giúp cửa hàng giảm thất thoát và giúp người dùng mua sản phẩm chất lượng với giá ưu đãi.

## Chủ đề và Giá trị cốt lõi:

Mô hình O2O & Tiêu dùng bền vững: Nền tảng tập trung vào thực phẩm cận hạn, hướng đến việc giảm thiểu rác thải hữu cơ và thúc đẩy lối sống xanh.
Giá trị: Phát hiện sản phẩm Nhanh chóng theo vị trí (Geo-Discovery), đảm bảo giao dịch Minh bạch và Tiết kiệm chi phí cho người dùng.

## Tính năng kỹ thuật nổi bật:

Khám phá theo Bản đồ: Hiển thị vị trí cửa hàng có sản phẩm khả dụng trên bản đồ tương tác, tích hợp tính năng gom cụm điểm (Clustering) để tối ưu hiệu suất.
Xác nhận giao dịch an toàn: Quy trình đặt hàng khép kín (Order Flow) và xác thực nhận hàng tại điểm bán bằng cách quét Mã QR hoặc nhập Mã PIN dự phòng.
Gamification: Tích hợp thuật toán Server-Side để tính toán và quy đổi số lượng món ăn đã "cứu" thành Số kg thực phẩm tránh lãng phí và Lượng CO2 giảm thải, khích lệ người dùng bằng hệ thống Hồ sơ Xanh.
Công nghệ: Hệ thống full-stack được phát triển bằng Next.js 16 (App Router), sử dụng PostgreSQL qua Prisma ORM để đảm bảo tính toàn vẹn dữ liệu.

## Link Figma:

https://www.figma.com/design/NMF7Ml7Oj3JXNNFzZQSOif/C%E1%BB%A9u-Tr%E1%BB%A3-C%E1%BA%ADn-Date?node-id=0-1&t=Sx41XFOdkYQU1mib-1

## Link vercel:

https://cuu-tro-can-date.vercel.app/

## Hướng dẫn chạy local:

Để triển khai và chạy hệ thống trên môi trường cục bộ (local), dự án sử dụng trình quản lý gói Node.js thông qua npm. Người dùng trước tiên cần cài đặt toàn bộ các thư viện và phụ thuộc cần thiết bằng lệnh "npm install". Quá trình này sẽ tự động tải về và thiết lập các module được định nghĩa trong tệp package.json.
Sau khi hoàn tất bước cài đặt, hệ thống có thể được khởi chạy bằng lệnh "npm run dev", cho phép ứng dụng vận hành ở chế độ phát triển (development mode). Ở chế độ này, framework Next.js hỗ trợ tự động reload khi có thay đổi trong mã nguồn, giúp quá trình phát triển và kiểm thử trở nên nhanh chóng và hiệu quả hơn.
Việc sử dụng quy trình cài đặt và khởi chạy đơn giản thông qua npm không chỉ đảm bảo tính nhất quán trong môi trường phát triển mà còn giúp giảm thiểu các lỗi cấu hình, tạo điều kiện thuận lợi cho việc triển khai và mở rộng hệ thống.
