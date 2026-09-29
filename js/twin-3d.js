/**
 * TerraVision AI - 3D Urban Digital Twin (Three.js WebGL Engine)
 * 3D Extrusion, DSM Height Modeling & Digital Twin Inspection
 */

const TerraTwin3D = {
  scene: null,
  camera: null,
  renderer: null,
  buildingsGroup: null,
  parcelsGroup: null,
  roadsGroup: null,
  terrainMesh: null,
  interactiveMeshes: [],
  selectedMesh: null,
  hoveredMesh: null,
  isOrbiting: true,
  animationId: null,
  container: null,

  init(containerId = "twin-three-canvas-container") {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    // Clear previous if reloaded
    if (this.renderer) {
      if (this.animationId) cancelAnimationFrame(this.animationId);
      this.container.innerHTML = "";
    }

    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 540;

    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060911);
    this.scene.fog = new THREE.FogExp2(0x060911, 0.008);

    // 2. Camera setup
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    this.camera.position.set(70, 65, 85);
    this.camera.lookAt(0, 0, 0);

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.4);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
    dirLight.position.set(50, 100, 50);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    this.scene.add(dirLight);

    const cyanPointLight = new THREE.PointLight(0x00f2fe, 1.2, 120);
    cyanPointLight.position.set(0, 30, 0);
    this.scene.add(cyanPointLight);

    // Groups
    this.buildingsGroup = new THREE.Group();
    this.parcelsGroup = new THREE.Group();
    this.roadsGroup = new THREE.Group();
    this.scene.add(this.buildingsGroup);
    this.scene.add(this.parcelsGroup);
    this.scene.add(this.roadsGroup);

    // 5. Build Environment
    this.buildTerrain();
    this.buildRoads();
    this.buildParcels();
    this.buildBuildings();

    // 6. Interaction
    this.setupInteractivity();

    // 7. Render Loop
    this.animate();

    // Handle Window Resize
    window.addEventListener('resize', () => this.onWindowResize());
  },

  buildTerrain() {
    // Ground plane with digital grid
    const size = 180;
    const divisions = 36;
    const gridHelper = new THREE.GridHelper(size, divisions, 0x00f2fe, 0x1e293b);
    gridHelper.position.y = 0.05;
    this.scene.add(gridHelper);

    const planeGeo = new THREE.PlaneGeometry(size, size);
    const planeMat = new THREE.MeshStandardMaterial({
      color: 0x080d1a,
      roughness: 0.9,
      metalness: 0.1
    });
    this.terrainMesh = new THREE.Mesh(planeGeo, planeMat);
    this.terrainMesh.rotation.x = -Math.PI / 2;
    this.terrainMesh.receiveShadow = true;
    this.scene.add(this.terrainMesh);
  },

  buildRoads() {
    this.roadsGroup.clear();
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 });
    const spineRoadGeo = new THREE.PlaneGeometry(16, 180);
    const spineRoad = new THREE.Mesh(spineRoadGeo, roadMat);
    spineRoad.rotation.x = -Math.PI / 2;
    spineRoad.position.set(0, 0.1, 0);
    this.roadsGroup.add(spineRoad);

    const crossRoadGeo = new THREE.PlaneGeometry(180, 12);
    const crossRoad = new THREE.Mesh(crossRoadGeo, roadMat);
    crossRoad.rotation.x = -Math.PI / 2;
    crossRoad.position.set(0, 0.11, 0);
    this.roadsGroup.add(crossRoad);

    // Glowing lane lines
    const lineMat = new THREE.LineBasicMaterial({ color: 0x00f2fe });
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.15, -90),
      new THREE.Vector3(0, 0.15, 90)
    ]);
    const roadLine = new THREE.Line(lineGeo, lineMat);
    this.roadsGroup.add(roadLine);
  },

  buildParcels() {
    this.parcelsGroup.clear();

    const parcelDefs = [
      { id: "P-102", x: -25, z: -25, w: 24, d: 22, color: 0xf59e0b },
      { id: "P-103", x: 25, z: -25, w: 26, d: 24, color: 0x10b981 },
      { id: "P-104", x: -25, z: 25, w: 22, d: 20, color: 0x10b981 },
      { id: "P-106", x: 25, z: 25, w: 28, d: 26, color: 0x3b82f6 },
      { id: "P-107", x: -55, z: -25, w: 20, d: 22, color: 0x00f2fe },
      { id: "P-108", x: 55, z: -25, w: 24, d: 24, color: 0x10b981 }
    ];

    parcelDefs.forEach(p => {
      // Cadastral boundary wire
      const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(p.w, 0.2, p.d));
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: p.color, linewidth: 2 }));
      line.position.set(p.x, 0.2, p.z);
      this.parcelsGroup.add(line);
    });
  },

  buildBuildings() {
    this.buildingsGroup.clear();
    this.interactiveMeshes = [];

    const buildingData = [
      {
        bldgId: "BLDG-102",
        parcelId: "P-102",
        x: -25,
        z: -25,
        w: 14,
        d: 12,
        height: 14.2, // DSM calculated
        footprint: 264.8,
        isNewConstruction: true,
        aiConfidence: 96.4,
        color: 0xef4444, // Red highlight for new construction
        label: "Under Construction (G+3)"
      },
      {
        bldgId: "BLDG-103",
        parcelId: "P-103",
        x: 25,
        z: -25,
        w: 16,
        d: 14,
        height: 22.5,
        footprint: 380.0,
        isNewConstruction: false,
        aiConfidence: 97.2,
        color: 0x00f2fe,
        label: "Commercial Metro Tower"
      },
      {
        bldgId: "BLDG-104",
        parcelId: "P-104",
        x: -25,
        z: 25,
        w: 12,
        d: 10,
        height: 9.8,
        footprint: 180.4,
        isNewConstruction: false,
        aiConfidence: 94.5,
        color: 0x38bdf8,
        label: "Residential Annex"
      },
      {
        bldgId: "BLDG-106",
        parcelId: "P-106",
        x: 25,
        z: 25,
        w: 18,
        d: 16,
        height: 11.2,
        footprint: 450.0,
        isNewConstruction: false,
        aiConfidence: 98.0,
        color: 0x64748b,
        label: "Industrial Logistics Center"
      },
      {
        bldgId: "BLDG-108",
        parcelId: "P-108",
        x: 55,
        z: -25,
        w: 15,
        d: 14,
        height: 18.0,
        footprint: 320.0,
        isNewConstruction: false,
        aiConfidence: 98.8,
        color: 0x10b981,
        label: "Municipal Civic Center"
      }
    ];

    // Background procedural city blocks for rich depth
    for (let i = -70; i <= 70; i += 30) {
      for (let j = -70; j <= 70; j += 30) {
        if (Math.abs(i) < 15 || Math.abs(j) < 15) continue; // Skip roads
        if (buildingData.some(b => Math.abs(b.x - i) < 10 && Math.abs(b.z - j) < 10)) continue;

        const h = 6 + Math.random() * 16;
        buildingData.push({
          bldgId: `BLDG-GEN-${Math.abs(i)}${Math.abs(j)}`,
          parcelId: `P-SURROUND`,
          x: i,
          z: j,
          w: 8 + Math.random() * 6,
          d: 8 + Math.random() * 6,
          height: h,
          footprint: 150 + Math.random() * 120,
          isNewConstruction: false,
          aiConfidence: 95.0,
          color: 0x1e293b,
          label: "Urban Structure"
        });
      }
    }

    buildingData.forEach(data => {
      const geo = new THREE.BoxGeometry(data.w, data.height, data.d);
      const mat = new THREE.MeshStandardMaterial({
        color: data.color,
        roughness: 0.3,
        metalness: 0.6,
        transparent: true,
        opacity: data.isNewConstruction ? 0.95 : 0.85
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(data.x, data.height / 2, data.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Glow Edges
      const edges = new THREE.EdgesGeometry(geo);
      const edgeColor = data.isNewConstruction ? 0xff4444 : 0x00f2fe;
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: edgeColor, linewidth: 1.5 }));
      mesh.add(line);

      // Attach metadata for inspection
      mesh.userData = data;
      this.interactiveMeshes.push(mesh);
      this.buildingsGroup.add(mesh);
    });
  },

  setupInteractivity() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (event) => {
      const rect = this.container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, this.camera);
      const intersects = raycaster.intersectObjects(this.interactiveMeshes);

      if (intersects.length > 0) {
        this.container.style.cursor = 'pointer';
        const hit = intersects[0].object;
        if (this.hoveredMesh !== hit) {
          if (this.hoveredMesh && this.hoveredMesh !== this.selectedMesh) {
            this.hoveredMesh.material.emissive.setHex(0x000000);
          }
          this.hoveredMesh = hit;
          this.hoveredMesh.material.emissive.setHex(0x003355);
        }
      } else {
        this.container.style.cursor = 'default';
        if (this.hoveredMesh && this.hoveredMesh !== this.selectedMesh) {
          this.hoveredMesh.material.emissive.setHex(0x000000);
          this.hoveredMesh = null;
        }
      }
    };

    const onClick = (event) => {
      const rect = this.container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, this.camera);
      const intersects = raycaster.intersectObjects(this.interactiveMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        this.selectBuilding(hit);
      }
    };

    this.container.addEventListener('mousemove', onPointerMove);
    this.container.addEventListener('click', onClick);
  },

  selectBuilding(mesh) {
    if (this.selectedMesh) {
      this.selectedMesh.material.emissive.setHex(0x000000);
    }
    this.selectedMesh = mesh;
    this.selectedMesh.material.emissive.setHex(0x005577);

    const data = mesh.userData;
    const tooltip = document.getElementById("twin-building-tooltip");
    if (!tooltip) return;

    document.getElementById("twin-bldg-id").innerText = data.bldgId;
    document.getElementById("twin-parcel-id").innerText = data.parcelId;
    document.getElementById("twin-height").innerText = `${data.height.toFixed(1)} m (DSM Derived)`;
    document.getElementById("twin-footprint").innerText = `${data.footprint.toFixed(1)} m²`;
    document.getElementById("twin-change").innerText = data.isNewConstruction ? "🔴 NEW CONSTRUCTION" : "🟢 Unchanged Cadastral Footprint";
    
    const confEl = document.getElementById("twin-confidence");
    confEl.innerText = `${data.aiConfidence}%`;
    confEl.style.color = data.aiConfidence >= 90 ? "var(--status-success)" : "var(--status-warning)";

    tooltip.style.display = "block";

    if (window.showToast) {
      window.showToast(`Selected ${data.bldgId} in 3D Digital Twin (Height: ${data.height.toFixed(1)}m)`, 'info');
    }
  },

  closeTooltip() {
    const tooltip = document.getElementById("twin-building-tooltip");
    if (tooltip) tooltip.style.display = "none";
    if (this.selectedMesh) {
      this.selectedMesh.material.emissive.setHex(0x000000);
      this.selectedMesh = null;
    }
  },

  toggleOrbit(forceState = null) {
    this.isOrbiting = forceState !== null ? forceState : !this.isOrbiting;
    const btn = document.getElementById("twin-orbit-btn");
    if (btn) btn.innerText = this.isOrbiting ? "⏸ Pause Rotation" : "▶ Auto Rotate";
  },

  setCameraView(viewMode) {
    if (viewMode === '2D') {
      // Top-down Orthographic-like view
      this.isOrbiting = false;
      this.camera.position.set(0, 110, 0.1);
      this.camera.lookAt(0, 0, 0);
    } else if (viewMode === '3D') {
      // Perspective isometric angle
      this.camera.position.set(70, 65, 85);
      this.camera.lookAt(0, 0, 0);
      this.isOrbiting = true;
    }
    const btn2d = document.getElementById("twin-view-2d-btn");
    const btn3d = document.getElementById("twin-view-3d-btn");
    if (btn2d && btn3d) {
      if (viewMode === '2D') {
        btn2d.classList.add("btn-primary");
        btn2d.classList.remove("btn-secondary");
        btn3d.classList.add("btn-secondary");
        btn3d.classList.remove("btn-primary");
      } else {
        btn3d.classList.add("btn-primary");
        btn3d.classList.remove("btn-secondary");
        btn2d.classList.add("btn-secondary");
        btn2d.classList.remove("btn-primary");
      }
    }
  },

  toggleLayer(layer, isVisible) {
    if (layer === 'buildings') this.buildingsGroup.visible = isVisible;
    if (layer === 'parcels') this.parcelsGroup.visible = isVisible;
    if (layer === 'roads') this.roadsGroup.visible = isVisible;
    if (layer === 'terrain') this.terrainMesh.visible = isVisible;
  },

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    if (this.isOrbiting && this.camera) {
      const timer = Date.now() * 0.0003;
      const radius = 100;
      this.camera.position.x = Math.cos(timer) * radius;
      this.camera.position.z = Math.sin(timer) * radius;
      this.camera.lookAt(0, 5, 0);
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  },

  onWindowResize() {
    if (!this.container || !this.camera || !this.renderer) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
};

window.TerraTwin3D = TerraTwin3D;
