"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import defaultAvatar from "@/assets/images/avatar-mac-dinh.jpg";
import huynhDeAvatar from "@/assets/images/avatar-nguyen-huynh-de-24126046.jpg";
import myHanAvatar from "@/assets/images/avatar-luong-my-han-24126065.jpg";

const members = [
  {
    name: "Nguyễn Huynh Đệ",
    mssv: "24126046",
    role: "Fullstack Developer",
    github: "https://github.com/hayd6",
    avatar: huynhDeAvatar.src,
  },
  {
    name: "Lương Mỹ Hân",
    mssv: "24126065",
    role: "Developer (Support)",
    github: "https://github.com/Lgmyhawn26",
    avatar: myHanAvatar.src,
  },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-emerald-50 to-white px-4 md:px-8 lg:px-12 py-16 overflow-hidden">

      {/* BACKGROUND BLUR */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#10B981]/20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#10B981]/10 blur-3xl rounded-full" />

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 relative z-10"
      >
        <h1 className="text-5xl font-bold text-[#10B981] mb-4">
          Về Chúng Tôi
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Cứu Trợ Cận Date là nền tảng kết nối người mua với các cửa hàng đang có thực phẩm cận hạn hoặc cần bán nhanh trong ngày. Ứng dụng giúp cửa hàng giảm thất thoát, đồng thời giúp người dùng mua thực phẩm với giá tốt hơn so với giá gốc.
        </p>
      </motion.div>

      {/* MEMBERS */}
      <div className="flex flex-wrap justify-center gap-10 relative z-10 mb-20 max-w-5xl mx-auto">
        {members.map((member, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -10, scale: 1.02 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="w-full sm:w-[320px] relative bg-white/60 backdrop-blur-xl border border-white/30 rounded-3xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            {/* Avatar */}
            <div className="relative w-fit mx-auto mb-4">
              <img
                src={member.avatar}
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-[#10B981]"
              />
              <div className="absolute inset-0 rounded-full bg-[#10B981]/20 blur-md -z-10" />
            </div>

            <h3 className="text-lg font-semibold">{member.name}</h3>
            <p className="text-sm text-gray-500">{member.mssv}</p>

            <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-[#10B981]/10 text-[#10B981]">
              {member.role}
            </span>

            <div className="mt-4 flex justify-center gap-4">
              <a
                href={member.github}
                target="_blank"
                className="p-2 rounded-full bg-gray-100 hover:bg-[#10B981] hover:text-white transition flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* APP LINK */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-20"
      >
        <h2 className="text-2xl font-semibold mb-6">
          Truy cập ứng dụng
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="relative inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-xl overflow-hidden group"
          >
            {/* Gradient */}
            <span className="absolute inset-0 bg-gradient-to-r from-[#10B981] to-emerald-400 transition-all group-hover:scale-110" />
            
            {/* Shine effect */}
            <span className="absolute left-[-100%] top-0 h-full w-full bg-white/20 skew-x-12 group-hover:left-[200%] transition-all duration-700" />

            <span className="relative flex items-center gap-2">
              Cứu Trợ Cận Date
              <ExternalLink size={18} />
            </span>
          </Link>

          <a
            href="https://vercel.com" /* TODO: Thay thế link deploy Vercel của bạn tại đây */
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-xl overflow-hidden group"
          >
            {/* Gradient */}
            <span className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black transition-all group-hover:scale-110" />
            
            {/* Shine effect */}
            <span className="absolute left-[-100%] top-0 h-full w-full bg-white/10 skew-x-12 group-hover:left-[200%] transition-all duration-700" />

            <span className="relative flex items-center gap-2">
              Vercel
              <ExternalLink size={18} />
            </span>
          </a>
        </div>
      </motion.div>

      {/* ABOUT APP */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-white/30"
      >
        <h2 className="text-3xl font-semibold text-[#10B981] mb-4">
          Giới thiệu ứng dụng
        </h2>

        <p className="text-gray-600 leading-relaxed text-lg">
          Cứu Trợ Cận Date là nền tảng kết nối người mua với các cửa hàng đang có thực phẩm cận hạn hoặc cần bán nhanh trong ngày. Ứng dụng giúp cửa hàng giảm thất thoát, đồng thời giúp người dùng mua thực phẩm với giá tốt hơn so với giá gốc. 
        
        </p>
      </motion.div>

      {/* FOOTER */}
      <div className="text-center mt-16 text-sm text-gray-400">
        © 2026 Cứu Trợ Cận Date
      </div>
    </div>
  );
}
