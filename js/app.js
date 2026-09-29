/**
 * TerraVision AI - Core Application State & Controller
 * AI-Based Automated Urban Parcel Mapping & Cadastral Feature Extraction
 */

const AppState = {
  currentView: "landing-view", // 'landing-view', 'auth-view', 'role-select-view', 'app-view'
  currentRole: "authority",    // 'authority', 'surveyor', 'citizen'
  currentTab: "tab-gis-map",
  isNotificationOpen: false,
  isLoggedIn: false
};

// Toast notification helper
function showToast(message, type = 'info') {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  const iconMap = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };

  toast.innerHTML = `
    <span style="font-size:1.1rem;">${iconMap[type] || '🔔'}</span>
    <span style="flex-grow:1;">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
window.showToast = showToast;

// View Switching
function switchView(viewId) {
  AppState.currentView = viewId;
  const sections = document.querySelectorAll(".view-section");
  sections.forEach(sec => sec.classList.remove("active"));

  const target = document.getElementById(viewId);
  if (target) {
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Header adjustments
  const roleIndicator = document.getElementById("header-role-indicator");
  const navLinks = document.getElementById("header-nav-links");
  const authBtn = document.getElementById("header-auth-btn");

  if (viewId === "app-view") {
    if (roleIndicator) roleIndicator.style.display = "flex";
    if (navLinks) navLinks.style.display = "none";
    if (authBtn) {
      authBtn.innerText = "Sign Out";
      authBtn.onclick = () => signOut();
    }
  } else {
    if (roleIndicator) roleIndicator.style.display = "none";
    if (navLinks) navLinks.style.display = "flex";
    if (authBtn) {
      authBtn.innerText = AppState.isLoggedIn ? "Workspace" : "Sign In";
      authBtn.onclick = () => AppState.isLoggedIn ? switchView("app-view") : switchView("auth-view");
    }
  }

  // Re-trigger maps/3D if needed
  if (viewId === "app-view") {
    setTimeout(() => {
      if (AppState.currentTab === "tab-gis-map" && window.TerraMapEngine && window.TerraMapEngine.map) {
        window.TerraMapEngine.map.invalidateSize();
      }
    }, 200);
  }
}
window.switchView = switchView;

// Workspace Role Selection
function selectRole(role) {
  AppState.currentRole = role;
  AppState.isLoggedIn = true;

  // Update badge in navbar
  const rolePill = document.getElementById("header-role-text");
  const roleBadge = document.getElementById("header-role-badge");

  const roleMeta = {
    authority: { name: "AUTHORITY COMMAND", badge: "🏛️ Municipal Gov", defaultTab: "tab-gis-map" },
    surveyor: { name: "AI SURVEYOR COPILOT", badge: "👨‍💻 Cadastral Field", defaultTab: "tab-surveyor-copilot" },
    citizen: { name: "CITIZEN PORTAL", badge: "👥 Public Cadastre", defaultTab: "tab-citizen-portal" }
  };

  const current = roleMeta[role] || roleMeta.authority;
  if (rolePill) rolePill.innerText = current.name;
  if (roleBadge) roleBadge.innerText = current.badge;

  // Configure Sidebar for specific role
  configureSidebarForRole(role);

  // Switch to App View & default tab
  switchView("app-view");
  switchWorkspaceTab(current.defaultTab);

  showToast(`Logged into ${current.name} Workspace`, 'success');
}
window.selectRole = selectRole;

function configureSidebarForRole(role) {
  const allNavItems = document.querySelectorAll(".sidebar-nav-item");
  allNavItems.forEach(item => {
    const rolesAllowed = item.getAttribute("data-roles");
    if (!rolesAllowed || rolesAllowed.includes(role)) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });

  // Adjust top stats banner visibility
  const commandBanner = document.getElementById("command-center-header");
  if (commandBanner) {
    commandBanner.style.display = (role === "authority" || role === "surveyor") ? "flex" : "none";
  }
}

// Workspace Tab Switching
function switchWorkspaceTab(tabId) {
  AppState.currentTab = tabId;

  // Update sidebar active classes
  const navItems = document.querySelectorAll(".sidebar-nav-item");
  navItems.forEach(item => {
    if (item.getAttribute("data-tab") === tabId) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Update Tab Content Panels
  const tabs = document.querySelectorAll(".tab-content-panel");
  tabs.forEach(t => t.classList.remove("active"));

  const targetTab = document.getElementById(tabId);
  if (targetTab) {
    targetTab.classList.add("active");
  }

  // Tab-specific lazy initializations
  if (tabId === "tab-gis-map") {
    setTimeout(() => {
      if (!window.TerraMapEngine.map) {
        window.TerraMapEngine.init();
      } else {
        window.TerraMapEngine.map.invalidateSize();
      }
    }, 150);
  } else if (tabId === "tab-digital-twin") {
    setTimeout(() => {
      if (!window.TerraTwin3D.renderer) {
        window.TerraTwin3D.init();
      }
    }, 150);
  } else if (tabId === "tab-change-detection") {
    setTimeout(() => {
      window.TerraChangeSlider.init();
    }, 150);
  } else if (tabId === "tab-surveyor-copilot") {
    setTimeout(() => {
      window.TerraBoundaryEditor.init();
      window.TerraBoundaryEditor.renderQueue();
    }, 150);
  } else if (tabId === "tab-analytics") {
    setTimeout(() => {
      window.TerraAnalytics.init();
    }, 150);
  }
}
window.switchWorkspaceTab = switchWorkspaceTab;

// Quick Demo Login Fillers
function fillDemoCreds(role) {
  const creds = {
    authority: { email: "authority@terravision.ai", pass: "Authority@123" },
    surveyor: { email: "surveyor@terravision.ai", pass: "Surveyor@123" },
    citizen: { email: "citizen@terravision.ai", pass: "Citizen@123" }
  };

  const emailInput = document.getElementById("auth-email");
  const passInput = document.getElementById("auth-pass");

  if (creds[role]) {
    if (emailInput) emailInput.value = creds[role].email;
    if (passInput) passInput.value = creds[role].pass;
    showToast(`Autofilled ${role.toUpperCase()} credentials. Click Sign In or use Demo Bypass.`, 'info');
  }
}
window.fillDemoCreds = fillDemoCreds;

function handleSignIn(e) {
  if (e) e.preventDefault();
  const emailInput = document.getElementById("auth-email");
  const email = emailInput ? emailInput.value.toLowerCase() : "";

  let role = "authority";
  if (email.includes("surveyor")) role = "surveyor";
  else if (email.includes("citizen")) role = "citizen";

  selectRole(role);
}
window.handleSignIn = handleSignIn;

function signOut() {
  AppState.isLoggedIn = false;
  showToast("Signed out of workspace.", "info");
  switchView("landing-view");
}
window.signOut = signOut;

// Notification Drawer Controls
function toggleNotifications() {
  AppState.isNotificationOpen = !AppState.isNotificationOpen;
  const drawer = document.getElementById("notification-drawer");
  if (drawer) {
    if (AppState.isNotificationOpen) drawer.classList.add("open");
    else drawer.classList.remove("open");
  }
}
window.toggleNotifications = toggleNotifications;

function renderNotifications() {
  const list = document.getElementById("notification-items-list");
  if (!list || !window.TERRA_DATA) return;

  list.innerHTML = "";
  window.TERRA_DATA.notifications.forEach(n => {
    const item = document.createElement("div");
    item.className = "notif-item";
    const dotColor = n.type === 'alert' ? 'red' : n.type === 'warning' ? 'amber' : 'green';
    item.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
        <span style="font-weight:700; color:#fff; display:flex; align-items:center; gap:6px;">
          <span class="pulse-dot ${dotColor}"></span> ${n.type.toUpperCase()}
        </span>
        <span style="font-size:0.72rem; color:var(--text-muted);">${n.time}</span>
      </div>
      <p style="color:var(--text-secondary); line-height:1.3;">${n.text}</p>
    `;
    list.appendChild(item);
  });
}

// Report Generator Modal Handlers
function openReportModal() {
  const modal = document.getElementById("report-modal");
  if (modal) modal.classList.add("open");
}
window.openReportModal = openReportModal;

function closeReportModal() {
  const modal = document.getElementById("report-modal");
  if (modal) modal.classList.remove("open");
}
window.closeReportModal = closeReportModal;

function downloadReport(format) {
  showToast(`Generating official Cadastral ${format.toUpperCase()} report with sub-5cm compliance certificate...`, 'info');
  setTimeout(() => {
    showToast(`Survey_Report_Zone04_TerraVisionAI.${format.toLowerCase()} downloaded successfully.`, 'success');
  }, 1000);
}
window.downloadReport = downloadReport;

// Topology Action Handlers
function sendTopologyIssueToSurveyor(issueId) {
  const issue = window.TERRA_DATA.topologyIssues.find(i => i.issueId === issueId);
  if (issue) {
    issue.status = "Surveyor Dispatched (Emp-402)";
    showToast(`Topology Issue #${issueId} sent to Field Surveyor R. Sharma with RTK Rover.`, 'success');
    renderTopologyTable();
  }
}
window.sendTopologyIssueToSurveyor = sendTopologyIssueToSurveyor;

function renderTopologyTable() {
  const tbody = document.getElementById("topology-issues-tbody");
  if (!tbody || !window.TERRA_DATA) return;

  tbody.innerHTML = "";
  window.TERRA_DATA.topologyIssues.forEach(t => {
    const tr = document.createElement("tr");
    const sevBadge = t.severity === 'High' ? 'badge-danger' : t.severity === 'Medium' ? 'badge-warning' : 'badge-geoai';
    tr.innerHTML = `
      <td><strong>${t.issueId}</strong></td>
      <td><span class="font-mono" style="color:var(--accent-cyan);">${t.parcelId}</span></td>
      <td>${t.type}</td>
      <td><span class="badge ${sevBadge}">${t.severity}</span></td>
      <td>${t.areaSqM} m²</td>
      <td><em>${t.status}</em></td>
      <td>
        <button class="btn btn-sm btn-outline-cyan" onclick="sendTopologyIssueToSurveyor('${t.issueId}')">
          Send to Surveyor
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Ground Truth Point Verification Handlers
function verifyGroundTruthPoint(ptId) {
  const pt = window.TERRA_DATA.groundTruthData.surveyPoints.find(p => p.pointId === ptId);
  if (pt) {
    pt.status = "Finalized (CORS Class-A)";
    showToast(`Benchmark GCP point ${ptId} finalized with ${pt.deviationCm}cm deviation.`, 'success');
    renderGroundTruthTable();
  }
}
window.verifyGroundTruthPoint = verifyGroundTruthPoint;

function renderGroundTruthTable() {
  const tbody = document.getElementById("groundtruth-points-tbody");
  if (!tbody || !window.TERRA_DATA) return;

  tbody.innerHTML = "";
  window.TERRA_DATA.groundTruthData.surveyPoints.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${p.pointId}</strong></td>
      <td class="font-mono">${p.northing}</td>
      <td class="font-mono">${p.easting}</td>
      <td class="font-mono">${p.elevation}</td>
      <td><span class="badge badge-success">${p.deviationCm} cm RMSE</span></td>
      <td><span class="badge ${p.status.includes('Finalized') ? 'badge-success' : 'badge-warning'}">${p.status}</span></td>
      <td>
        <button class="btn btn-sm btn-success" onclick="verifyGroundTruthPoint('${p.pointId}')">Confirm</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Citizen Report Submission
function submitCitizenReport(e) {
  if (e) e.preventDefault();
  const address = document.getElementById("citizen-location-input").value;
  const issueType = document.getElementById("citizen-issue-type").value;
  const desc = document.getElementById("citizen-desc-input").value;

  if (!address || !desc) {
    showToast("Please provide location and description of the map discrepancy.", "warning");
    return;
  }

  const reportId = `CR-${Math.floor(1000 + Math.random() * 9000)}`;
  showToast(`Mapping issue logged successfully! Reference ID: #${reportId}. Municipal review queued.`, 'success');

  // Reset form
  document.getElementById("citizen-location-input").value = "";
  document.getElementById("citizen-desc-input").value = "";
}
window.submitCitizenReport = submitCitizenReport;

// On DOM Ready Initializer
document.addEventListener("DOMContentLoaded", () => {
  renderNotifications();
  renderTopologyTable();
  renderGroundTruthTable();

  // Initialize GIS map right away in background
  setTimeout(() => {
    if (window.TerraMapEngine) window.TerraMapEngine.init();
  }, 300);
});
