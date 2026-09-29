/**
 * TerraVision AI - Web-GIS Leaflet Engine
 * Cadastral Feature Mapping & Dynamic Vector Layering
 */

const TerraMapEngine = {
  map: null,
  layers: {
    parcels: null,
    buildings: null,
    roads: null,
    changes: null,
    verification: null,
    baseDark: null,
    baseSatellite: null
  },
  activeLayerConfig: {
    parcels: true,
    buildings: true,
    roads: true,
    landuse: false,
    changes: true,
    verification: true,
    satellite: false
  },
  currentSelectedParcelId: null,

  init(containerId = "gis-leaflet-map") {
    const container = document.getElementById(containerId);
    if (!container || this.map) return;

    // Centered around Zone 04 Metro Cadastral Sector
    this.map = L.map(containerId, {
      center: [12.9720, 77.5956],
      zoom: 17,
      zoomControl: false,
      attributionControl: false
    });

    // Custom Zoom Control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // Dark Matter Tiles (Default)
    this.layers.baseDark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      subdomains: 'abcd'
    }).addTo(this.map);

    // High-Res Satellite Layer (Toggleable)
    this.layers.baseSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    });

    // Layer Groups
    this.layers.parcels = L.layerGroup().addTo(this.map);
    this.layers.buildings = L.layerGroup().addTo(this.map);
    this.layers.roads = L.layerGroup().addTo(this.map);
    this.layers.changes = L.layerGroup().addTo(this.map);

    this.renderRoads();
    this.renderParcels();
    this.setupEventListeners();
  },

  renderRoads() {
    this.layers.roads.clearLayers();
    // Realistic urban road network
    const roadNetwork = [
      {
        name: "North Cadastral Arterial (60m Reserve)",
        coords: [[12.9742, 77.5935], [12.9740, 77.5985]],
        width: 14,
        color: "#475569"
      },
      {
        name: "Metro Access Spine (40m)",
        coords: [[12.9695, 77.5955], [12.9745, 77.5958]],
        width: 10,
        color: "#334155"
      },
      {
        name: "Zone 04 Sector Crossway",
        coords: [[12.9715, 77.5938], [12.9714, 77.5982]],
        width: 8,
        color: "#1e293b"
      }
    ];

    roadNetwork.forEach(road => {
      const polyline = L.polyline(road.coords, {
        color: "#38bdf8",
        weight: road.width,
        opacity: 0.6,
        lineCap: 'round',
        lineJoin: 'round'
      });
      polyline.bindTooltip(`🛣️ ${road.name}`, { sticky: true, className: 'map-tooltip' });
      this.layers.roads.addLayer(polyline);
    });
  },

  renderParcels() {
    this.layers.parcels.clearLayers();
    this.layers.buildings.clearLayers();
    this.layers.changes.clearLayers();

    if (!window.TERRA_DATA || !window.TERRA_DATA.parcels) return;

    window.TERRA_DATA.parcels.forEach(parcel => {
      // Color coding logic
      let strokeColor = "#00f2fe";
      let fillColor = "rgba(0, 242, 254, 0.15)";

      if (this.activeLayerConfig.verification) {
        if (parcel.status === "Verified") {
          strokeColor = "#10b981";
          fillColor = "rgba(16, 185, 129, 0.18)";
        } else if (parcel.status === "Needs Verification") {
          strokeColor = "#f59e0b";
          fillColor = "rgba(245, 158, 11, 0.22)";
        } else {
          strokeColor = "#00f2fe";
          fillColor = "rgba(0, 242, 254, 0.18)";
        }
      }

      if (this.activeLayerConfig.landuse) {
        if (parcel.landUse.includes("Residential")) fillColor = "rgba(59, 130, 246, 0.25)";
        else if (parcel.landUse.includes("Commercial")) fillColor = "rgba(0, 242, 254, 0.25)";
        else if (parcel.landUse.includes("Industrial")) fillColor = "rgba(245, 158, 11, 0.25)";
        else if (parcel.landUse.includes("Open")) fillColor = "rgba(16, 185, 129, 0.25)";
      }

      // Parcel Polygon
      const parcelPoly = L.polygon(parcel.coordinates, {
        color: strokeColor,
        weight: 2,
        dashArray: parcel.status === "Needs Verification" ? '4, 4' : null,
        fillColor: fillColor,
        fillOpacity: 0.6
      });

      // Hover Tooltip
      parcelPoly.bindTooltip(`
        <div style="font-family: var(--font-sans); font-size: 0.8rem; padding: 4px;">
          <strong style="color: #00f2fe;">Parcel ${parcel.id}</strong><br/>
          <span>Area: ${parcel.areaSqM} m²</span><br/>
          <span>AI Conf: <strong style="color:${parcel.confidence > 90 ? '#10b981' : '#f59e0b'}">${parcel.confidence}%</strong></span><br/>
          <span>Status: <em>${parcel.status}</em></span>
        </div>
      `, { sticky: true, opacity: 0.95 });

      // Click event
      parcelPoly.on('click', () => {
        this.selectParcel(parcel.id);
      });

      this.layers.parcels.addLayer(parcelPoly);

      // Building Footprint Polygon inside Parcel
      if (parcel.buildingFootprint && this.activeLayerConfig.buildings) {
        const isNew = parcel.changeStatus.includes("New Construction");
        const bldgPoly = L.polygon(parcel.buildingFootprint, {
          color: isNew ? "#ef4444" : "#ffffff",
          weight: 2,
          fillColor: isNew ? "rgba(239, 68, 68, 0.45)" : "rgba(255, 255, 255, 0.25)",
          fillOpacity: 0.8
        });

        bldgPoly.bindTooltip(`🏠 Building Footprint (${parcel.id}) - Height: ${parcel.heightEst}m`, { sticky: true });
        bldgPoly.on('click', () => {
          this.selectParcel(parcel.id);
        });
        this.layers.buildings.addLayer(bldgPoly);
      }

      // Change Detection Highlight Marker
      if (parcel.changeStatus !== "No Change" && this.activeLayerConfig.changes) {
        const center = parcelPoly.getBounds().getCenter();
        const changeMarker = L.circleMarker(center, {
          radius: 9,
          fillColor: parcel.changeStatus.includes("New") ? "#ef4444" : "#f59e0b",
          color: "#fff",
          weight: 2,
          fillOpacity: 0.9
        });

        changeMarker.bindTooltip(`🔄 ${parcel.changeStatus}`, { sticky: true });
        changeMarker.on('click', () => {
          this.selectParcel(parcel.id);
        });
        this.layers.changes.addLayer(changeMarker);
      }
    });
  },

  selectParcel(parcelId) {
    this.currentSelectedParcelId = parcelId;
    const parcel = window.TERRA_DATA.parcels.find(p => p.id === parcelId);
    if (!parcel) return;

    // Pan map to parcel center
    const bounds = L.polygon(parcel.coordinates).getBounds();
    this.map.panTo(bounds.getCenter(), { animate: true, duration: 0.8 });

    // Populate and show Parcel Inspector HUD
    const drawer = document.getElementById("gis-parcel-inspector");
    if (!drawer) return;

    document.getElementById("insp-parcel-id").innerText = parcel.id;
    document.getElementById("insp-zone").innerText = parcel.surveyZone;
    document.getElementById("insp-area").innerText = `${parcel.areaSqM} m² (${(parcel.areaSqM * 10.764).toFixed(1)} sq ft)`;
    document.getElementById("insp-landuse").innerText = parcel.landUse;
    
    const confEl = document.getElementById("insp-confidence");
    confEl.innerText = `${parcel.confidence}%`;
    confEl.style.color = parcel.confidence >= 90 ? "var(--status-success)" : "var(--status-warning)";

    document.getElementById("insp-status").innerText = parcel.status;
    document.getElementById("insp-change").innerText = parcel.changeStatus;
    document.getElementById("insp-topology").innerText = parcel.topologyStatus;
    document.getElementById("insp-features").innerText = parcel.featuresDetected.join(", ");
    document.getElementById("insp-notes").innerText = parcel.issueDescription || "No issues identified.";

    drawer.style.display = "block";
  },

  closeInspector() {
    const drawer = document.getElementById("gis-parcel-inspector");
    if (drawer) drawer.style.display = "none";
  },

  searchParcel(query) {
    if (!query) return;
    const q = query.trim().toUpperCase();
    const match = window.TERRA_DATA.parcels.find(p => 
      p.id.toUpperCase() === q || 
      p.landUse.toUpperCase().includes(q) ||
      p.status.toUpperCase().includes(q)
    );

    if (match) {
      this.selectParcel(match.id);
      if (window.showToast) window.showToast(`Found Parcel ${match.id} (${match.landUse})`, 'info');
    } else {
      if (window.showToast) window.showToast(`No parcel matching "${query}" found. Try P-102, P-103.`, 'warning');
    }
  },

  toggleLayer(layerName, isVisible) {
    this.activeLayerConfig[layerName] = isVisible;

    if (layerName === 'satellite') {
      if (isVisible) {
        this.map.removeLayer(this.layers.baseDark);
        this.layers.baseSatellite.addTo(this.map);
      } else {
        this.map.removeLayer(this.layers.baseSatellite);
        this.layers.baseDark.addTo(this.map);
      }
      return;
    }

    if (layerName === 'parcels') {
      if (isVisible) this.map.addLayer(this.layers.parcels);
      else this.map.removeLayer(this.layers.parcels);
    }
    if (layerName === 'buildings') {
      if (isVisible) this.map.addLayer(this.layers.buildings);
      else this.map.removeLayer(this.layers.buildings);
    }
    if (layerName === 'roads') {
      if (isVisible) this.map.addLayer(this.layers.roads);
      else this.map.removeLayer(this.layers.roads);
    }
    if (layerName === 'changes') {
      if (isVisible) this.map.addLayer(this.layers.changes);
      else this.map.removeLayer(this.layers.changes);
    }

    this.renderParcels();
  },

  setupEventListeners() {
    // Search input
    const searchInput = document.getElementById("map-search-input");
    if (searchInput) {
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.searchParcel(searchInput.value);
        }
      });
    }
  }
};

window.TerraMapEngine = TerraMapEngine;
