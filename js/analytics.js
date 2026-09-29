/**
 * TerraVision AI - Authority Analytics Engine (Chart.js)
 * Cadastral Analytics, Confidence Distribution & Survey Progress
 */

const TerraAnalytics = {
  charts: {},

  init() {
    if (typeof Chart === "undefined") {
      console.warn("Chart.js not yet loaded.");
      return;
    }

    // Set Chart.js dark defaults
    Chart.defaults.color = "#94a3b8";
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.plugins.tooltip.backgroundColor = "rgba(15, 23, 42, 0.95)";
    Chart.defaults.plugins.tooltip.borderColor = "rgba(0, 242, 254, 0.4)";
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 10;

    this.renderParcelsOverTime();
    this.renderVerificationDonut();
    this.renderConfidenceBar();
    this.renderLandUseDoughnut();
    this.renderIssuesCategory();
  },

  renderParcelsOverTime() {
    const ctx = document.getElementById("chart-parcels-time");
    if (!ctx) return;
    if (this.charts.parcelsTime) this.charts.parcelsTime.destroy();

    this.charts.parcelsTime = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Apr 2026", "May 2026", "Jun 2026", "Jul 2026", "Aug 2026", "Sep 2026"],
        datasets: [
          {
            label: "AI Mapped Parcels",
            data: [1200, 3400, 6100, 8900, 11200, 12450],
            borderColor: "#00f2fe",
            backgroundColor: "rgba(0, 242, 254, 0.1)",
            fill: true,
            tension: 0.35,
            borderWidth: 2.5
          },
          {
            label: "Ground Verified",
            data: [950, 2900, 5300, 7800, 10400, 12130],
            borderColor: "#10b981",
            backgroundColor: "transparent",
            borderDash: [5, 5],
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12 } }
        },
        scales: {
          x: { grid: { color: "rgba(255, 255, 255, 0.05)" } },
          y: { grid: { color: "rgba(255, 255, 255, 0.05)" } }
        }
      }
    });
  },

  renderVerificationDonut() {
    const ctx = document.getElementById("chart-verification-donut");
    if (!ctx) return;
    if (this.charts.verification) this.charts.verification.destroy();

    this.charts.verification = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Auto-Verified High Conf", "Field Verified", "Needs Verification", "Flagged Issues"],
        datasets: [{
          data: [11980, 150, 220, 100],
          backgroundColor: ["#10b981", "#0284c7", "#f59e0b", "#ef4444"],
          borderColor: "#0f172a",
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, padding: 14 } }
        },
        cutout: '72%'
      }
    });
  },

  renderConfidenceBar() {
    const ctx = document.getElementById("chart-confidence-bar");
    if (!ctx) return;
    if (this.charts.confidence) this.charts.confidence.destroy();

    this.charts.confidence = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [">95% Conf", "90-95% Conf", "80-90% Conf", "70-80% Conf", "<70% Low Conf"],
        datasets: [{
          label: "Parcels",
          data: [8420, 3100, 610, 220, 100],
          backgroundColor: ["#10b981", "#38bdf8", "#6366f1", "#f59e0b", "#ef4444"],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: "rgba(255, 255, 255, 0.05)" } }
        }
      }
    });
  },

  renderLandUseDoughnut() {
    const ctx = document.getElementById("chart-landuse-donut");
    if (!ctx) return;
    if (this.charts.landUse) this.charts.landUse.destroy();

    this.charts.landUse = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Residential (54.2%)", "Commercial (21.8%)", "Open Land (11.2%)", "Industrial (8.4%)", "Transport (3.1%)", "Construction (1.3%)"],
        datasets: [{
          data: [54.2, 21.8, 11.2, 8.4, 3.1, 1.3],
          backgroundColor: ["#3b82f6", "#00f2fe", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"],
          borderColor: "#0f172a",
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 10, padding: 10 } }
        }
      }
    });
  },

  renderIssuesCategory() {
    const ctx = document.getElementById("chart-issues-bar");
    if (!ctx) return;
    if (this.charts.issues) this.charts.issues.destroy();

    this.charts.issues = new Chart(ctx, {
      type: "bar",
      indexAxis: 'y',
      data: {
        labels: ["Overlapping Geometry", "Tree Canopy Shadow", "Roof Overhang", "Sliver Gap", "Waterbody Buffer"],
        datasets: [{
          label: "Incidents",
          data: [14, 28, 42, 8, 12],
          backgroundColor: "#f59e0b",
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: "rgba(255, 255, 255, 0.05)" } },
          y: { grid: { display: false } }
        }
      }
    });
  }
};

window.TerraAnalytics = TerraAnalytics;
