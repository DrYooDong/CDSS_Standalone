"""
CliniPortal CDSS — MIT-BIH & ECG Signal Processing & Arrhythmia Analysis
Inspired by mondejar/ecg-classification and PhysioNet research methodology.

Key Capabilities:
1. Two-stage Baseline Wander Removal (dual median filtering / Butterworth bandpass)
2. 50/60 Hz Notch Filtering & High-frequency Denoising
3. Pan-Tompkins style R-peak detection & Beat Segmentation
4. Beat Morphology Overlays:
   - Superimposes multiple beats of each rhythm class (N, V, A, L, R)
   - Computes and plots the Mean Beat + Standard Deviation confidence band
5. Heart Rate Variability (HRV) & Poincaré Plot (RR_n vs RR_{n+1}):
   - Ellipse fitting (SD1, SD2, SD1/SD2 ratio)
   - Visual detection of arrhythmias (Atrial Fibrillation, PVC trigeminy/bigeminy)
6. Tachogram Plot (continuous RR intervals across time)
"""

import os
import numpy as np
import scipy.signal as signal
from scipy.ndimage import median_filter
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from typing import Dict, List, Optional, Tuple, Any, Union


class EcgSignalProcessor:
    """ECG Filtering and Clinical Preprocessing Pipeline."""

    @staticmethod
    def remove_baseline_wander_median(ecg_signal: np.ndarray, fs: float) -> np.ndarray:
        """
        Two-stage median filtering for baseline drift removal (de Chazal et al. / mondejar).
        First filter: 200ms window (removes QRS and P-wave peaks)
        Second filter: 600ms window (removes T-waves)
        Subtract resulting baseline estimate from original signal.
        """
        win_200ms = int(0.2 * fs)
        if win_200ms % 2 == 0:
            win_200ms += 1

        win_600ms = int(0.6 * fs)
        if win_600ms % 2 == 0:
            win_600ms += 1

        # First pass removes QRS
        baseline_pass1 = median_filter(ecg_signal, size=win_200ms)
        # Second pass removes T wave
        baseline_estimate = median_filter(baseline_pass1, size=win_600ms)

        # Baseline corrected
        return ecg_signal - baseline_estimate

    @staticmethod
    def bandpass_filter(ecg_signal: np.ndarray, fs: float,
                        lowcut: float = 0.5, highcut: float = 40.0,
                        order: int = 3) -> np.ndarray:
        """
        Zero-phase Butterworth bandpass filter (0.5 - 40 Hz).
        Eliminates baseline sway (<0.5 Hz) and EMG high-frequency muscle noise (>40 Hz).
        """
        nyq = 0.5 * fs
        low = lowcut / nyq
        high = highcut / nyq
        b, a = signal.butter(order, [low, high], btype='band')
        return signal.filtfilt(b, a, ecg_signal)

    @staticmethod
    def notch_filter(ecg_signal: np.ndarray, fs: float,
                     notch_freq: float = 50.0, quality_factor: float = 30.0) -> np.ndarray:
        """
        IIR Notch filter to eliminate 50Hz (or 60Hz) powerline AC interference.
        """
        b, a = signal.iirnotch(notch_freq, quality_factor, fs)
        return signal.filtfilt(b, a, ecg_signal)

    @classmethod
    def clean_ecg_signal(cls, raw_signal: np.ndarray, fs: float,
                          notch_freq: float = 50.0) -> np.ndarray:
        """Complete clinical cleaning pipeline."""
        # Step 1: Notch filter powerline noise
        notched = cls.notch_filter(raw_signal, fs, notch_freq=notch_freq)
        # Step 2: Bandpass filter
        bandpassed = cls.bandpass_filter(notched, fs, lowcut=0.5, highcut=45.0)
        # Step 3: Dual median baseline wander removal
        clean = cls.remove_baseline_wander_median(bandpassed, fs)
        return clean


class EcgBeatSegmenter:
    """Segments continuous ECG signals into individual cardiac beats."""

    def __init__(self, fs: float = 360.0,
                 pre_r_sec: float = 0.25,  # 250ms before R-peak
                 post_r_sec: float = 0.40  # 400ms after R-peak
                 ):
        self.fs = fs
        self.pre_r_samples = int(pre_r_sec * fs)
        self.post_r_samples = int(post_r_sec * fs)
        self.beat_length = self.pre_r_samples + self.post_r_samples

    def segment_beats(self, ecg_signal: np.ndarray,
                      r_peaks: np.ndarray,
                      labels: Optional[List[str]] = None) -> Tuple[np.ndarray, List[str], np.ndarray]:
        """
        Extracts beats centered at R-peaks.
        Returns:
            beats: 2D array of shape (N_beats, beat_length)
            beat_labels: list of labels for each valid beat
            valid_r_peaks: indices of R-peaks that were included
        """
        beats_list = []
        valid_labels = []
        valid_peaks = []

        total_samples = len(ecg_signal)

        for i, peak in enumerate(r_peaks):
            start = peak - self.pre_r_samples
            end = peak + self.post_r_samples

            # Skip boundary beats
            if start < 0 or end > total_samples:
                continue

            beat = ecg_signal[start:end]
            beats_list.append(beat)
            valid_peaks.append(peak)

            if labels is not None and i < len(labels):
                valid_labels.append(labels[i])
            else:
                valid_labels.append('N')

        if not beats_list:
            return np.empty((0, self.beat_length)), [], np.array([])

        return np.array(beats_list), valid_labels, np.array(valid_peaks)


class EcgArrhythmiaVisualizer:
    """
    Advanced graphical analysis inspired by mondejar/ecg-classification:
    - Beat morphology galleries with mean ± SD ribbons
    - Poincaré plots for HRV & arrhythmia visualization
    - RR tachogram
    """

    def __init__(self, dpi: int = 300):
        self.dpi = dpi

    def plot_beat_morphology_overlay(self,
                                     beats: np.ndarray,
                                     labels: List[str],
                                     fs: float = 360.0,
                                     pre_r_sec: float = 0.25,
                                     classes_to_plot: Optional[List[str]] = None,
                                     title: str = "ECG Beat Morphology Overlays by Arrhythmia Class",
                                     save_path: Optional[str] = None) -> plt.Figure:
        """
        Plots stacked beats of different classes (Normal 'N', PVC 'V', PAC 'A', LBBB 'L', RBBB 'R')
        with transparent traces (alpha=0.15) and a thick Mean Beat ± 1 SD ribbon.
        Demonstrates the clear diagnostic visual differences between arrhythmias.
        """
        if classes_to_plot is None:
            # Default to present classes or top classes
            classes_to_plot = ['N', 'V', 'A', 'L', 'R']

        # Filter only classes that actually exist in the data
        unique_labels = set(labels)
        available_classes = [c for c in classes_to_plot if c in unique_labels]
        if not available_classes:
            available_classes = sorted(list(unique_labels))[:4]

        n_classes = len(available_classes)
        if n_classes == 0:
            raise ValueError("No beats found with matching classes to plot.")

        # Class metadata
        class_meta = {
            'N': {'name': 'Normal Sinus Beat (N)', 'color': '#16a34a', 'desc': 'Narrow QRS, normal P and T waves'},
            'V': {'name': 'Premature Ventricular Contraction (V / PVC)', 'color': '#dc2626', 'desc': 'Wide bizarre QRS, discordant T wave'},
            'A': {'name': 'Atrial Premature Beat (A / PAC)', 'color': '#ea580c', 'desc': 'Early abnormal P wave, normal narrow QRS'},
            'L': {'name': 'Left Bundle Branch Block (L / LBBB)', 'color': '#7c3aed', 'desc': 'Broad notched R wave, delayed LV activation'},
            'R': {'name': 'Right Bundle Branch Block (R / RBBB)', 'color': '#0284c7', 'desc': 'rsR\' pattern, delayed RV activation'},
            'F': {'name': 'Fusion Beat (F)', 'color': '#b45309', 'desc': 'Intermediate morphology between N and V'},
            '/': {'name': 'Paced Beat (/)', 'color': '#475569', 'desc': 'Sharp pacemaker spike preceding wide QRS'},
        }

        fig, axes = plt.subplots(1, n_classes, figsize=(4.2 * n_classes, 4.6),
                                 dpi=self.dpi, facecolor='#ffffff')
        if n_classes == 1:
            axes = [axes]

        n_samples = beats.shape[1]
        t_ms = (np.arange(n_samples) / fs - pre_r_sec) * 1000  # Time in milliseconds, 0 = R-peak

        for idx, cls_code in enumerate(available_classes):
            ax = axes[idx]
            indices = [i for i, lbl in enumerate(labels) if lbl == cls_code]
            cls_beats = beats[indices]
            meta = class_meta.get(cls_code, {'name': f"Class {cls_code}", 'color': '#334155', 'desc': ''})
            color = meta['color']

            # 1. Background grid
            ax.set_facecolor('#fffdfa')
            ax.grid(True, which='both', color='#fecaca', linestyle='-', linewidth=0.5, alpha=0.7)
            ax.axvline(0, color='#94a3b8', linestyle='--', linewidth=0.9, zorder=2) # R-peak marker
            ax.axhline(0, color='#94a3b8', linestyle='-', linewidth=0.7, zorder=2)

            # 2. Plot individual beats with low opacity
            max_beats_to_draw = min(60, len(cls_beats))
            for b_i in range(max_beats_to_draw):
                ax.plot(t_ms, cls_beats[b_i], color=color, alpha=0.12, linewidth=0.9, zorder=3)

            # 3. Calculate Mean and Standard Deviation
            mean_beat = np.mean(cls_beats, axis=0)
            std_beat = np.std(cls_beats, axis=0)

            # 4. Fill standard deviation confidence envelope
            ax.fill_between(t_ms, mean_beat - std_beat, mean_beat + std_beat,
                            color=color, alpha=0.25, label='± 1 SD Confidence', zorder=4)

            # 5. Thick Mean Beat Line
            ax.plot(t_ms, mean_beat, color=color, linewidth=2.4,
                    label=f'Mean Beat (N={len(cls_beats)})', zorder=5)

            # Subplot titles and formatting
            ax.set_title(f"{meta['name']}\n(n = {len(cls_beats)} beats)",
                         fontsize=10.5, fontweight='bold', color='#1e293b', pad=8)
            ax.set_xlabel("Time from R-Peak (ms)", fontsize=9, color='#334155')
            if idx == 0:
                ax.set_ylabel("Amplitude (mV)", fontsize=9, color='#334155')
            ax.set_xlim(t_ms[0], t_ms[-1])
            ax.legend(loc='upper right', fontsize=8, framealpha=0.85)

            for spine in ax.spines.values():
                spine.set_color('#cbd5e1')

        fig.suptitle(title, fontsize=12.5, fontweight='bold', color='#0f172a', y=1.02)
        fig.tight_layout()

        if save_path:
            os.makedirs(os.path.dirname(os.path.abspath(save_path)), exist_ok=True)
            fig.savefig(save_path, dpi=self.dpi, facecolor='#ffffff', bbox_inches='tight')

        return fig

    def plot_poincare_hrv(self,
                          rr_intervals_ms: np.ndarray,
                          beat_labels: Optional[List[str]] = None,
                          title: str = "Poincaré Plot (RR_{n} vs RR_{n+1}) & HRV Analysis",
                          save_path: Optional[str] = None) -> Tuple[plt.Figure, Dict[str, float]]:
        """
        Generates the standard Poincaré Plot ($RR_n$ vs $RR_{n+1}$) used for:
        1. Diagnosing Arrhythmias (AFib 'fan/comet' pattern, PVC cluster, sinus rhythm cigar)
        2. Quantifying HRV:
           - SD1 (Standard deviation perpendicular to identity line: short-term beat-to-beat variability)
           - SD2 (Standard deviation along identity line: long-term variability)
           - SD1/SD2 ratio
        """
        if len(rr_intervals_ms) < 3:
            raise ValueError("Need at least 3 RR intervals for Poincaré plot.")

        rr_n = rr_intervals_ms[:-1]
        rr_n1 = rr_intervals_ms[1:]

        # Calculate SD1 and SD2
        diff_rr = rr_n1 - rr_n
        sd1 = np.sqrt(0.5 * np.var(diff_rr))
        sd2 = np.sqrt(2 * np.var(rr_intervals_ms) - 0.5 * np.var(diff_rr))
        sd_ratio = sd1 / (sd2 + 1e-9)

        mean_rr = np.mean(rr_intervals_ms)
        mean_hr = 60000.0 / mean_rr

        fig, ax = plt.subplots(figsize=(7.5, 7.5), dpi=self.dpi, facecolor='#ffffff')
        ax.set_facecolor('#f8fafc')

        # Grid lines
        ax.grid(True, linestyle='--', color='#e2e8f0', linewidth=0.8)

        # Plot Identity Line (y = x)
        axis_min = max(300, np.min(rr_intervals_ms) - 100)
        axis_max = min(1800, np.max(rr_intervals_ms) + 100)
        ax.plot([axis_min, axis_max], [axis_min, axis_max],
                color='#94a3b8', linestyle='--', linewidth=1.2, label='Line of Identity (y = x)')

        # Color points by beat label if provided
        if beat_labels and len(beat_labels) >= len(rr_n):
            colors_map = {
                'N': '#16a34a',
                'V': '#dc2626',
                'A': '#ea580c',
                'L': '#7c3aed',
                'R': '#0284c7'
            }
            point_colors = [colors_map.get(beat_labels[i], '#2563eb') for i in range(len(rr_n))]
            ax.scatter(rr_n, rr_n1, c=point_colors, s=28, alpha=0.7, edgecolors='none', zorder=3)
        else:
            ax.scatter(rr_n, rr_n1, color='#2563eb', s=26, alpha=0.65, edgecolors='none', zorder=3)

        # Center point
        ax.scatter([mean_rr], [mean_rr], color='#dc2626', s=80, marker='X',
                   label=f'Center ({int(mean_rr)} ms)', zorder=5)

        # Fit Confidence Ellipse at 45 degrees
        ellipse_angle = 45.0  # degrees
        ellipse = patches.Ellipse(
            (mean_rr, mean_rr),
            width=2 * sd2,
            height=2 * sd1,
            angle=ellipse_angle,
            edgecolor='#0284c7',
            facecolor='#38bdf8',
            alpha=0.2,
            linewidth=1.8,
            linestyle='-',
            label=f'HRV Ellipse (SD1: {sd1:.1f}ms, SD2: {sd2:.1f}ms)',
            zorder=4
        )
        ax.add_patch(ellipse)

        # Draw SD1 and SD2 axis vectors
        rad_45 = np.radians(45)
        # Vector along identity (SD2)
        dx_sd2 = sd2 * np.cos(rad_45)
        dy_sd2 = sd2 * np.sin(rad_45)
        ax.plot([mean_rr - dx_sd2, mean_rr + dx_sd2],
                [mean_rr - dy_sd2, mean_rr + dy_sd2],
                color='#0369a1', linewidth=1.8, zorder=6)

        # Vector perpendicular (SD1)
        dx_sd1 = -sd1 * np.sin(rad_45)
        dy_sd1 = sd1 * np.cos(rad_45)
        ax.plot([mean_rr - dx_sd1, mean_rr + dx_sd1],
                [mean_rr - dy_sd1, mean_rr + dy_sd1],
                color='#b91c1c', linewidth=1.8, zorder=6)

        # Formatting
        ax.set_xlim(axis_min, axis_max)
        ax.set_ylim(axis_min, axis_max)
        ax.set_xlabel(r"$RR_n$ Interval (ms)", fontsize=10.5, color='#1e293b')
        ax.set_ylabel(r"$RR_{n+1}$ Interval (ms)", fontsize=10.5, color='#1e293b')
        ax.set_title(title, fontsize=12, fontweight='bold', color='#0f172a', pad=12)

        # Metrics annotation box
        metrics_text = (
            f"HRV Metrics:\n"
            f"Mean RR: {mean_rr:.1f} ms\n"
            f"Mean HR: {mean_hr:.1f} bpm\n"
            f"SD1 (Short-term): {sd1:.1f} ms\n"
            f"SD2 (Long-term): {sd2:.1f} ms\n"
            f"SD1 / SD2: {sd_ratio:.3f}"
        )
        ax.text(0.04, 0.96, metrics_text,
                transform=ax.transAxes,
                fontsize=9.5,
                verticalalignment='top',
                bbox=dict(boxstyle="round,pad=0.4", facecolor='#ffffff', edgecolor='#cbd5e1', alpha=0.9),
                zorder=7)

        ax.legend(loc='lower right', fontsize=9, framealpha=0.9)

        if save_path:
            os.makedirs(os.path.dirname(os.path.abspath(save_path)), exist_ok=True)
            fig.savefig(save_path, dpi=self.dpi, facecolor='#ffffff', bbox_inches='tight')

        hrv_stats = {
            'mean_rr_ms': float(mean_rr),
            'mean_hr_bpm': float(mean_hr),
            'sd1_ms': float(sd1),
            'sd2_ms': float(sd2),
            'sd_ratio': float(sd_ratio),
        }

        return fig, hrv_stats

    def plot_tachogram(self,
                       rr_intervals_ms: np.ndarray,
                       fs: float = 360.0,
                       title: str = "RR-Interval Tachogram (Rhythm Regularity Trend)",
                       save_path: Optional[str] = None) -> plt.Figure:
        """Plots the sequence of RR intervals across time."""
        fig, ax = plt.subplots(figsize=(12, 3.8), dpi=self.dpi, facecolor='#ffffff')
        ax.set_facecolor('#fffdfa')
        ax.grid(True, linestyle='--', color='#fecaca', linewidth=0.5)

        beat_indices = np.arange(1, len(rr_intervals_ms) + 1)
        ax.plot(beat_indices, rr_intervals_ms, color='#2563eb', linewidth=1.2, marker='o',
                markersize=3.5, markerfacecolor='#1d4ed8')

        mean_rr = np.mean(rr_intervals_ms)
        ax.axhline(mean_rr, color='#dc2626', linestyle='--', linewidth=1.2,
                   label=f'Mean RR ({int(mean_rr)} ms)')

        ax.set_xlabel("Beat Number", fontsize=9.5, color='#1e293b')
        ax.set_ylabel("RR Interval (ms)", fontsize=9.5, color='#1e293b')
        ax.set_title(title, fontsize=11.5, fontweight='bold', color='#0f172a')
        ax.legend(loc='upper right', fontsize=9)

        if save_path:
            os.makedirs(os.path.dirname(os.path.abspath(save_path)), exist_ok=True)
            fig.savefig(save_path, dpi=self.dpi, facecolor='#ffffff', bbox_inches='tight')

        return fig
