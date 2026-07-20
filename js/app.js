import { loadFamilies } from "./data.js";
import { createBaseTraces, createOrbitLayout, selectedFamilyUpdate } from "./orbit.js";
import { clearComparisonFamily, initializePhasePlots, showComparisonFamily, showSelectedFamily, updatePhaseFamilies, updatePhaseHighlight } from "./plots.js";
import { initializeSearch } from "./search.js";
import { applyPlotTheme, currentTheme } from "./theme.js";

const DATA_URL = "./asteroid_families.json";
let families = [];
let visibleFamilies = [];
let familiesById = new Map();
let selectedId = null;
let comparisonId = null;
let resizeFrame = null;
let familyFocused = false;
let searchController = null;

function updateDetails(family) {
  const values = {
    "detail-name": family.family_name || `Family ${family.family_id}`,
    "detail-id": `ID: ${family.family_id}`,
    "detail-a": family.a_center_au.toFixed(4),
    "detail-e": family.e_center.toFixed(4),
    "detail-i": family.i_center_deg.toFixed(2),
    "detail-members": family.n_members.toLocaleString(),
    "detail-parent": family.parent_id || "–",
  };
  Object.entries(values).forEach(([id, value]) => { document.getElementById(id).textContent = value; });
  document.getElementById("empty-guidance").hidden = true;
}

function orbitPlot() { return document.getElementById("orbit-container"); }

function setOrbitRange(family, focused) {
  const extent = focused ? Math.max(family.a_center_au * (1 + family.e_center) * 1.35, 2) : 35;
  const zExtent = focused ? Math.max(extent * 0.45, 1) : 15;
  Plotly.relayout(orbitPlot(), {
    "scene.xaxis.range": [-extent, extent],
    "scene.yaxis.range": [-extent, extent],
    "scene.zaxis.range": [-zExtent, zExtent],
  });
}

function selectFamily(id) {
  const family = familiesById.get(id);
  if (!family) return;
  selectedId = id;
  updateDetails(family);
  const update = selectedFamilyUpdate(family);
  const plot = orbitPlot();
  const traceIndex = plot.data.findIndex((item) => item.meta?.role === "selected-family");
  Plotly.restyle(plot, { x: [update.x], y: [update.y], z: [update.z], text: [update.text], name: update.name }, [traceIndex]);
  document.getElementById("primary-legend-name").textContent = update.name;
  document.getElementById("primary-legend").hidden = false;
  updatePhaseHighlight(visibleFamilies, selectedId, null, currentTheme());
  showSelectedFamily(family, currentTheme());
  const rangeSelect = document.getElementById("range-view");
  rangeSelect.disabled = false;
  if (familyFocused) setOrbitRange(family, true);
  updateComparisonOptions();
  if (comparisonId === selectedId) clearComparison();
  else if (comparisonId) compareFamily(comparisonId);
}

function updateComparisonOptions() {
  const select = document.getElementById("compare-family");
  const previousValue = comparisonId ? String(comparisonId) : "";
  select.replaceChildren(new Option("Choose another family…", ""));
  visibleFamilies.filter((family) => family.family_id !== selectedId).forEach((family) => {
    select.add(new Option(`${family.family_name || `Family ${family.family_id}`} (${family.family_id})`, family.family_id));
  });
  select.disabled = !selectedId;
  if ([...select.options].some((option) => option.value === previousValue)) select.value = previousValue;
}

function compareFamily(id) {
  const family = familiesById.get(id);
  if (!family || id === selectedId) return clearComparison();
  comparisonId = id;
  const update = selectedFamilyUpdate(family);
  const plot = orbitPlot();
  const traceIndex = plot.data.findIndex((trace) => trace.meta?.role === "comparison-family");
  Plotly.restyle(plot, { x: [update.x], y: [update.y], z: [update.z], text: [update.text], name: update.name }, [traceIndex]);
  showComparisonFamily(family);
  const primary = familiesById.get(selectedId);
  const signed = (value, digits, suffix = "") => `${value >= 0 ? "+" : ""}${value.toFixed(digits)}${suffix}`;
  const values = {
    "comparison-name": family.family_name || `Family ${family.family_id}`,
    "comparison-id": `ID: ${family.family_id}`,
    "comparison-a": `${family.a_center_au.toFixed(4)} AU`,
    "comparison-e": family.e_center.toFixed(4),
    "comparison-i": `${family.i_center_deg.toFixed(2)}°`,
    "comparison-members": family.n_members.toLocaleString(),
    "comparison-a-delta": `${signed(family.a_center_au - primary.a_center_au, 4)} AU`,
    "comparison-e-delta": signed(family.e_center - primary.e_center, 4),
    "comparison-i-delta": signed(family.i_center_deg - primary.i_center_deg, 2, "°"),
    "comparison-members-delta": signed(family.n_members - primary.n_members, 0),
  };
  Object.entries(values).forEach(([elementId, value]) => { document.getElementById(elementId).textContent = value; });
  document.getElementById("comparison-card").hidden = false;
  document.getElementById("clear-comparison").hidden = false;
  document.getElementById("comparison-legend-name").textContent = update.name;
  document.getElementById("comparison-legend").hidden = false;
}

function clearComparison() {
  comparisonId = null;
  const plot = orbitPlot();
  const traceIndex = plot.data.findIndex((trace) => trace.meta?.role === "comparison-family");
  if (traceIndex >= 0) Plotly.restyle(plot, { x: [[]], y: [[]], z: [[]], text: [[]] }, [traceIndex]);
  clearComparisonFamily();
  document.getElementById("comparison-card").hidden = true;
  document.getElementById("clear-comparison").hidden = true;
  document.getElementById("compare-family").value = "";
  document.getElementById("comparison-legend").hidden = true;
}

function initializeComparison() {
  document.getElementById("compare-family").addEventListener("change", (event) => {
    if (event.target.value) compareFamily(Number(event.target.value));
    else clearComparison();
  });
  document.getElementById("clear-comparison").addEventListener("click", clearComparison);
}

function clearSelection() {
  clearComparison();
  selectedId = null;
  familyFocused = false;
  const placeholders = {
    "detail-name": "Select a Family", "detail-id": "ID: –", "detail-a": "–", "detail-e": "–",
    "detail-i": "–", "detail-members": "–", "detail-parent": "–",
  };
  Object.entries(placeholders).forEach(([id, value]) => { document.getElementById(id).textContent = value; });
  document.getElementById("empty-guidance").hidden = false;
  const rangeSelect = document.getElementById("range-view");
  rangeSelect.disabled = true;
  rangeSelect.value = "system";
  const plot = orbitPlot();
  const traceIndex = plot.data.findIndex((trace) => trace.meta?.role === "selected-family");
  Plotly.restyle(plot, { x: [[]], y: [[]], z: [[]], text: [[]] }, [traceIndex]);
  document.getElementById("primary-legend").hidden = true;
  setOrbitRange({ a_center_au: 30, e_center: 0 }, false);
  updateComparisonOptions();
}

function initializeRegionFilter() {
  const filters = {
    all: () => true,
    "main-belt": (family) => family.a_center_au >= 2 && family.a_center_au <= 3.5,
    hilda: (family) => family.a_center_au >= 3.7 && family.a_center_au <= 4.2,
    trojan: (family) => family.a_center_au >= 5 && family.a_center_au <= 5.5,
  };
  document.getElementById("region-filter").addEventListener("change", (event) => {
    visibleFamilies = families.filter(filters[event.target.value] || filters.all);
    document.getElementById("family-count").textContent = `${visibleFamilies.length} ${visibleFamilies.length === 1 ? "family" : "families"}`;
    searchController.setFamilies(visibleFamilies);
    updatePhaseFamilies(visibleFamilies, currentTheme());
    if (selectedId && visibleFamilies.some((family) => family.family_id === selectedId)) {
      const family = familiesById.get(selectedId);
      updatePhaseHighlight(visibleFamilies, selectedId, null, currentTheme());
      showSelectedFamily(family, currentTheme());
      updateComparisonOptions();
      if (comparisonId && visibleFamilies.some((familyItem) => familyItem.family_id === comparisonId)) {
        compareFamily(comparisonId);
      } else if (comparisonId) {
        clearComparison();
      }
    } else {
      clearSelection();
    }
  });
}

function initializeThemeToggle() {
  const button = document.getElementById("theme-toggle");
  function updateLabel() {
    const dark = document.documentElement.dataset.theme === "dark";
    button.innerHTML = `Theme: <span>${dark ? "Dark" : "Light"}</span>`;
    button.setAttribute("aria-label", `Current theme: ${dark ? "dark" : "light"}. Activate to switch theme.`);
  }
  updateLabel();
  button.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("atlas-theme", next);
    applyPlotTheme(currentTheme());
    updatePhaseHighlight(visibleFamilies, selectedId, null, currentTheme());
    if (selectedId) showSelectedFamily(familiesById.get(selectedId), currentTheme());
    updateLabel();
  });
}

function setRoleVisibility(role, visible) {
  const plot = orbitPlot();
  const indices = plot.data.flatMap((trace, index) => trace.meta?.role === role ? [index] : []);
  if (indices.length) Plotly.restyle(plot, { visible }, indices);
}

function initializeOrbitControls() {
  const cameras = {
    top: { eye: { x: 0, y: 0, z: 2.5 }, up: { x: 0, y: 1, z: 0 } },
    side: { eye: { x: 2.5, y: 0, z: 0.25 }, up: { x: 0, y: 0, z: 1 } },
    perspective: { eye: { x: 0, y: -0.5, z: 2.2 }, up: { x: 0, y: 1, z: 0 } },
  };
  document.getElementById("camera-view").addEventListener("change", (event) => {
    Plotly.relayout(orbitPlot(), {
      "scene.camera": cameras[event.target.value],
      "scene.zaxis.visible": event.target.value !== "top",
    });
  });

  [["toggle-planets", "planet"], ["toggle-grid", "grid"]].forEach(([buttonId, role]) => {
    const button = document.getElementById(buttonId);
    button.addEventListener("click", () => {
      const visible = button.getAttribute("aria-pressed") !== "true";
      button.setAttribute("aria-pressed", String(visible));
      button.textContent = `${visible ? "✓" : ""} ${role === "planet" ? "Planets" : "Grid"}`.trim();
      setRoleVisibility(role, visible);
    });
  });

  document.getElementById("range-view").addEventListener("change", (event) => {
    const family = familiesById.get(selectedId);
    if (!family) return;
    familyFocused = event.target.value === "family";
    setOrbitRange(family, familyFocused);
  });
}

function scheduleResize() {
  if (resizeFrame) cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => {
    ["orbit-container", "plot-ae", "plot-ai"].forEach((id) => Plotly.Plots.resize(document.getElementById(id)));
  });
}

async function initialize() {
  const loading = document.getElementById("loading-screen");
  try {
    if (typeof Plotly === "undefined") throw new Error("Plotly failed to load. Check your internet connection.");
    families = await loadFamilies(DATA_URL);
    visibleFamilies = families;
    familiesById = new Map(families.map((family) => [family.family_id, family]));
    await Plotly.newPlot("orbit-container", createBaseTraces(), createOrbitLayout(), { responsive: true, displaylogo: false });
    applyPlotTheme(currentTheme());
    initializeOrbitControls();
    await initializePhasePlots(visibleFamilies, selectFamily, (hoverId) => updatePhaseHighlight(visibleFamilies, selectedId, hoverId, currentTheme()), currentTheme());
    searchController = initializeSearch(visibleFamilies, selectFamily);
    initializeRegionFilter();
    initializeComparison();
    initializeThemeToggle();
    loading.hidden = true;
    loading.style.display = "none";
    window.addEventListener("resize", scheduleResize, { passive: true });
  } catch (error) {
    const message = document.getElementById("loading-text");
    message.textContent = `Error: ${error.message}`;
    message.classList.add("error");
  }
}

initialize();
