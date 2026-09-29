# TerraVision AI — Urban Land Intelligence Platform
### Automated Urban Parcel Mapping & Cadastral Feature Extraction using Drone Imagery
**“From Drone Pixels to Intelligent Urban Land Records.”**  
*Powered by AI · Computer Vision · GeoAI · GIS · Drone Intelligence*

---

## 🌟 Executive Overview
**TerraVision AI** is an advanced Government-Tech / GeoAI platform prototype designed for automated urban cadastral mapping, parcel extraction, and change intelligence from drone imagery.

It bridges the chasm between raw high-resolution UAV aerial photogrammetry and legally defensible municipal cadastral records through a streamlined 12-stage human-in-the-loop pipeline:

$$\text{Drone Imagery (2.4cm GSD)} + \text{Deep GeoAI/CV} + \text{Automated Topology} + \text{Surveyor Copilot} = \mathbf{10\times\text{ Faster Cadastral Mapping}}$$

---

## 🚀 Key Modules & Capabilities

### 1. 🏛️ Authority Command Center
- **Top Metrics**: 12,450 Parcels Mapped, 18,230 Buildings Detected, 320 Verification Required, 150 Changes Detected, 94.2% Avg. AI Confidence.
- **Web-GIS Command Map**: Interactive Leaflet engine with custom dark tiles, layered cadastral parcels, building footprints, road reserve networks, and click-to-inspect parcel drawer.
- **Drone Survey Manager**: Flight mission telemetry, 2.4cm GSD orthomosaics, photogrammetry metadata (EPSG:3857), and 5-stage progress pipeline.
- **AI Feature Extraction**: Real-time animated radar scanner identifying building footprints, parcel boundaries, roads, and land-use masks at 94% progress.
- **Change Intelligence**: Interactive Before/After split slider comparing historical 2025 cadastre vs. 2026 drone survey with Parcel P-102 case study (Vacant $\to$ G+3 Construction detected at 96% confidence).
- **Topology Validation**: Automated checks for polygon overlaps, sliver gaps, self-intersections, and boundary consistency with direct "Send to Surveyor" dispatch.
- **Ground Truth Verification**: Live CORS RTK GNSS stream integration (sub-5cm RMSE calibration), field evidence photographs, and GCP benchmark locking.
- **Urban Land-Use Intelligence**: Multi-class classification (Residential 54.2%, Commercial 21.8%, Industrial 8.4%, Open Land 11.2%, Transport 3.1%, Construction 1.3%).
- **3D Urban Digital Twin**: Procedural WebGL (Three.js) extruded city block with DSM height profiling (e.g. 14.2m height on Building 102), raycasting building inspection, and 2D/3D toggle.
- **Analytics & Reports**: Chart.js metrics and official municipal cadastral audit certificate generator with PDF/GeoJSON export.

### 2. 👨‍💻 AI Surveyor Copilot
- **Review Queue**: Flags low-confidence parcels ($<75\%$) and obscured boundaries (Parcel P-102: 72% confidence, overlapping structure).
- **Interactive GIS Boundary Editor**: Canvas-based polygon editor allowing surveyors to drag boundary vertices, insert points, remove vertices, split parcels, merge parcels, undo/redo, and compare **AI Suggested Boundary** vs **Surveyor Corrected Boundary** before signing off.

### 3. 👥 Citizen Transparency Portal
- Public cadastral basemap exploration without exposing sensitive private titleholder data.
- Crowdsourced **Report a Mapping Issue** form with photo evidence upload, location tagging, and municipal reference tracking.

### 4. 🎬 9-Step Guided Platform Demo Tour
- A dedicated navbar presentation mode built for a comprehensive 3–5 minute walkthrough, automatically navigating through:
  1. Drone Survey Capture & Orthorectification
  2. Deep Learning AI Feature Segmentation
  3. Cadastral Boundary Extraction
  4. Interactive 2D GIS Command Map
  5. 3D Urban Digital Twin & Height Modeling
  6. Urban Change Intelligence (2025 vs 2026)
  7. Automated Topology Validation
  8. AI Surveyor Copilot & Boundary Editing
  9. Final GIS-Ready Output & Cadastral Reports

---

## 🔑 Demo Role Credentials
- **🏛️ Authority Demo**: `authority@terravision.ai` / `Authority@123`
- **👨‍💻 Surveyor Demo**: `surveyor@terravision.ai` / `Surveyor@123`
- **👥 Citizen Demo**: `citizen@terravision.ai` / `Citizen@123`
*(Available with 1-click autofill buttons on the login screen).*

---

## 💻 Running the Prototype Locally

### Option 1: Direct Browser Launch (Zero Installation)
Simply double-click or open `index.html` in any modern web browser:
```
file:///C:/Users/My%20Pc/.gemini/antigravity/scratch/terravision-ai/index.html
```

### Option 2: PowerShell Local Server
Run the included PowerShell server script:
```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\My Pc\.gemini\antigravity\scratch\terravision-ai\server.ps1"
```
Then navigate to: `http://localhost:8080/`

---

## 🛡️ Technical Realism & Compliance Notice
TerraVision AI adheres to government cadastral integrity principles:
- **Preliminary Parcel Map**: Automated AI derivations are categorized as preliminary decision support.
- **Human-in-the-Loop**: All final cadastral boundary modifications and title records require licensed surveyor endorsement and ground truth validation.
