/**
 * TerraVision AI - AI Surveyor Copilot & Interactive GIS Boundary Editor
 * Vertex Manipulation, AI vs Surveyor Comparison & Verification Workflow
 */

const TerraBoundaryEditor = {
  canvas: null,
  ctx: null,
  currentParcelId: "P-102",
  history: [],
  historyIndex: -1,

  // Base AI Suggested Polygon (Reference)
  aiVertices: [
    { x: 180, y: 140 },
    { x: 440, y: 130 },
    { x: 490, y: 360 },
    { x: 380, y: 410 }, // Obscured corner
    { x: 160, y: 380 }
  ],

  // Surveyor Corrected Editable Polygon
  surveyorVertices: [
    { x: 180, y: 140 },
    { x: 440, y: 130 },
    { x: 490, y: 360 },
    { x: 380, y: 410 },
    { x: 160, y: 380 }
  ],

  // Internal building footprint
  buildingVertices: [
    { x: 230, y: 180 },
    { x: 380, y: 175 },
    { x: 375, y: 310 },
    { x: 225, y: 305 }
  ],

  draggingIndex: -1,
  hoveredIndex: -1,
  activeTool: 'select', // 'select', 'add', 'delete', 'split'
  splitPoints: [],
  showAiReference: true,
  showSurveyorLayer: true,
  showBuildingLayer: true,

  init(canvasId = "boundary-canvas") {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");

    this.resizeCanvas();
    this.saveState();
    this.setupEvents();
    this.draw();

    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.draw();
    });
  },

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    this.canvas.width = parent.clientWidth || 700;
    this.canvas.height = Math.max(parent.clientHeight - 60, 480);
  },

  saveState() {
    // Keep history up to current index
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(JSON.parse(JSON.stringify(this.surveyorVertices)));
    this.historyIndex = this.history.length - 1;
    this.updateUndoRedoUI();
  },

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.surveyorVertices = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      this.draw();
      this.updateUndoRedoUI();
      if (window.showToast) window.showToast("Undo boundary adjustment", "info");
    }
  },

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.surveyorVertices = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      this.draw();
      this.updateUndoRedoUI();
      if (window.showToast) window.showToast("Redo boundary adjustment", "info");
    }
  },

  updateUndoRedoUI() {
    const btnUndo = document.getElementById("btn-editor-undo");
    const btnRedo = document.getElementById("btn-editor-redo");
    if (btnUndo) btnUndo.disabled = this.historyIndex <= 0;
    if (btnRedo) btnRedo.disabled = this.historyIndex >= this.history.length - 1;
    this.updateAreaStats();
  },

  setTool(tool) {
    this.activeTool = tool;
    this.splitPoints = [];
    const buttons = document.querySelectorAll(".editor-tool-btn");
    buttons.forEach(b => b.classList.remove("active"));
    const activeBtn = document.getElementById(`tool-${tool}`);
    if (activeBtn) activeBtn.classList.add("active");

    if (window.showToast) {
      const toolNames = {
        select: "Select & Drag Vertex Mode",
        add: "Add Vertex Mode (Click anywhere on boundary edge)",
        delete: "Delete Vertex Mode (Click vertex to remove)",
        split: "Split Parcel Tool (Click 2 perimeter points to split)",
        merge: "Merge Parcel Tool"
      };
      window.showToast(toolNames[tool] || "Tool changed", "info");
    }
    this.draw();
  },

  calculateArea(vertices) {
    let area = 0;
    for (let i = 0; i < vertices.length; i++) {
      const j = (i + 1) % vertices.length;
      area += vertices[i].x * vertices[j].y;
      area -= vertices[j].x * vertices[i].y;
    }
    // Scale factor to realistic square meters
    return Math.abs(area / 2) * 0.0072;
  },

  updateAreaStats() {
    const aiArea = 485.6;
    const currentArea = this.calculateArea(this.surveyorVertices) * 10;
    const diff = (currentArea - aiArea).toFixed(1);

    const statAi = document.getElementById("editor-stat-ai-area");
    const statAdj = document.getElementById("editor-stat-adj-area");
    const statDiff = document.getElementById("editor-stat-diff");

    if (statAi) statAi.innerText = `${aiArea} m²`;
    if (statAdj) statAdj.innerText = `${currentArea.toFixed(1)} m²`;
    if (statDiff) {
      statDiff.innerText = `${diff > 0 ? '+' : ''}${diff} m²`;
      statDiff.style.color = Math.abs(diff) > 10 ? "var(--status-warning)" : "var(--status-success)";
    }
  },

  setupEvents() {
    this.canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
    this.canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
    this.canvas.addEventListener("mouseup", () => this.onMouseUp());
    this.canvas.addEventListener("mouseleave", () => this.onMouseUp());
  },

  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  },

  onMouseDown(e) {
    const pos = this.getMousePos(e);

    if (this.activeTool === 'select') {
      const index = this.findVertexNear(pos.x, pos.y);
      if (index !== -1) {
        this.draggingIndex = index;
      }
    } else if (this.activeTool === 'delete') {
      const index = this.findVertexNear(pos.x, pos.y);
      if (index !== -1 && this.surveyorVertices.length > 3) {
        this.surveyorVertices.splice(index, 1);
        this.saveState();
        this.draw();
        if (window.showToast) window.showToast(`Removed vertex #${index + 1}`, "info");
      }
    } else if (this.activeTool === 'add') {
      // Find closest edge to add vertex
      const edge = this.findEdgeNear(pos.x, pos.y);
      if (edge) {
        this.surveyorVertices.splice(edge.index + 1, 0, { x: pos.x, y: pos.y });
        this.saveState();
        this.draw();
        if (window.showToast) window.showToast("Inserted new boundary vertex", "success");
      }
    } else if (this.activeTool === 'split') {
      this.splitPoints.push(pos);
      if (this.splitPoints.length === 2) {
        if (window.showToast) window.showToast("Parcel Split preview line generated. Subdivided into P-102-A and P-102-B", "success");
        setTimeout(() => {
          this.splitPoints = [];
          this.draw();
        }, 2000);
      }
      this.draw();
    }
  },

  onMouseMove(e) {
    const pos = this.getMousePos(e);

    if (this.draggingIndex !== -1) {
      this.surveyorVertices[this.draggingIndex] = { x: pos.x, y: pos.y };
      this.draw();
      this.updateAreaStats();
      return;
    }

    // Check hover
    const index = this.findVertexNear(pos.x, pos.y);
    if (index !== this.hoveredIndex) {
      this.hoveredIndex = index;
      this.canvas.style.cursor = index !== -1 ? 'grab' : 'crosshair';
      this.draw();
    }
  },

  onMouseUp() {
    if (this.draggingIndex !== -1) {
      this.draggingIndex = -1;
      this.saveState();
      this.draw();
      if (window.showToast) window.showToast("Boundary vertex adjusted & topological coordinates re-calculated.", "info");
    }
  },

  findVertexNear(x, y, radius = 12) {
    for (let i = 0; i < this.surveyorVertices.length; i++) {
      const v = this.surveyorVertices[i];
      const dist = Math.hypot(v.x - x, v.y - y);
      if (dist <= radius) return i;
    }
    return -1;
  },

  findEdgeNear(x, y, maxDist = 10) {
    for (let i = 0; i < this.surveyorVertices.length; i++) {
      const p1 = this.surveyorVertices[i];
      const p2 = this.surveyorVertices[(i + 1) % this.surveyorVertices.length];
      const dist = this.distToSegment({ x, y }, p1, p2);
      if (dist <= maxDist) return { index: i };
    }
    return null;
  },

  distToSegment(p, v, w) {
    const l2 = (w.x - v.x) ** 2 + (w.y - v.y) ** 2;
    if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
  },

  resetToAi() {
    this.surveyorVertices = JSON.parse(JSON.stringify(this.aiVertices));
    this.saveState();
    this.draw();
    if (window.showToast) window.showToast("Boundary reset to AI preliminary prediction.", "warning");
  },

  submitVerification() {
    const parcel = window.TERRA_DATA.parcels.find(p => p.id === this.currentParcelId);
    if (parcel) {
      parcel.status = "Verified (Surveyor Signed)";
      parcel.confidence = 98.5;
      parcel.issueDescription = "Boundary corner clarified by Surveyor R. Sharma. Ground truth verified.";
    }

    if (window.showToast) {
      window.showToast(`Parcel ${this.currentParcelId} verification submitted! Ready for Authority final endorsement.`, "success");
    }

    // Refresh queue UI
    this.renderQueue();
  },

  renderQueue() {
    const container = document.getElementById("surveyor-queue-list");
    if (!container || !window.TERRA_DATA) return;

    container.innerHTML = "";
    window.TERRA_DATA.parcels.forEach(p => {
      const card = document.createElement("div");
      card.className = `queue-parcel-item ${p.id === this.currentParcelId ? 'active' : ''}`;
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <strong style="color:${p.id === this.currentParcelId ? 'var(--accent-cyan)' : '#fff'};">Parcel ${p.id}</strong>
          <span class="badge ${p.status.includes('Verified') ? 'badge-success' : 'badge-warning'}">${p.status}</span>
        </div>
        <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:4px;">
          Confidence: <strong style="color:${p.confidence > 80 ? 'var(--status-success)' : 'var(--status-warning)'};">${p.confidence}%</strong> · Zone: ${p.surveyZone}
        </div>
        <div style="font-size:0.75rem; color:var(--text-secondary); line-height:1.3; margin-bottom:8px;">
          ${p.issueDescription || "Standard automated extraction ready for review."}
        </div>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-sm btn-outline-cyan" onclick="TerraBoundaryEditor.loadParcel('${p.id}')">Edit Boundary</button>
          <button class="btn btn-sm btn-success" onclick="TerraBoundaryEditor.quickApprove('${p.id}')">Approve</button>
        </div>
      `;
      container.appendChild(card);
    });
  },

  loadParcel(parcelId) {
    this.currentParcelId = parcelId;
    this.renderQueue();
    if (window.showToast) window.showToast(`Loaded Parcel ${parcelId} in Boundary Editor`, "info");
    this.draw();
  },

  quickApprove(parcelId) {
    const parcel = window.TERRA_DATA.parcels.find(p => p.id === parcelId);
    if (parcel) {
      parcel.status = "Verified";
      parcel.confidence = 99.0;
    }
    this.renderQueue();
    if (window.showToast) window.showToast(`Parcel ${parcelId} approved by Field Surveyor.`, "success");
  },

  draw() {
    if (!this.ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    this.ctx.clearRect(0, 0, w, h);

    // 1. Draw Simulated Aerial Orthomosaic Base & Coordinate Grid
    this.drawBackgroundGrid(w, h);

    // 2. Draw Road & Neighbor Parcels in background
    this.drawSurroundings();

    // 3. Draw Building Footprint inside parcel
    if (this.showBuildingLayer) {
      this.drawPolygon(this.buildingVertices, "rgba(239, 68, 68, 0.25)", "#ef4444", 2, false);
      // Tag
      this.ctx.fillStyle = "#ef4444";
      this.ctx.font = "bold 11px monospace";
      this.ctx.fillText("🏠 DETECTED NEW STRUCTURE (G+3)", 240, 200);
    }

    // 4. Draw AI Suggested Boundary (Dashed Cyan)
    if (this.showAiReference) {
      this.drawPolygon(this.aiVertices, "rgba(0, 242, 254, 0.08)", "#00f2fe", 2, true);
    }

    // 5. Draw Surveyor Corrected Boundary (Solid Emerald)
    if (this.showSurveyorLayer) {
      this.drawPolygon(this.surveyorVertices, "rgba(16, 185, 129, 0.22)", "#10b981", 3, false);

      // Draw Draggable Vertex Handles
      this.surveyorVertices.forEach((v, index) => {
        const isHovered = index === this.hoveredIndex;
        const isDragging = index === this.draggingIndex;

        this.ctx.beginPath();
        this.ctx.arc(v.x, v.y, isHovered || isDragging ? 9 : 6, 0, Math.PI * 2);
        this.ctx.fillStyle = isDragging ? "#00f2fe" : isHovered ? "#38bdf8" : "#10b981";
        this.ctx.fill();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "#ffffff";
        this.ctx.stroke();

        // Vertex index label
        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "10px monospace";
        this.ctx.fillText(`V${index + 1}`, v.x + 10, v.y - 8);
      });
    }

    // 6. Draw Split Line if in split mode
    if (this.splitPoints.length > 0) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.splitPoints[0].x, this.splitPoints[0].y);
      if (this.splitPoints.length === 2) {
        this.ctx.lineTo(this.splitPoints[1].x, this.splitPoints[1].y);
      }
      this.ctx.strokeStyle = "#f59e0b";
      this.ctx.lineWidth = 3;
      this.ctx.setLineDash([6, 4]);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }

    // 7. Scale bar and North arrow HUD
    this.drawScaleBar(w, h);
  },

  drawPolygon(vertices, fillColor, strokeColor, lineWidth, isDashed) {
    if (!vertices || vertices.length < 3) return;

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let i = 1; i < vertices.length; i++) {
      this.ctx.lineTo(vertices[i].x, vertices[i].y);
    }
    this.ctx.closePath();

    this.ctx.fillStyle = fillColor;
    this.ctx.fill();

    if (isDashed) this.ctx.setLineDash([8, 5]);
    else this.ctx.setLineDash([]);

    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = lineWidth;
    this.ctx.stroke();
    this.ctx.restore();
  },

  drawBackgroundGrid(w, h) {
    // Grid Lines
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    this.ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(w, y);
      this.ctx.stroke();
    }

    // Top watermark
    this.ctx.fillStyle = "rgba(0, 242, 254, 0.4)";
    this.ctx.font = "11px monospace";
    this.ctx.fillText("HIGH-RES DRONE ORTHORECTIFIED IMAGERY (ORI) · GSD 2.4 CM/PX · EPSG:3857", 16, 24);
  },

  drawSurroundings() {
    // Road on South edge
    this.ctx.fillStyle = "rgba(30, 41, 59, 0.7)";
    this.ctx.fillRect(0, 440, this.canvas.width, 60);

    this.ctx.fillStyle = "#64748b";
    this.ctx.font = "bold 11px sans-serif";
    this.ctx.fillText("ACCESS ROAD RESERVE (12M WIDE)", 220, 475);
  },

  drawScaleBar(w, h) {
    // Scale bar at bottom-left
    this.ctx.strokeStyle = "#ffffff";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(20, h - 25);
    this.ctx.lineTo(120, h - 25);
    this.ctx.moveTo(20, h - 30);
    this.ctx.lineTo(20, h - 20);
    this.ctx.moveTo(120, h - 30);
    this.ctx.lineTo(120, h - 20);
    this.ctx.stroke();

    this.ctx.fillStyle = "#94a3b8";
    this.ctx.font = "10px monospace";
    this.ctx.fillText("10 METERS", 48, h - 12);

    // North Indicator at top-right
    this.ctx.fillStyle = "#00f2fe";
    this.ctx.font = "bold 12px monospace";
    this.ctx.fillText("▲ NORTH", w - 70, 30);
  }
};

window.TerraBoundaryEditor = TerraBoundaryEditor;
