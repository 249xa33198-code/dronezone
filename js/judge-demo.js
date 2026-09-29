/**
 * TerraVision AI - 3-5 Minute Platform Tour Engine
 * Automated Guided Presentation Tour
 */

const TerraJudgeDemo = {
  currentStepIndex: 0,
  isPlaying: false,
  timer: null,
  stepDurationMs: 14000, // 14s per step in auto mode

  steps: [
    {
      step: 1,
      title: "1. Drone Survey Capture & Orthorectification",
      category: "Data Acquisition",
      desc: "Raw drone imagery is captured at 2.4cm GSD over Zone 04 (14.8 sq. km). Ground Control Points (GCPs) tie to the National CORS network (EPSG:3857) producing a sub-5cm orthomosaic.",
      targetView: "app-view",
      targetTab: "tab-drone-surveys",
      action: () => {
        if (window.showToast) window.showToast("Step 1: Inspecting 2.4cm GSD Drone Orthomosaic for Zone 04.", "info");
      }
    },
    {
      step: 2,
      title: "2. Deep Learning AI Feature Segmentation",
      category: "Computer Vision / GeoAI",
      desc: "Our multi-task deep neural network runs real-time inference on the orthomosaic, segmenting roof footprints, road curb networks, and parcel boundaries simultaneously.",
      targetView: "app-view",
      targetTab: "tab-ai-extraction",
      action: () => {
        if (window.showToast) window.showToast("Step 2: Scanning aerial imagery — 18,230 building footprints identified.", "info");
      }
    },
    {
      step: 3,
      title: "3. Cadastral Boundary & Parcel Extraction",
      category: "Vectorization",
      desc: "Raster masks are vectorized into closed, topologically valid parcel polygons. The system assigns unique cadastral parcel IDs (e.g., P-102 to P-108) with preliminary area metrics.",
      targetView: "app-view",
      targetTab: "tab-ai-extraction",
      action: () => {
        if (window.showToast) window.showToast("Step 3: GIS-ready vector polygons generated.", "success");
      }
    },
    {
      step: 4,
      title: "4. Interactive 2D GIS Command Map",
      category: "Web-GIS Engine",
      desc: "Authorities access the city-wide geospatial command center with layered cadastral boundaries, buildings, roads, and land-use classifications with click-to-inspect attributes.",
      targetView: "app-view",
      targetTab: "tab-gis-map",
      action: () => {
        setTimeout(() => {
          if (window.TerraMapEngine) {
            window.TerraMapEngine.selectParcel("P-102");
          }
        }, 500);
      }
    },
    {
      step: 5,
      title: "5. 3D Urban Digital Twin & Height Modeling",
      category: "Digital Twin",
      desc: "By fusing Digital Surface Models (DSM) with building footprints, TerraVision AI automatically extrudes 3D structures, calculating heights (e.g. 14.2m) and volumetric densities.",
      targetView: "app-view",
      targetTab: "tab-digital-twin",
      action: () => {
        setTimeout(() => {
          if (window.TerraTwin3D) {
            window.TerraTwin3D.setCameraView('3D');
          }
        }, 600);
      }
    },
    {
      step: 6,
      title: "6. Urban Change Intelligence (2025 vs 2026)",
      category: "Change Detection",
      desc: "Automated multi-temporal comparison detects new unauthorized or authorized constructions. Parcel P-102 shows vacant plot in 2025 converted to G+3 building in 2026 with 96% AI confidence.",
      targetView: "app-view",
      targetTab: "tab-change-detection",
      action: () => {
        setTimeout(() => {
          if (window.TerraChangeSlider) {
            window.TerraChangeSlider.updateSliderPosition(window.innerWidth * 0.45);
          }
        }, 500);
      }
    },
    {
      step: 7,
      title: "7. Automated Topology Validation & Quality Control",
      category: "Topological Integrity",
      desc: "Strict topological rule engine prevents legal disputes by flagging overlaps, sliver gaps, self-intersections, and boundary shifts. Issue #T-102 is flagged for surveyor dispatch.",
      targetView: "app-view",
      targetTab: "tab-topology-validation",
      action: () => {
        if (window.showToast) window.showToast("Step 7: Topology engine checked 12,450 polygons — 99.1% pass rate.", "info");
      }
    },
    {
      step: 8,
      title: "8. AI Surveyor Copilot & Boundary Editing",
      category: "Human-in-the-Loop",
      desc: "AI doesn't replace surveyors; it empowers them. The AI Surveyor Copilot flags uncertain boundaries (72% confidence on P-102) and provides an interactive GIS vertex editor for field correction.",
      targetView: "app-view",
      targetTab: "tab-surveyor-copilot",
      action: () => {
        setTimeout(() => {
          if (window.TerraBoundaryEditor) {
            window.TerraBoundaryEditor.loadParcel("P-102");
          }
        }, 500);
      }
    },
    {
      step: 9,
      title: "9. Final GIS-Ready Output & Cadastral Reports",
      category: "Government Deliverable",
      desc: "Once verified by the licensed surveyor and endorsed by municipal authorities, the system exports compliant Shapefiles, GeoJSON, and official audit reports for cadastral integration.",
      targetView: "app-view",
      targetTab: "tab-reports",
      action: () => {
        setTimeout(() => {
          if (window.openReportModal) {
            window.openReportModal();
          }
        }, 600);
      }
    }
  ],

  startDemo() {
    this.currentStepIndex = 0;
    this.isPlaying = false;
    const bar = document.getElementById("judge-demo-bar");
    if (bar) bar.classList.add("active");

    if (window.showToast) {
      window.showToast("🎬 Launching Guided Platform Presentation Tour (3-5 Min)", "info");
    }

    this.renderCurrentStep();
  },

  renderCurrentStep() {
    const s = this.steps[this.currentStepIndex];
    if (!s) return;

    // Switch view and tab
    if (window.switchView) window.switchView(s.targetView);
    if (window.switchWorkspaceTab) window.switchWorkspaceTab(s.targetTab);

    // Run specific step actions
    if (typeof s.action === "function") {
      s.action();
    }

    // Update UI elements
    const stepNumEl = document.getElementById("judge-step-number");
    const stepTotalEl = document.getElementById("judge-step-total");
    const stepTitleEl = document.getElementById("judge-step-title");
    const stepCategoryEl = document.getElementById("judge-step-category");
    const stepDescEl = document.getElementById("judge-step-desc");
    const progressFill = document.getElementById("judge-step-progress-fill");

    if (stepNumEl) stepNumEl.innerText = s.step;
    if (stepTotalEl) stepTotalEl.innerText = this.steps.length;
    if (stepTitleEl) stepTitleEl.innerText = s.title;
    if (stepCategoryEl) stepCategoryEl.innerText = s.category;
    if (stepDescEl) stepDescEl.innerText = s.desc;

    if (progressFill) {
      const pct = (s.step / this.steps.length) * 100;
      progressFill.style.width = `${pct}%`;
    }

    // Auto-advance if playing
    if (this.isPlaying) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.nextStep();
      }, this.stepDurationMs);
    }
  },

  nextStep() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.renderCurrentStep();
    } else {
      this.stopAutoPlay();
      if (window.showToast) {
        window.showToast("🏆 Platform Demonstration Tour Completed! Full platform is now interactive.", "success");
      }
    }
  },

  prevStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.renderCurrentStep();
    }
  },

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    const btn = document.getElementById("btn-judge-play-pause");
    if (btn) btn.innerText = this.isPlaying ? "⏸ Pause Tour" : "▶ Auto Play";

    if (this.isPlaying) {
      this.renderCurrentStep();
    } else {
      clearTimeout(this.timer);
    }
  },

  stopAutoPlay() {
    this.isPlaying = false;
    clearTimeout(this.timer);
    const btn = document.getElementById("btn-judge-play-pause");
    if (btn) btn.innerText = "▶ Auto Play";
  },

  closeDemo() {
    this.stopAutoPlay();
    const bar = document.getElementById("judge-demo-bar");
    if (bar) bar.classList.remove("active");
  }
};

window.TerraJudgeDemo = TerraJudgeDemo;
