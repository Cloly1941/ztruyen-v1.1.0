# Ztruyện v1.1

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=000000" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=000000" alt="Firebase">
  <img src="https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA">
</div>

## 🚀 Giới thiệu

**Ztruyện v1.1** là ứng dụng đọc truyện tranh online được xây dựng với **Next.js App Router**, tập trung vào trải nghiệm đọc **Manhwa, Manga, Manhua** trên web.

Dự án hỗ trợ đầy đủ các tính năng như đăng nhập, quản lý tài khoản, lịch sử đọc, truyện yêu thích, bình luận, thông báo đẩy, PWA và tích hợp Google Analytics để theo dõi lượng người dùng.

Backend repository: [ztruyen-be](https://github.com/nguyentrongbut/ztruyen-be)

Frontend admin repository: [ztruyen-admin](https://github.com/Cloly1941/ztruyen-admin)

---

## 📊 Thống kê người dùng GA4

Ảnh dưới đây là minh chứng số lượng người dùng được ghi nhận từ **Google Analytics 4**:

<div align="center">
  <img src="https://res.cloudinary.com/dnj4p1bry/image/upload/v1779370448/Screenshot_2026-05-21_200652_lc8gjk.png" alt="Thống kê số lượng người dùng GA4" width="900">
</div>

---

## ✨ Tính năng chính

- Trang chủ hiển thị carousel, danh mục thể loại và các danh sách truyện được đề xuất.
- Xem danh sách truyện theo trạng thái, thể loại, top tuần theo quốc gia và tìm kiếm truyện.
- Trang chi tiết truyện, danh sách chương và giao diện đọc truyện theo chương.
- Xác thực người dùng: đăng ký, đăng nhập, đăng xuất, quên mật khẩu, đổi mật khẩu và đăng nhập mạng xã hội.
- Khu vực tài khoản: cập nhật hồ sơ, ảnh đại diện, khung avatar, cài đặt chung và truyện yêu thích.
- Lịch sử đọc và tiến độ đọc truyện.
- Bình luận, emoji, thông báo, thông báo đẩy Firebase Cloud Messaging và banner thông báo.
- PWA với manifest, service worker và cache runtime qua `next-pwa`.
- Dark/light theme qua `next-themes`.
- Kiểm thử với Jest và Testing Library.

---

## 🛠️ Tech Stack

- [Next.js 15](https://nextjs.org/) – React framework với App Router.
- [React 19](https://react.dev/) – Xây dựng giao diện người dùng.
- [TypeScript](https://www.typescriptlang.org/) – Static typing giúp code an toàn và dễ bảo trì hơn.
- [Tailwind CSS 4](https://tailwindcss.com/) – Utility-first CSS framework.
- [Radix UI](https://www.radix-ui.com/) – Bộ primitive UI dễ tùy biến.
- [shadcn/ui](https://ui.shadcn.com/) – Component UI tái sử dụng dựa trên Radix UI và Tailwind CSS.
- [SWR](https://swr.vercel.app/) – Data fetching và cache phía client.
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) – Quản lý form và validation.
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging) – Thông báo đẩy.
- [next-pwa](https://www.npmjs.com/package/next-pwa) – Hỗ trợ Progressive Web App.
- [Jest](https://jestjs.io/) + [Testing Library](https://testing-library.com/) – Unit/component testing.

---

## 📂 Cấu trúc thư mục

```text
src/
├── app/                 # App Router, layout, metadata và route pages
├── components/          # Component dùng chung theo nhóm chức năng
├── configs/             # Cấu hình endpoint, biến ứng dụng và đường dẫn ảnh
├── hooks/               # Custom React hooks
├── layouts/             # Layout chính và thành phần header/footer
├── lib/                 # Tiện ích nền tảng như fetcher, auth fetch, FCM
├── modules/             # Module giao diện theo từng màn hình/tính năng
├── services/            # Service gọi API backend và API OTruyen
├── skeletons/           # Loading skeleton components
├── types/               # TypeScript types
├── utils/               # Hàm tiện ích thuần
└── __tests__/           # Unit/component tests
```

---

## 🧭 Các route chính

| Route                                   | Mô tả                            |
| --------------------------------------- | -------------------------------- |
| `/`                                     | Trang chủ                        |
| `/dang-nhap`                            | Đăng nhập                        |
| `/dang-ky`                              | Đăng ký                          |
| `/quen-mat-khau`                        | Quên mật khẩu                    |
| `/danh-sach/[slug]`                     | Danh sách truyện theo trạng thái |
| `/the-loai/[slug]`                      | Truyện theo thể loại             |
| `/top-tuan/[country]`                   | Top truyện theo quốc gia         |
| `/truyen-tranh/[slug]`                  | Chi tiết truyện                  |
| `/doc-truyen/[path]`                    | Đọc chương truyện                |
| `/lich-su`                              | Lịch sử đọc                      |
| `/tai-khoan`                            | Trang tài khoản                  |
| `/tai-khoan/thong-tin-ca-nhan`          | Cập nhật thông tin cá nhân       |
| `/tai-khoan/anh-dai-dien`               | Cập nhật ảnh đại diện            |
| `/tai-khoan/khung-avatar`               | Cập nhật khung avatar            |
| `/tai-khoan/doi-mat-khau`               | Đổi mật khẩu                     |
| `/tai-khoan/truyen-yeu-thich`           | Truyện yêu thích                 |
| `/huong-dan` và `/huong-dan/[chi-tiet]` | Hướng dẫn                        |
| `/chinh-sach-bao-mat`                   | Chính sách bảo mật               |
| `/thoa-thuan-nguoi-dung`                | Thỏa thuận người dùng            |

---

## ⚙️ Cài đặt & chạy dự án

### Yêu cầu

- Node.js phiên bản tương thích với Next.js 15
- npm
- Backend API chính của Ztruyện
- API OTruyen để lấy dữ liệu truyện/chương
- Firebase project nếu bật thông báo đẩy

### Cài đặt dependencies

```bash
npm install
```

### Chạy development

```bash
npm run dev
```

Ứng dụng sẽ chạy tại:

```bash
http://localhost:3000
```

### Build production

```bash
npm run build
```

### Chạy production

```bash
npm run start
```

---

## 🔧 Environment Variables

Tạo file `.env` ở thư mục gốc và cấu hình các biến môi trường cần thiết:

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_API_OTRUYEN_URL=
NEXT_PUBLIC_API_URL_CHAPTER_OUT_SIDE=
NEXT_PUBLIC_API_OTRUYEN_IMAGE_COMIC=
NEXT_PUBLIC_IMG_URL=
NEXT_PUBLIC_YOUR_WEBSITE=
NEXT_PUBLIC_DISCORD_ID=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
NEXT_PUBLIC_VERIFICATION_GOOGLE=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_VAPID_KEY=
```

---

## 🧪 Testing

Chạy toàn bộ test:

```bash
npm run test
```

Chạy test ở watch mode:

```bash
npm run test:watch
```

Chạy test CI kèm coverage:

```bash
npm run test:ci
```

---

## 📜 Scripts

| Script               | Mô tả                                         |
| -------------------- | --------------------------------------------- |
| `npm run dev`        | Chạy Next.js development server với Turbopack |
| `npm run build`      | Build ứng dụng production                     |
| `npm run start`      | Chạy production server                        |
| `npm run lint`       | Chạy lint theo cấu hình Next.js               |
| `npm run test`       | Chạy Jest                                     |
| `npm run test:watch` | Chạy Jest watch mode                          |
| `npm run test:ci`    | Chạy Jest CI và xuất coverage                 |

---

## 📝 Ghi chú triển khai

- `next.config.ts` đang bật `images.unoptimized`, bỏ qua ESLint khi build và cấu hình PWA output vào thư mục `public`.
- PWA bị tắt trong môi trường development và được bật khi build production.
- Service worker Firebase `public/firebase-messaging-sw.js` được loại khỏi build PWA để tránh ghi đè.
- Ứng dụng dùng metadata tiếng Việt, manifest PWA và Google Analytics nếu có `NEXT_PUBLIC_GA_ID`.

---

## 📄 License

Dự án được phát triển với mục đích học tập, nghiên cứu và thực hành xây dựng nền tảng đọc truyện tranh online.
