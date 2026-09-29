/**
 * TerraVision AI - Urban Change Intelligence Engine
 * Multi-Temporal Drone Comparison & Automated Change Detection
 */

const TerraChangeSlider = {
  container: null,
  sliderHandle: null,
  afterImageWrap: null,
  isDragging: false,

  init(containerId = "change-slider-wrap") {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.sliderHandle = document.getElementById("slider-handle-bar");
    this.afterImageWrap = document.getElementById("slider-after-wrap");

    this.setupEvents();
    this.drawSimulatedSurveys();
  },

  setupEvents() {
    const handleDown = () => {
      this.isDragging = true;
    };

    const handleUp = () => {
      this.isDragging = false;
    };

    const handleMove = (e) => {
      if (!this.isDragging) return;
      this.updateSliderPosition(e.clientX);
    };

    const handleTouchMove = (e) => {
      if (!this.isDragging || !e.touches[0]) return;
      this.updateSliderPosition(e.touches[0].clientX);
    };

    if (this.sliderHandle) {
      this.sliderHandle.addEventListener("mousedown", handleDown);
      this.sliderHandle.addEventListener("touchstart", handleDown);
    }

    this.container.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      this.updateSliderPosition(e.clientX);
    });

    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchend", handleUp);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleTouchMove);
  },

  updateSliderPosition(clientX) {
    if (!this.container) return;
    const rect = this.container.getBoundingClientRect();
    let posX = clientX - rect.left;
    posX = Math.max(20, Math.min(rect.width - 20, posX));

    const percentage = (posX / rect.width) * 100;
    if (this.afterImageWrap) {
      this.afterImageWrap.style.width = `${percentage}%`;
    }
    if (this.sliderHandle) {
      this.sliderHandle.style.left = `${percentage}%`;
    }
  },

  drawSimulatedSurveys() {
    // 2025 Historical Canvas
    const canvasBefore = document.getElementById("canvas-survey-2025");
    if (canvasBefore) {
      const ctx = canvasBefore.getContext("2d");
      const w = canvasBefore.width = canvasBefore.parentElement.clientWidth || 800;
      const h = canvasBefore.height = 500;

      // Draw 2025 Vacant Plot
      ctx.fillStyle = "#0a1912";
      ctx.fillRect(0, 0, w, h);

      // Grass/soil texture
      ctx.fillStyle = "rgba(16, 185, 129, 0.08)";
      for (let i = 0; i < 60; i++) {
        const rx = Math.random() * w;
        const ry = Math.random() * h;
        ctx.beginPath();
        ctx.arc(rx, ry, Math.random() * 20 + 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Vacant plot boundary
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.strokeRect(w * 0.35, h * 0.25, w * 0.3, h * 0.5);
      ctx.setLineDash([]);

      ctx.fillStyle = "#10b981";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("🟩 PARCEL P-102: VACANT PLOT (SURVEY YEAR 2025)", w * 0.36, h * 0.5);
      ctx.font = "12px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("DSM Elevation: +1.2m (Flat Vegetation) · Footprint: 0 m²", w * 0.36, h * 0.55);
    }

    // 2026 Drone Orthomosaic Canvas
    const canvasAfter = document.getElementById("canvas-survey-2026");
    if (canvasAfter) {
      const ctx = canvasAfter.getContext("2d");
      const w = canvasAfter.width = canvasAfter.parentElement.parentElement.clientWidth || 800;
      const h = canvasAfter.height = 500;

      // Draw 2026 Urban Orthomosaic
      ctx.fillStyle = "#060911";
      ctx.fillRect(0, 0, w, h);

      // Road
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, h * 0.8, w, h * 0.2);

      // Surrounding plots
      ctx.strokeStyle = "rgba(0, 242, 254, 0.4)";
      ctx.lineWidth = 1;
      ctx.strokeRect(w * 0.05, h * 0.2, w * 0.25, h * 0.55);
      ctx.strokeRect(w * 0.7, h * 0.2, w * 0.25, h * 0.55);

      // Parcel P-102 with NEW BUILDING
      const px = w * 0.35;
      const py = h * 0.25;
      const pw = w * 0.3;
      const ph = h * 0.5;

      // Parcel perimeter
      ctx.strokeStyle = "#00f2fe";
      ctx.lineWidth = 2;
      ctx.strokeRect(px, py, pw, ph);

      // Extruded Building Shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillRect(px + 40 + 12, py + 40 + 12, pw - 80, ph - 80);

      // Building Rooftop
      ctx.fillStyle = "#334155";
      ctx.fillRect(px + 40, py + 40, pw - 80, ph - 80);

      // Rooftop units / AC vents / Water tank
      ctx.fillStyle = "#475569";
      ctx.fillRect(px + 60, py + 55, 30, 25);
      ctx.fillRect(px + 120, py + 65, 40, 35);

      // AI Bounding Box highlight (Red pulse)
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 3;
      ctx.strokeRect(px + 36, py + 36, pw - 72, ph - 72);

      // Detection Tag
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(px + 36, py + 12, 230, 24);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px monospace";
      ctx.fillText("🔴 NEW CONSTRUCTION (96% CONF)", px + 42, py + 28);
    }
  },

  runComparison() {
    if (window.showToast) {
      window.showToast("Executing multi-temporal raster differencing & DSM surface comparison...", "info");
    }
    setTimeout(() => {
      if (window.showToast) {
        window.showToast("Analysis complete: 150 changes detected across Zone 04.", "success");
      }
    }, 800);
  }
};

window.TerraChangeSlider = TerraChangeSlider;
