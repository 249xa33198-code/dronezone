/**
 * TerraVision AI - Core Data Store
 * Automated Urban Parcel Mapping & Cadastral Feature Extraction
 */

const TERRA_DATA = {
  metadata: {
    projectName: "Urban Cadastral Land Intelligence Platform",
    platformName: "TerraVision AI",
    tagline: "From Drone Pixels to Intelligent Urban Land Records.",
    zone: "Zone 04 - Metro Cadastral Sector",
    gsd: "2.4 cm / pixel",
    coordinateSystem: "EPSG:3857 / WGS 84 (UTM 43N)",
    surveyDate: "September 2026",
    accuracyStandard: "Sub-5cm Geo-Referenced Cadastral Class-A"
  },

  authorityStats: {
    totalParcels: 12450,
    buildingsDetected: 18230,
    verificationRequired: 320,
    changesDetected: 150,
    avgConfidence: 94.2,
    parcelsMappedKm2: 14.8,
    activeSurveyors: 14,
    droneMissions: 28,
    topologyChecksPassed: 99.1
  },

  surveyorStats: {
    totalParcels: 12450,
    aiProcessed: 12130,
    highConfidence: 11980,
    needsReview: 320,
    potentialIssues: 150,
    verifiedToday: 42,
    avgReviewTimeMin: 3.4
  },

  // Realistic Urban Cadastral Parcels with coordinates around an urban center (Bangalore / Delhi / Hyderabad Geo-coordinates)
  parcels: [
    {
      id: "P-102",
      surveyZone: "Zone 04-B",
      areaSqM: 485.6,
      landUse: "Residential / Under Construction",
      confidence: 72.0,
      status: "Needs Verification",
      changeStatus: "New Construction Detected",
      featuresDetected: ["Building Footprint", "Parcel Boundary", "Access Road"],
      surveyDate: "2026-09-24",
      lastSurveyYear: 2025,
      previousStatus: "Vacant Plot",
      issueDescription: "Boundary partially obscured by overlapping structure and tree canopy.",
      discrepancyFlag: true,
      surveyorNotes: "Field team dispatched with CORS GNSS rover to clarify south-east corner vertex.",
      coordinates: [
        [12.9716, 77.5946],
        [12.9723, 77.5948],
        [12.9721, 77.5957],
        [12.9714, 77.5955]
      ],
      buildingFootprint: [
        [12.9717, 77.5949],
        [12.9721, 77.5950],
        [12.9720, 77.5954],
        [12.9716, 77.5953]
      ],
      heightEst: 14.2, // meters (4 floors)
      topologyStatus: "Overlapping Boundary Detected (Issue #T102)"
    },
    {
      id: "P-103",
      surveyZone: "Zone 04-A",
      areaSqM: 620.2,
      landUse: "Commercial",
      confidence: 96.8,
      status: "Verified",
      changeStatus: "No Change",
      featuresDetected: ["Commercial Building", "Boundary Wall", "Paved Access"],
      surveyDate: "2026-09-22",
      lastSurveyYear: 2025,
      previousStatus: "Commercial Building",
      issueDescription: "None. All vertices validated against high-precision orthomosaic.",
      discrepancyFlag: false,
      surveyorNotes: "Boundaries conform to physical boundary wall.",
      coordinates: [
        [12.9724, 77.5948],
        [12.9732, 77.5951],
        [12.9730, 77.5960],
        [12.9722, 77.5958]
      ],
      buildingFootprint: [
        [12.9725, 77.5950],
        [12.9730, 77.5952],
        [12.9729, 77.5958],
        [12.9724, 77.5956]
      ],
      heightEst: 22.5, // meters
      topologyStatus: "Pass - 0 Errors"
    },
    {
      id: "P-104",
      surveyZone: "Zone 04-A",
      areaSqM: 340.8,
      landUse: "Residential",
      confidence: 94.5,
      status: "Verified",
      changeStatus: "Building Expansion",
      featuresDetected: ["Residential Annex", "Boundary Wall"],
      surveyDate: "2026-09-21",
      lastSurveyYear: 2025,
      previousStatus: "Single Floor Residence",
      issueDescription: "Minor rooftop expansion detected via DSM height differential.",
      discrepancyFlag: false,
      surveyorNotes: "Verified with CORS receiver. Boundary vertices unchanged.",
      coordinates: [
        [12.9733, 77.5952],
        [12.9739, 77.5954],
        [12.9737, 77.5962],
        [12.9731, 77.5960]
      ],
      buildingFootprint: [
        [12.9734, 77.5954],
        [12.9738, 77.5955],
        [12.9736, 77.5960],
        [12.9733, 77.5959]
      ],
      heightEst: 9.8,
      topologyStatus: "Pass - 0 Errors"
    },
    {
      id: "P-105",
      surveyZone: "Zone 04-C",
      areaSqM: 810.0,
      landUse: "Open Land",
      confidence: 68.4,
      status: "Needs Verification",
      changeStatus: "Land-use Change",
      featuresDetected: ["Excavation Site", "Perimeter Fence"],
      surveyDate: "2026-09-25",
      lastSurveyYear: 2025,
      previousStatus: "Agricultural / Open",
      issueDescription: "Possible boundary shift along western irrigation channel.",
      discrepancyFlag: true,
      surveyorNotes: "Ground truth rover inspection required for waterbody easement.",
      coordinates: [
        [12.9708, 77.5942],
        [12.9715, 77.5945],
        [12.9713, 77.5954],
        [12.9706, 77.5951]
      ],
      buildingFootprint: null,
      heightEst: 0.0,
      topologyStatus: "Warning - Edge Alignment Discrepancy"
    },
    {
      id: "P-106",
      surveyZone: "Zone 04-B",
      areaSqM: 1250.4,
      landUse: "Industrial",
      confidence: 97.2,
      status: "Verified",
      changeStatus: "No Change",
      featuresDetected: ["Warehouse Structure", "Loading Bay", "Heavy Vehicle Access"],
      surveyDate: "2026-09-20",
      lastSurveyYear: 2025,
      previousStatus: "Industrial Warehouse",
      issueDescription: "None. Clear perimeter with razor wire fence detected.",
      discrepancyFlag: false,
      surveyorNotes: "Cadastral boundaries align with master plan shapefiles.",
      coordinates: [
        [12.9718, 77.5960],
        [12.9728, 77.5963],
        [12.9725, 77.5975],
        [12.9715, 77.5972]
      ],
      buildingFootprint: [
        [12.9720, 77.5963],
        [12.9726, 77.5965],
        [12.9724, 77.5972],
        [12.9718, 77.5970]
      ],
      heightEst: 11.2,
      topologyStatus: "Pass - 0 Errors"
    },
    {
      id: "P-107",
      surveyZone: "Zone 04-C",
      areaSqM: 520.0,
      landUse: "Residential",
      confidence: 81.5,
      status: "In Review",
      changeStatus: "Possible Boundary Discrepancy",
      featuresDetected: ["Multi-Family Housing", "Compound Gate"],
      surveyDate: "2026-09-23",
      lastSurveyYear: 2025,
      previousStatus: "Residential",
      issueDescription: "Roof overhang extends 0.8m over cadastral easement line.",
      discrepancyFlag: true,
      surveyorNotes: "Field ground truthing scheduled to verify physical compound wall vs roof projection.",
      coordinates: [
        [12.9728, 77.5965],
        [12.9736, 77.5968],
        [12.9733, 77.5978],
        [12.9726, 77.5975]
      ],
      buildingFootprint: [
        [12.9729, 77.5967],
        [12.9734, 77.5969],
        [12.9732, 77.5976],
        [12.9728, 77.5974]
      ],
      heightEst: 16.5,
      topologyStatus: "Warning - Overhang Anomaly"
    },
    {
      id: "P-108",
      surveyZone: "Zone 04-A",
      areaSqM: 950.0,
      landUse: "Institutional",
      confidence: 98.4,
      status: "Verified",
      changeStatus: "No Change",
      featuresDetected: ["Civic Center", "Plaza", "Landscaping"],
      surveyDate: "2026-09-19",
      lastSurveyYear: 2025,
      previousStatus: "Municipal Civic Center",
      issueDescription: "None. Government surveyed reference benchmark.",
      discrepancyFlag: false,
      surveyorNotes: "Tie-in point for city CORS network station 04.",
      coordinates: [
        [12.9702, 77.5956],
        [12.9712, 77.5959],
        [12.9709, 77.5969],
        [12.9700, 77.5966]
      ],
      buildingFootprint: [
        [12.9704, 77.5958],
        [12.9710, 77.5960],
        [12.9708, 77.5967],
        [12.9703, 77.5964]
      ],
      heightEst: 18.0,
      topologyStatus: "Pass - 0 Errors"
    }
  ],

  // Change Detection Details (2025 Historical vs 2026 Drone)
  changeIntelligence: {
    selectedArea: "Zone 04 - Sector 2 (Parcels P-100 to P-125)",
    previousSurvey: "Zone 04 - Historical Cadastre (Survey Year 2025)",
    currentSurvey: "Zone 04 - High-Res Drone Orthomosaic (Sept 2026)",
    statistics: {
      newConstructions: 48,
      buildingExpansions: 62,
      landUseModifications: 26,
      boundaryDiscrepancies: 14
    },
    primaryCaseStudy: {
      parcelId: "P-102",
      year2025: {
        classification: "Vacant Open Land",
        footprintAreaSqM: 0,
        dsmHeightMax: 1.2,
        notes: "Undeveloped plot recorded in legacy municipality cadastre."
      },
      year2026: {
        classification: "Active Construction (G+3 Multi-Dwelling)",
        footprintAreaSqM: 264.8,
        dsmHeightMax: 14.2,
        notes: "Structure detected from 2.4cm GSD drone orthomosaic + DSM height differential."
      },
      aiDetection: {
        status: "NEW CONSTRUCTION DETECTED",
        confidence: 96.4,
        changeType: "New Multi-Storey Building",
        discrepancyNotice: "Possible boundary proximity discrepancy — requires surveyor ground verification. TerraVision AI assists preliminary survey and does not issue legal ownership title."
      }
    }
  },

  // Topology Validation Engine Issues
  topologyIssues: [
    {
      issueId: "T-102",
      parcelId: "P-102 & P-103",
      type: "Overlapping Geometry",
      severity: "Medium",
      areaSqM: 4.8,
      status: "Pending Surveyor Dispatch",
      details: "Boundary polygon vertex #3 intersects P-103 buffer by 32 cm. Overhang shadow caused AI boundary dilation.",
      suggestedFix: "Snap to physical boundary wall detected in ORI orthomosaic."
    },
    {
      issueId: "T-108",
      parcelId: "P-105 & Public Road R-04",
      type: "Cadastral Gap (Sliver Polygon)",
      severity: "Low",
      areaSqM: 1.2,
      status: "Auto-Resolved",
      details: "Unclassified gap between road reserve and private boundary.",
      suggestedFix: "Auto-snapped to road centerline buffer (EPSG:3857)."
    },
    {
      issueId: "T-114",
      parcelId: "P-118",
      type: "Self-Intersecting Polygon",
      severity: "High",
      areaSqM: 18.6,
      status: "In Review",
      details: "Complex building boundary loop generated invalid self-intersecting ring.",
      suggestedFix: "Spline simplification & manual surveyor vertex pruning."
    },
    {
      issueId: "T-120",
      parcelId: "P-122",
      type: "Inconsistent Boundary Node",
      severity: "Low",
      areaSqM: 0.6,
      status: "Resolved",
      details: "Point node does not share common topological edge with adjacent plot.",
      suggestedFix: "Snapping tolerance adjusted to 5 cm standard."
    }
  ],

  // Ground Truth Verification Pipeline
  groundTruthData: {
    corsStation: "CORS-IN-KA-04 (Bengaluru Urban)",
    roverAccuracy: "Horizontal: 8mm | Vertical: 14mm",
    surveyPoints: [
      { pointId: "GCP-01", northing: "1434521.14", easting: "758920.88", elevation: "912.4m", deviationCm: 1.8, status: "Verified" },
      { pointId: "GCP-02", northing: "1434612.45", easting: "758994.20", elevation: "914.1m", deviationCm: 2.3, status: "Verified" },
      { pointId: "GCP-03", northing: "1434488.92", easting: "759082.11", elevation: "911.8m", deviationCm: 3.1, status: "Verified" },
      { pointId: "GCP-04", northing: "1434710.05", easting: "759140.50", elevation: "915.2m", deviationCm: 4.4, status: "Field Review" }
    ],
    fieldPhotos: [
      { id: "FP-102A", label: "South-East Boundary Peg", parcel: "P-102", timestamp: "2026-09-25 10:14 IST", surveyor: "R. Sharma (Emp-402)" },
      { id: "FP-102B", label: "Structural Setback Check", parcel: "P-102", timestamp: "2026-09-25 10:28 IST", surveyor: "R. Sharma (Emp-402)" }
    ]
  },

  // Land-Use Classification
  landUseDistribution: [
    { type: "Residential", percentage: 54.2, areaHectares: 802.2, color: "#3b82f6" },
    { type: "Commercial", percentage: 21.8, areaHectares: 322.6, color: "#00f2fe" },
    { type: "Industrial", percentage: 8.4, areaHectares: 124.3, color: "#f59e0b" },
    { type: "Open Land", percentage: 11.2, areaHectares: 165.8, color: "#10b981" },
    { type: "Transportation", percentage: 3.1, areaHectares: 45.9, color: "#8b5cf6" },
    { type: "Construction Sites", percentage: 1.3, areaHectares: 19.2, color: "#ef4444" }
  ],

  // Live Notifications
  notifications: [
    { id: "N-1", type: "alert", text: "150 urban changes detected in Zone 04 drone re-flight.", time: "12m ago", unread: true },
    { id: "N-2", type: "warning", text: "23 parcels require urgent surveyor verification (Confidence < 75%).", time: "34m ago", unread: true },
    { id: "N-3", type: "success", text: "Drone photogrammetry ortho-mosaic generation complete for Zone 02.", time: "1h ago", unread: false },
    { id: "N-4", type: "alert", text: "Topology issue #T-102 flagged: Overlapping geometry between P-102 & P-103.", time: "2h ago", unread: false },
    { id: "N-5", type: "info", text: "Ground Truth RTK rover synchronization completed by Surveyor R. Sharma.", time: "3h ago", unread: false }
  ],

  // Surveyor Team Management
  surveyors: [
    { id: "S-401", name: "Vikramaditya Rao", role: "Senior Cadastral Surveyor", status: "Active in Field", zone: "Zone 04-A", completedToday: 18, accuracyRating: "99.4%" },
    { id: "S-402", name: "Rohit Sharma", role: "GeoAI Field Technician", status: "Active in Field", zone: "Zone 04-B", completedToday: 14, accuracyRating: "98.8%" },
    { id: "S-403", name: "Ananya Deshmukh", role: "GIS Verification Officer", status: "Desk Review", zone: "Zone 04-C", completedToday: 24, accuracyRating: "99.8%" },
    { id: "S-404", name: "Praveen Kumar", role: "CORS / GNSS Specialist", status: "Calibration Station", zone: "City Master Base", completedToday: 9, accuracyRating: "99.9%" }
  ],

  // Citizen Submitted Reports (Crowdsourced civic feedback)
  citizenReports: [
    {
      id: "CR-8021",
      submittedBy: "Priya Nair (Resident)",
      parcelRef: "Near P-102 / 4th Cross",
      issueType: "Incorrect building representation",
      description: "My neighbor recently constructed an extra floor that blocks the common pathway. The older map shows vacant land.",
      status: "Under Field Review",
      date: "2026-09-26",
      photoAttached: true
    },
    {
      id: "CR-8019",
      submittedBy: "Arun Swaminathan",
      parcelRef: "P-108 / North Road",
      issueType: "Missing access road / easement",
      description: "New road widening has altered the access driveway. Drone map still shows old pavement contour.",
      status: "Resolved - Map Updated",
      date: "2026-09-24",
      photoAttached: true
    }
  ]
};

// Make accessible to all modules
if (typeof window !== "undefined") {
  window.TERRA_DATA = TERRA_DATA;
}
