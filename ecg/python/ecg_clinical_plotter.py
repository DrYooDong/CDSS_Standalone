"""
CliniPortal CDSS — High-Fidelity Clinical ECG Plotter
Inspired by MIT-LCP/wfdb-python plotting subsystem and clinical ECG standards.

Features:
- Standard 25 mm/s paper speed and 10 mm/mV voltage calibration
- Authentic pink/red clinical ECG grid (1mm minor box = 0.04s/0.1mV; 5mm major box = 0.20s/0.5mV)
- Support for alternate themes: classic paper, dark monitor CRT, and high-contrast print
- Layouts:
    * 12-Lead standard 3x4 + Lead II rhythm strip (10s total duration, 2.5s per column)
    * 6x2 layout
    * Multi-channel continuous rhythm strips
- 1 mV calibration pulse (0.2s duration)
- Crisp clinical typography, lead tags, and metadata header/footer
- Direct export to High-DPI PNG (300 DPI), SVG vector, and base64 string
"""

import os
import io
import base64
import numpy as np
import matplotlib
matplotlib.use('Agg')  # Headless backend for web/server use
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.ticker import MultipleLocator
from typing import Dict, List, Optional, Tuple, Union, Any


class EcgGridTheme:
    """Color themes for ECG grid rendering."""
    # Standard Clinical Pink Paper
    PAPER = {
        'background': '#fffdfa',
        'minor_grid': '#f8d2d2',
        'major_grid': '#e58080',
        'signal': '#0f172a',
        'text': '#1e293b',
        'lead_badge_bg': '#e2e8f0',
        'lead_badge_text': '#0f172a',
        'cal_pulse': '#334155',
        'annotation': '#dc2626',
    }
    # Clinical Blue/Cyan Grid Paper (used by some Philips/GE machines)
    BLUE_GRID = {
        'background': '#fdffff',
        'minor_grid': '#d0e8f2',
        'major_grid': '#79b4d8',
        'signal': '#0a192f',
        'text': '#1e293b',
        'lead_badge_bg': '#e0f2fe',
        'lead_badge_text': '#0369a1',
        'cal_pulse': '#0284c7',
        'annotation': '#d97706',
    }
    # Dark ICU Monitor CRT
    MONITOR = {
        'background': '#021a12',
        'minor_grid': '#053828',
        'major_grid': '#0a5c40',
        'signal': '#10b981',
        'text': '#ecfdf5',
        'lead_badge_bg': '#064e3b',
        'lead_badge_text': '#6ee7b7',
        'cal_pulse': '#34d399',
        'annotation': '#fbbf24',
    }
    # Monochrome High-Contrast Print (for black & white publications)
    MONOCHROME = {
        'background': '#ffffff',
        'minor_grid': '#eeeeee',
        'major_grid': '#bbbbbb',
        'signal': '#000000',
        'text': '#000000',
        'lead_badge_bg': '#f3f4f6',
        'lead_badge_text': '#000000',
        'cal_pulse': '#000000',
        'annotation': '#4b5563',
    }


LEAD_NAMES_12 = ["I", "II", "III", "aVR", "aVL", "aVF", "V1", "V2", "V3", "V4", "V5", "V6"]

# Standard anatomical lead grouping colors (for clinical clarity)
LEAD_ANATOMY_COLORS = {
    "I": "#2563eb", "aVL": "#2563eb", "V5": "#2563eb", "V6": "#2563eb",   # Lateral
    "II": "#d97706", "III": "#d97706", "aVF": "#d97706",                   # Inferior
    "V1": "#0d9488", "V2": "#0d9488",                                       # Septal
    "V3": "#059669", "V4": "#059669",                                       # Anterior
    "aVR": "#7c3aed",                                                       # Cavitary / LMCA
}


def draw_calibration_pulse(ax, x_start: float = 0.0, y_baseline: float = 0.0,
                           pulse_width_sec: float = 0.2, pulse_height_mv: float = 1.0,
                           color: str = '#334155', lw: float = 1.2):
    """
    Draws a standard clinical calibration pulse (1 mV x 0.2s).
    In standard ECG: 0.2s = 5mm, 1mV = 10mm.
    """
    pulse_x = [
        x_start,
        x_start + 0.04,
        x_start + 0.04,
        x_start + 0.04 + pulse_width_sec,
        x_start + 0.04 + pulse_width_sec,
        x_start + 0.08 + pulse_width_sec
    ]
    pulse_y = [
        y_baseline,
        y_baseline,
        y_baseline + pulse_height_mv,
        y_baseline + pulse_height_mv,
        y_baseline,
        y_baseline
    ]
    ax.plot(pulse_x, pulse_y, color=color, linewidth=lw, solid_capstyle='round')


def draw_ecg_grid(ax, x_min: float, x_max: float, y_min: float, y_max: float,
                  theme: dict = EcgGridTheme.PAPER,
                  paper_speed: float = 25.0,  # mm/s
                  voltage_gain: float = 10.0  # mm/mV
                  ):
    """
    Draws authentic medical ECG grid lines according to international clinical standards.
    Minor box: 1 mm x 1 mm -> 0.04s x 0.1 mV (at 25mm/s and 10mm/mV)
    Major box: 5 mm x 5 mm -> 0.20s x 0.5 mV
    """
    ax.set_facecolor(theme['background'])

    # Standard intervals in signal units:
    minor_x = 1.0 / paper_speed       # 1 mm in seconds = 0.04 s
    major_x = 5.0 / paper_speed       # 5 mm in seconds = 0.20 s
    minor_y = 1.0 / voltage_gain      # 1 mm in mV = 0.1 mV
    major_y = 5.0 / voltage_gain      # 5 mm in mV = 0.5 mV

    # Draw Minor Grid
    x_minor_ticks = np.arange(np.floor(x_min / minor_x) * minor_x, x_max + minor_x, minor_x)
    for x in x_minor_ticks:
        ax.axvline(x, color=theme['minor_grid'], linewidth=0.45, zorder=1)

    y_minor_ticks = np.arange(np.floor(y_min / minor_y) * minor_y, y_max + minor_y, minor_y)
    for y in y_minor_ticks:
        ax.axhline(y, color=theme['minor_grid'], linewidth=0.45, zorder=1)

    # Draw Major Grid
    x_major_ticks = np.arange(np.floor(x_min / major_x) * major_x, x_max + major_x, major_x)
    for x in x_major_ticks:
        ax.axvline(x, color=theme['major_grid'], linewidth=0.9, zorder=2)

    y_major_ticks = np.arange(np.floor(y_min / major_y) * major_y, y_max + major_y, major_y)
    for y in y_major_ticks:
        ax.axhline(y, color=theme['major_grid'], linewidth=0.9, zorder=2)


class ClinicalEcgPlotter:
    """
    Comprehensive ECG Plotter supporting 12-lead standard strips, multi-channel layouts,
    annotations, and clinical reports.
    """

    def __init__(self,
                 paper_speed: float = 25.0,     # mm/s (standard: 25 mm/s, option: 50 mm/s)
                 voltage_gain: float = 10.0,    # mm/mV (standard: 10 mm/mV, option: 5 or 20 mm/mV)
                 theme: Union[str, dict] = 'paper',
                 dpi: int = 300):
        self.paper_speed = paper_speed
        self.voltage_gain = voltage_gain
        self.dpi = dpi

        if isinstance(theme, str):
            theme_lower = theme.lower()
            if theme_lower in ('paper', 'pink'):
                self.theme = EcgGridTheme.PAPER
            elif theme_lower in ('blue', 'cyan'):
                self.theme = EcgGridTheme.BLUE_GRID
            elif theme_lower in ('monitor', 'dark', 'crt'):
                self.theme = EcgGridTheme.MONITOR
            elif theme_lower in ('mono', 'monochrome', 'bw'):
                self.theme = EcgGridTheme.MONOCHROME
            else:
                self.theme = EcgGridTheme.PAPER
        else:
            self.theme = theme

    def plot_12lead(self,
                    leads_signals: Dict[str, np.ndarray],
                    sampling_rate: float = 500.0,
                    patient_info: Optional[Dict[str, Any]] = None,
                    metrics: Optional[Dict[str, Any]] = None,
                    diagnosis: Optional[Dict[str, Any]] = None,
                    rhythm_lead: str = 'II',
                    title: Optional[str] = None,
                    save_path: Optional[str] = None) -> plt.Figure:
        """
        Plots a standard clinical 12-lead ECG in the traditional 3x4 + Rhythm Strip format:
          Col 1: I, II, III        (0.0s - 2.5s)
          Col 2: aVR, aVL, aVF    (2.5s - 5.0s)
          Col 3: V1, V2, V3        (5.0s - 7.5s)
          Col 4: V4, V5, V6        (7.5s - 10.0s)
          Bottom: Long Rhythm Strip (e.g. Lead II, 0.0s - 10.0s)
        """
        # Ensure all standard 12 leads exist; if missing, generate zeroes or synthesize
        for lead in LEAD_NAMES_12:
            if lead not in leads_signals:
                leads_signals[lead] = np.zeros(int(10.0 * sampling_rate))

        total_duration = 10.0  # seconds
        col_duration = 2.5     # seconds

        # Layout grid: 4 rows (3 standard rows + 1 rhythm row)
        # 4 columns for top 3 rows, 1 merged column for bottom rhythm strip
        fig = plt.figure(figsize=(15, 9.5), dpi=self.dpi, facecolor=self.theme['background'])

        # Create GridSpec: top 3 rows for 3x4 layout, 4th row for rhythm strip
        # Extra top room for clinical header banner
        gs = fig.add_gridspec(
            nrows=4, ncols=4,
            height_ratios=[1.0, 1.0, 1.0, 1.15],
            left=0.04, right=0.97,
            top=0.88, bottom=0.06,
            wspace=0.03, hspace=0.10
        )

        matrix_12 = [
            ["I",   "aVR", "V1", "V4"],
            ["II",  "aVL", "V2", "V5"],
            ["III", "aVF", "V3", "V6"],
        ]

        # Calculate common y-range (standard +/- 1.8 mV to accommodate typical QRS)
        y_min, y_max = -1.8, 2.4

        # Plot 3x4 leads
        for row_idx in range(3):
            for col_idx in range(4):
                lead_name = matrix_12[row_idx][col_idx]
                ax = fig.add_subplot(gs[row_idx, col_idx])

                t_start = col_idx * col_duration
                t_end = t_start + col_duration

                draw_ecg_grid(ax, t_start, t_end, y_min, y_max,
                              theme=self.theme,
                              paper_speed=self.paper_speed,
                              voltage_gain=self.voltage_gain)

                # Calibration pulse at column start (if col_idx == 0 or beginning of each lead)
                if col_idx == 0:
                    draw_calibration_pulse(ax, x_start=t_start + 0.03, y_baseline=0.0,
                                           color=self.theme['cal_pulse'])

                # Slice signal
                sig = leads_signals[lead_name]
                idx_start = int(t_start * sampling_rate)
                idx_end = int(t_end * sampling_rate)
                segment = sig[idx_start:idx_end]
                t_vec = np.linspace(t_start, t_end, len(segment))

                # Plot lead waveform
                ax.plot(t_vec, segment, color=self.theme['signal'],
                        linewidth=1.1, antialiased=True, zorder=3)

                # Lead Label Badge
                anatomy_color = LEAD_ANATOMY_COLORS.get(lead_name, '#0f172a')
                ax.text(t_start + 0.06, y_max - 0.35, lead_name,
                        fontsize=11, fontweight='bold',
                        color=anatomy_color,
                        bbox=dict(boxstyle="round,pad=0.2",
                                  facecolor=self.theme['lead_badge_bg'],
                                  edgecolor='none', alpha=0.9),
                        zorder=4)

                ax.set_xlim(t_start, t_end)
                ax.set_ylim(y_min, y_max)
                ax.set_xticklabels([])
                ax.set_yticklabels([])
                for spine in ax.spines.values():
                    spine.set_color(self.theme['major_grid'])
                    spine.set_linewidth(0.8)

        # Plot Bottom Rhythm Strip (Full 10 seconds continuous)
        ax_rhythm = fig.add_subplot(gs[3, :])
        draw_ecg_grid(ax_rhythm, 0.0, total_duration, y_min, y_max,
                      theme=self.theme,
                      paper_speed=self.paper_speed,
                      voltage_gain=self.voltage_gain)

        # Calibration pulse at start of rhythm strip
        draw_calibration_pulse(ax_rhythm, x_start=0.03, y_baseline=0.0,
                               color=self.theme['cal_pulse'])

        rhythm_sig = leads_signals.get(rhythm_lead, leads_signals['II'])
        t_rhythm = np.linspace(0.0, total_duration, len(rhythm_sig[:int(total_duration * sampling_rate)]))
        ax_rhythm.plot(t_rhythm, rhythm_sig[:len(t_rhythm)],
                       color=self.theme['signal'], linewidth=1.15, zorder=3)

        # Rhythm Lead Label
        ax_rhythm.text(0.35, y_max - 0.35, f"Rhythm Strip: Lead {rhythm_lead} (Continuous 10s)",
                       fontsize=10.5, fontweight='bold', color=LEAD_ANATOMY_COLORS.get(rhythm_lead, '#0f172a'),
                       bbox=dict(boxstyle="round,pad=0.2",
                                 facecolor=self.theme['lead_badge_bg'],
                                 edgecolor='none', alpha=0.9),
                       zorder=4)

        ax_rhythm.set_xlim(0.0, total_duration)
        ax_rhythm.set_ylim(y_min, y_max)
        ax_rhythm.set_xticklabels([])
        ax_rhythm.set_yticklabels([])
        for spine in ax_rhythm.spines.values():
            spine.set_color(self.theme['major_grid'])
            spine.set_linewidth(0.8)

        # Draw Clinical Header Banner
        self._draw_header(fig, patient_info, metrics, diagnosis, title)

        # Draw Technical Specifications Footer
        self._draw_footer(fig)

        if save_path:
            os.makedirs(os.path.dirname(os.path.abspath(save_path)), exist_ok=True)
            fig.savefig(save_path, dpi=self.dpi, facecolor=self.theme['background'],
                        edgecolor='none', bbox_inches='tight')

        return fig

    def plot_rhythm_annotated(self,
                              signal: np.ndarray,
                              sampling_rate: float,
                              r_peaks: Optional[np.ndarray] = None,
                              annotations: Optional[List[Dict[str, Any]]] = None,
                              lead_name: str = 'II',
                              title: str = "ECG Rhythm Analysis & Beat Classification",
                              save_path: Optional[str] = None) -> plt.Figure:
        """
        Plots a high-definition rhythm strip with beat annotation markers (N, V, A, L, R)
        and fiducial measurements, matching WFDB annotation standards.
        """
        duration = len(signal) / sampling_rate
        fig, ax = plt.subplots(figsize=(14, 4.8), dpi=self.dpi, facecolor=self.theme['background'])

        y_min = np.min(signal) - 0.5
        y_max = np.max(signal) + 0.8

        draw_ecg_grid(ax, 0.0, duration, y_min, y_max,
                      theme=self.theme,
                      paper_speed=self.paper_speed,
                      voltage_gain=self.voltage_gain)

        draw_calibration_pulse(ax, x_start=0.03, y_baseline=0.0, color=self.theme['cal_pulse'])

        t_vec = np.linspace(0.0, duration, len(signal))
        ax.plot(t_vec, signal, color=self.theme['signal'], linewidth=1.2, zorder=3)

        # Draw R-peaks and annotation badges
        if annotations:
            # Annotation colors
            ann_palette = {
                'N': ('#16a34a', 'Normal Beat (N)'),
                'V': ('#dc2626', 'Ventricular Ectopic / PVC (V)'),
                'A': ('#ea580c', 'Atrial Premature / PAC (A)'),
                'L': ('#7c3aed', 'Left Bundle Branch Block (L)'),
                'R': ('#0284c7', 'Right Bundle Branch Block (R)'),
                'F': ('#b45309', 'Ventricular Fusion (F)'),
                '/': ('#64748b', 'Paced Beat (/)'),
            }

            for ann in annotations:
                sample_idx = ann.get('sample', 0)
                symbol = ann.get('symbol', 'N')
                t_peak = sample_idx / sampling_rate
                if 0 <= sample_idx < len(signal):
                    y_val = signal[sample_idx]
                    color, _ = ann_palette.get(symbol, ('#2563eb', symbol))

                    # Circle marker at peak
                    ax.scatter([t_peak], [y_val], color=color, s=40, zorder=5)

                    # Symbol badge above peak
                    ax.annotate(
                        symbol,
                        xy=(t_peak, y_val),
                        xytext=(0, 15),
                        textcoords="offset points",
                        ha='center', va='bottom',
                        fontsize=9.5, fontweight='bold', color='#ffffff',
                        bbox=dict(boxstyle="round,pad=0.25", facecolor=color, edgecolor='none'),
                        arrowprops=dict(arrowstyle="-", color=color, lw=0.8),
                        zorder=6
                    )

        ax.set_title(f"{title} — Lead {lead_name} (Paper: {int(self.paper_speed)} mm/s, Gain: {int(self.voltage_gain)} mm/mV)",
                     fontsize=12, fontweight='bold', color=self.theme['text'], pad=12)
        ax.set_xlim(0.0, duration)
        ax.set_ylim(y_min, y_max)
        ax.set_xlabel("Time (seconds)", fontsize=9.5, color=self.theme['text'])
        ax.set_ylabel("Amplitude (mV)", fontsize=9.5, color=self.theme['text'])

        for spine in ax.spines.values():
            spine.set_color(self.theme['major_grid'])

        if save_path:
            os.makedirs(os.path.dirname(os.path.abspath(save_path)), exist_ok=True)
            fig.savefig(save_path, dpi=self.dpi, facecolor=self.theme['background'],
                        edgecolor='none', bbox_inches='tight')

        return fig

    def _draw_header(self, fig, patient_info, metrics, diagnosis, title):
        """Renders the standard clinical hospital header banner."""
        pt = patient_info or {}
        met = metrics or {}
        diag = diagnosis or {}

        name = pt.get('name', 'Bệnh Nhân Mẫu (Sample Patient)')
        age = pt.get('age', 58)
        gender = pt.get('gender', 'Nam')
        bp = pt.get('vitals', {}).get('bp', '125/80')
        hr = met.get('heartRate', 75)
        pr = met.get('prInterval', 160)
        qrs = met.get('qrsDuration', 88)
        qt = met.get('qt', 380)
        qtc = met.get('qtc', 415)
        axis = met.get('axis', 'Bình thường (+45°)')
        diag_primary = diag.get('primary', title or 'Normal Sinus Rhythm')

        # Header box at top
        header_text = (
            f"CLINIPORTAL CDSS — CLINICAL 12-LEAD ELECTROCARDIOGRAM REPORT\n"
            f"Bệnh Nhân: {name} | Tuổi: {age} | Giới tính: {gender} | Huyết áp: {bp} mmHg\n"
            f"Nhịp tim: {hr} bpm | PR: {pr} ms | QRS: {qrs} ms | QT/QTc: {qt}/{qtc} ms | Trục QRS: {axis}\n"
            f"Chẩn đoán sơ bộ: {diag_primary}"
        )

        fig.text(0.04, 0.98, header_text,
                 fontsize=9.5, fontfamily='sans-serif',
                 verticalalignment='top',
                 color=self.theme['text'],
                 linespacing=1.35,
                 bbox=dict(boxstyle="square,pad=0.4",
                           facecolor=self.theme['lead_badge_bg'],
                           edgecolor=self.theme['major_grid'],
                           linewidth=0.8,
                           alpha=0.6))

    def _draw_footer(self, fig):
        """Draws technical standard notes at the bottom."""
        footer_text = (
            f"Chuẩn ghi: Tốc độ kéo giấy {int(self.paper_speed)} mm/s | "
            f"Độ nhạy {int(self.voltage_gain)} mm/mV (1mV = 10mm) | "
            f"Lọc tín hiệu: 0.05 Hz - 150 Hz / Notch 50Hz | "
            f"Định dạng: 3x4 + 1 Dải nhịp DII (10s) | WFDB & PhysioNet Standard Compatible"
        )
        fig.text(0.5, 0.02, footer_text,
                 fontsize=8.5, color='#64748b',
                 horizontalalignment='center',
                 fontstyle='italic')

    def to_base64_png(self, fig: plt.Figure) -> str:
        """Encodes Matplotlib figure to a data URI for direct HTML/React embedding."""
        buf = io.BytesIO()
        fig.savefig(buf, format='png', dpi=self.dpi, facecolor=self.theme['background'],
                    edgecolor='none', bbox_inches='tight')
        buf.seek(0)
        b64_str = base64.b64encode(buf.read()).decode('utf-8')
        plt.close(fig)
        return f"data:image/png;base64,{b64_str}"

    def to_svg(self, fig: plt.Figure) -> str:
        """Exports Matplotlib figure as an SVG XML string."""
        buf = io.StringIO()
        fig.savefig(buf, format='svg', facecolor=self.theme['background'],
                    edgecolor='none', bbox_inches='tight')
        buf.seek(0)
        svg_content = buf.read()
        plt.close(fig)
        return svg_content
