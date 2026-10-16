# CDSS Standalone Suite — Hệ Thống Hỗ Trợ Quyết Định Lâm Sàng Độc Lập

Dự án CDSS độc lập tích hợp **9 công cụ Hỗ Trợ Quyết Định Lâm Sàng (Clinical Decision Support Systems - CDSS)** chuyên sâu, chuẩn hóa theo các hướng dẫn điều trị y học chứng cứ (EBM) mới nhất của **Bộ Y Tế Việt Nam, AHA/ACC, NICE 2024, Surviving Sepsis Campaign, ASHP/IDSA 2020, ADA 2026, Bates & Macleod**.

---

## 🏛️ Danh Mục 9 Module CDSS Tích Hợp

| STT | Tên Module CDSS | Thư mục | Chuyên khoa | Tiêu Chuẩn & Nguồn Y Văn |
|:---:|---|---|---|---|
| **1** | **Phác Đồ Dịch Truyền & Chống Sốc SXHD Dengue** | `dengue/` | Truyền nhiễm & Cấp cứu | Quyết định 2760/QĐ-BYT Bộ Y Tế 2023, CDC 2014 |
| **2** | **Phân Tích Điện Tâm Đồ 12 Chuyển Đạo (ECG Master)** | `ecg/` | Tim mạch | AHA/ACC/HRS, BS Nguyễn Tôn Kinh Thi, ECG Made Easy, 21 ca lâm sàng |
| **3** | **Phân Tích Khí Máu Động Mạch & Toan Kiềm (ABG Pro)** | `abg/` | Hô hấp & Cấp cứu | Hennessey & Japp, Siggaard-Andersen Nomogram, 24 ca lâm sàng |
| **4** | **Phân Tích Sinh Hóa Gan & Quyết Định Lâm Sàng (HepaCDSS)** | `hepa/` | Tiêu hóa & Gan mật | Hướng dẫn ACG & WHO, R-ratio, FIB-4, APRI, Child-Pugh, MELD-Na |
| **5** | **Phân Tầng Nguy Cơ Nhiễm Trùng & Sốc (SepsisCDSS)** | `sepsis/` | Hồi sức Cấp cứu | NICE NG253 (2024/2026), Sepsis-3 (SOFA/qSOFA), Phoenix 2024 |
| **6** | **Đánh Giá Nhiễm Trùng & Liều Kháng Sinh (InfectoDose)** | `antibiotic/` | Truyền nhiễm & Kháng sinh | BV Bệnh Nhiệt Đới (eMed 2026), QĐ 5631/QĐ-BYT, NHSN-CDC, 43 KS |
| **7** | **Quản Lý Liều & Dược Động Học Vancomycin (ASHP 2020)** | `vancomycin/` | Dược lâm sàng & Kháng sinh | ASHP/IDSA 2020, TDM AUC24/MIC (400-600), Zhang 2024, BVĐK Cà Mau |
| **8** | **Quản Lý Insulin & Đường Huyết Nội Viện (DiaCare)** | `diacare/` | Nội tiết & Chuyển hóa | ADA Standards of Care 2026, JBDS-IP, Basal-Bolus, SSI, DKA/HHS |
| **9** | **Tiếp Cận Lâm Sàng & Khám Bệnh Nội Trú** | `inpatient/` | Nội khoa & Lâm sàng | Bates' Pocket Guide to Physical Examination & Macleod's Examination |

---

## 🚀 2 Phương Thức Khởi Chạy

### Cách 1: Chạy Trực Tiếp Offline (Zero Setup — `file:///`)
Dự án được đóng gói bundle sẵn toàn bộ CSS, icons và JS engine:
1. Mở thư mục dự án `CDSS_Standalone`.
2. Click đúp vào file `index.html` để mở Master Portal trên bất kỳ trình duyệt nào (Chrome, Edge, Firefox, Safari).
3. Bấm vào bất kỳ CDSS nào để sử dụng ngay lập tức mà **không cần cài đặt Node.js hay mở command prompt**.

### Cách 2: Chạy Dev Server bằng Vite / Node.js
Dành cho lập trình viên muốn tiếp tục phát triển hoặc host trên mạng nội bộ bệnh viện:
```bash
# 1. Cài đặt dependencies (chỉ chạy lần đầu)
npm install

# 2. Khởi chạy dev server với Hot Module Reload (HMR)
npm run dev

# 3. Trình duyệt sẽ tự động mở http://localhost:3000
```

### Biên Dịch Bản Phân Phối (Production Build)
```bash
npm run build
```
Toàn bộ dự án tĩnh tối ưu sẽ được xuất ra thư mục `dist/`, sẵn sàng tải lên **GitHub Pages, Vercel, Netlify hoặc máy chủ Web Nginx/IIS nội bộ bệnh viện**.

---

## 🌐 Hướng Dẫn Đẩy Lên GitHub & Triển Khai GitHub Pages (Hoạt Động 100%)

Dự án hỗ trợ 2 cách đưa lên GitHub và chạy mượt mà không lỗi:

### Cách A: Tự Động Hóa Với GitHub Actions (Khuyên Dùng)
Dự án đã tích hợp sẵn workflow tự động `.github/workflows/deploy.yml`:
1. Đẩy code lên GitHub repository của bạn:
   ```bash
   git init
   git add .
   git commit -m "feat: CDSS Standalone Suite full modules"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
   git push -u origin main
   ```
2. Trên trang GitHub repo, vào **Settings** ➔ **Pages**.
3. Tại mục **Build and deployment** ➔ **Source**, chọn **GitHub Actions**.
4. GitHub sẽ tự động build và cung cấp link trang web trực tuyến: `https://<YOUR_USERNAME>.github.io/<YOUR_REPO>/`.

### Cách B: Chạy Trực Tiếp Từ Nhánh main (Zero Build)
Nhờ file bundle độc lập `cdss-hub-bundle.js` và cấu hình đường dẫn tương đối (`./`), bạn có thể deploy trực tiếp từ root mà không cần build:
1. Vào **Settings** ➔ **Pages** trên GitHub.
2. Tại mục **Source**, chọn **Deploy from a branch**.
3. Chọn nhánh **main** (hoặc master) và thư mục **/ (root)** ➔ Bấm **Save**.
4. Toàn bộ 9 module CDSS và Trung tâm tra cứu sẽ hoạt động hoàn hảo ngay lập tức.

## 🎨 Điểm Nổi Bật Về Giao Diện & Trải Nghiệm (UX)
- **100% Dark Mode & Light Mode**: Tự động nhận diện theme hệ thống và đồng bộ trạng thái qua `localStorage`.
- **Thanh tìm kiếm tức thì**: Lọc theo từ khóa, tên bệnh, mã ICD-10 hoặc hướng dẫn điều trị.
- **Bộ lọc chuyên khoa nhanh**: Chuyển đổi giữa Hồi sức cấp cứu, Tim mạch, Hô hấp, Kháng sinh, Gan mật, Nội tiết, Nội khoa.
- **Tương thích Mobile & Tablet**: Giao diện co giãn chuẩn responsive, hỗ trợ thao tác chạm tại giường bệnh.
