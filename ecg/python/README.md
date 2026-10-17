# CliniPortal CDSS — Advanced ECG Graphics & Signal Engine
> **Bộ công cụ Python nâng cấp chất lượng đồ họa và phân tích tín hiệu điện tâm đồ cho CDSS ECG**  
> Tích hợp tinh hoa từ 02 dự án:
> 1. [MIT-LCP/wfdb-python](https://github.com/MIT-LCP/wfdb-python) — Chuẩn hiển thị điện tâm đồ lâm sàng quốc tế (lưới milimet y học, xung định chuẩn 1mV, layout 12 chuyển đạo 3x4 + Dải nhịp DII, WFDB annotations).
> 2. [mondejar/ecg-classification](https://github.com/mondejar/ecg-classification) — Pipeline lọc khử nhiễu (Dual median baseline wander removal), phân đoạn nhịp (Beat segmentation), phòng trưng bày hình thái nhát bóp (Beat morphology overlays with Mean ± 1 SD), và biểu đồ phân tán động học Poincaré ($RR_n$ vs $RR_{n+1}$).

---

## 1. Cấu Trúc Thư Mục & Modules

```
CDSS_Standalone/ecg/python/
├── ecg_clinical_plotter.py   # Engine vẽ đồ họa 12 chuyển đạo chuẩn quốc tế (wfdb-python inspired)
├── ecg_mitbih_processor.py   # Lọc nhiễu, phân đoạn nhịp, vẽ hình thái & Poincaré (mondejar inspired)
├── wfdb_connector.py         # Kết nối PhysioNet WFDB, đọc bản ghi MIT-BIH và tạo dữ liệu 12 chuyển đạo
├── cdss_ecg_graphics.py      # Master Engine CLI & API tích hợp đa năng
├── output/                   # Thư mục lưu ảnh độ phân giải cao (300 DPI PNG, SVG)
└── README.md                 # Tài liệu hướng dẫn chi tiết
```

---

## 2. Các Cải Tiến Đồ Họa Đạt Được

### A. Chuẩn Hiển Thị Điện Tâm Đồ Lâm Sàng (từ `wfdb-python`):
- **Lưới milimet y học chính xác tuyệt đối**:
  - Ô nhỏ (1 mm): $0.04\,\text{s} \times 0.1\,\text{mV}$ (tốc độ $25\,\text{mm/s}$, độ nhạy $10\,\text{mm/mV}$).
  - Ô lớn (5 mm): $0.20\,\text{s} \times 0.5\,\text{mV}$.
- **Xung chuẩn định (Calibration Pulse)**: Sóng vuông chuẩn $1\,\text{mV} \times 0.2\,\text{s}$ ($10\,\text{mm}$ cao, $5\,\text{mm}$ rộng) ở đầu dải nhịp.
- **Bố cục 12 chuyển đạo kinh điển 3x4 + Rhythm Strip**:
  - Cột 1 (0.0s – 2.5s): DI, DII, DIII
  - Cột 2 (2.5s – 5.0s): aVR, aVL, aVF
  - Cột 3 (5.0s – 7.5s): V1, V2, V3
  - Cột 4 (7.5s – 10.0s): V4, V5, V6
  - Dải nhịp kéo dài (0.0s – 10.0s liên tục): Chuyển đạo II (DII Rhythm Strip).
- **Hệ thống theme hiển thị đa dạng**:
  - `paper`: Giấy in hồng chuẩn bệnh viện (Clinical Pink Grid).
  - `monitor`: Màn hình theo dõi CRT phòng cấp cứu/ICU (Emerald CRT).
  - `blue`: Giấy lưới xanh y tế (Philips/GE style).
  - `mono`: Đen trắng độ tương phản cao cho in ấn xuất bản nghiên cứu.
- **Header bệnh án & Footer thông số kỹ thuật chuẩn hóa**.

### B. Phân Tích Hình Thái & Động Học Rối Loạn Nhịp (từ `mondejar/ecg-classification`):
- **Khử trôi đường đẳng điện (Baseline Wander Removal)**: Bộ lọc trung vị 2 tầng (Dual Median Filter) $200\,\text{ms} + 600\,\text{ms}$, bóc tách triệt để trôi đường đẳng điện do thở mà không làm méo dạng đoạn ST.
- **Lọc nhiễu xoay chiều & cơ vân**: Notch filter $50\,\text{Hz} / 60\,\text{Hz}$ và Bandpass $0.5 - 45\,\text{Hz}$.
- **Phòng trưng bày hình thái nhát bóp (Beat Morphology Gallery)**:
  - Xếp chồng (overlay) hàng chục nhát bóp của từng phân lớp rối loạn nhịp (N: Xoang thường, V: Ngoại tâm thu thất PVC, A: Ngoại tâm thu nhĩ PAC, L: Bloc nhánh trái LBBB, R: Bloc nhánh phải RBBB).
  - Vẽ đường nhát bóp trung bình (Mean Beat) nổi bật kèm dải độ lệch chuẩn $\pm 1\,\text{SD}$ (Confidence ribbon).
- **Biểu đồ Poincaré ($RR_n$ vs $RR_{n+1}$)**:
  - Khớp hình Elip phân tích biến thiên nhịp tim HRV ($SD_1, SD_2, SD_1/SD_2$).
  - Nhận diện trực quan dạng "sao chổi/quạt" trong Rung nhĩ, dạng phân cụm trong Ngoại tâm thu nhịp đôi/nhịp ba.

---

## 3. Hướng Dẫn Sử Dụng Command Line (CLI)

### Chạy Demo Tự Động Toàn Diện (Tạo toàn bộ đồ họa mẫu):
```bash
python cdss_ecg_graphics.py --demo
```
Kết quả sinh ra 5 bộ đồ họa chuẩn 300 DPI trong thư mục `output/`:
1. `clinical_12lead_stemi_inferior_paper.png`: Dải 12 chuyển đạo NMCT thành dưới trên giấy hồng.
2. `clinical_12lead_stemi_anterior_monitor.png`: Dải 12 chuyển đạo NMCT trước vách dạng vòm trên nền Monitor ICU.
3. `mitbih_106_morphology_overlay.png`: So sánh hình thái 5 phân lớp nhịp tim (N, V, A, L, R).
4. `mitbih_106_poincare_hrv.png`: Biểu đồ phân tán Poincaré $RR_n - RR_{n+1}$ và elip HRV.
5. `cdss_diagnostic_poster_stemi_inferior.png`: Poster chẩn đoán CDSS tổng thể (12 chuyển đạo + Hình thái nhát bóp + Poincaré + Khuyến cáo CDSS).

### Vẽ dải 12 chuyển đạo cho ca cụ thể:
```bash
# NMCT thành dưới (STEMI inferior)
python cdss_ecg_graphics.py --case stemi_inferior --theme paper

# Tăng kali máu nặng (Hyperkalemia) trên giao diện monitor ICU
python cdss_ecg_graphics.py --case hyperkalemia --theme monitor

# Nhịp xoang bình thường
python cdss_ecg_graphics.py --case normal --theme blue
```

### Phân tích trực tuyến bản ghi từ PhysioNet MIT-BIH Arrhythmia Database:
```bash
# Tải và phân tích bản ghi 106 trực tiếp từ PhysioNet
python cdss_ecg_graphics.py --mitbih 106 --online
```

---

## 4. Tích Hợp Vào Ứng Dụng Python Hoặc Web CDSS

```python
from ecg_clinical_plotter import ClinicalEcgPlotter
from ecg_mitbih_processor import EcgSignalProcessor, EcgArrhythmiaVisualizer
from wfdb_connector import Synthetic12LeadGenerator

# 1. Tạo tín hiệu 12 chuyển đạo
leads = Synthetic12LeadGenerator.generate_case_12lead(case_type='stemi_inferior', fs=500.0)

# 2. Khởi tạo Plotter chuẩn y tế
plotter = ClinicalEcgPlotter(paper_speed=25.0, voltage_gain=10.0, theme='paper', dpi=300)

# 3. Vẽ và xuất Base64 để nhúng thẳng vào thẻ <img> của Web frontend:
fig = plotter.plot_12lead(leads, sampling_rate=500.0)
base64_data_uri = plotter.to_base64_png(fig)
# Dùng: <img src="{base64_data_uri}" />
```
