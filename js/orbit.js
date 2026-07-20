export const PLANETS = [
  { name: "Mercury", a: 0.387, e: 0.205, i: 7.0, color: "#a5a5a5" },
  { name: "Venus", a: 0.723, e: 0.007, i: 3.39, color: "#e3bb76" },
  { name: "Earth", a: 1.0, e: 0.017, i: 0.0, color: "#4f7bd9" },
  { name: "Mars", a: 1.524, e: 0.093, i: 1.85, color: "#e27b58" },
  { name: "Jupiter", a: 5.203, e: 0.048, i: 1.3, color: "#c88b3a" },
  { name: "Saturn", a: 9.537, e: 0.054, i: 2.49, color: "#c5ab6e" },
  { name: "Uranus", a: 19.19, e: 0.047, i: 0.77, color: "#93b8be" },
  { name: "Neptune", a: 30.07, e: 0.009, i: 1.77, color: "#6f82d8" },
];

export function calculateOrbitPath(a, e, inclinationDegrees, steps = 200) {
  if (!Number.isFinite(a) || a <= 0) throw new RangeError("Semi-major axis must be positive");
  if (!Number.isFinite(e) || e < 0 || e >= 1) throw new RangeError("Eccentricity must be in [0, 1)");
  if (!Number.isFinite(inclinationDegrees)) throw new TypeError("Inclination must be a number");
  if (!Number.isInteger(steps) || steps < 3) throw new RangeError("Steps must be an integer of at least 3");

  const inclination = (inclinationDegrees * Math.PI) / 180;
  const path = { x: [], y: [], z: [] };

  for (let index = 0; index <= steps; index += 1) {
    const theta = (index / steps) * 2 * Math.PI;
    const radius = (a * (1 - e ** 2)) / (1 + e * Math.cos(theta));
    const orbitalY = radius * Math.sin(theta);
    path.x.push(radius * Math.cos(theta));
    path.y.push(orbitalY * Math.cos(inclination));
    path.z.push(orbitalY * Math.sin(inclination));
  }
  return path;
}

function pathTrace(body) {
  const orbit = calculateOrbitPath(body.a, body.e, body.i, 100);
  return {
    ...orbit,
    mode: "lines",
    line: { color: body.color, width: 2 },
    type: "scatter3d",
    name: body.name,
    hoverinfo: "name", showlegend: false, meta: { role: "planet" },
  };
}

export function createBaseTraces() {
  const traces = [{
    x: [0], y: [0], z: [0], mode: "markers", type: "scatter3d", name: "Sun",
    marker: { size: 10, color: "#ffcc00" }, hoverinfo: "name",
  }, ...PLANETS.map(pathTrace)];

  [5, 10, 20, 30].forEach((radius) => {
    traces.push({
      ...calculateOrbitPath(radius, 0, 0, 64), mode: "lines", type: "scatter3d",
      line: { color: "#333", width: 1, dash: "dot" }, name: `${radius} AU`,
      hoverinfo: "name", showlegend: false, meta: { role: "grid" },
    });
  });

  traces.push({
    x: [-35, -25], y: [-35, -35], z: [0, 0], mode: "lines+text", type: "scatter3d",
    text: ["", "10 AU"], textposition: "top right", textfont: { color: "#aaa", size: 14 },
    line: { color: "#aaa", width: 4 }, name: "Scale", hoverinfo: "none", showlegend: false,
    meta: { role: "grid" },
  });

  // Keep one stable trace for the selected family instead of adding/deleting traces.
  traces.push({
    x: [], y: [], z: [], mode: "lines", type: "scatter3d", name: "Selected Family",
    line: { color: "#82b4c0", width: 7 }, hoverinfo: "text", showlegend: false,
    hoverlabel: { bgcolor: "#24282c", bordercolor: "#82b4c0", font: { family: "Roboto Mono", color: "#f1f3f4" } },
    meta: { role: "selected-family" },
  });
  traces.push({
    x: [], y: [], z: [], mode: "lines", type: "scatter3d", name: "Comparison Family",
    line: { color: "#c59a6d", width: 6, dash: "solid" }, hoverinfo: "text", showlegend: false,
    hoverlabel: { bgcolor: "#24282c", bordercolor: "#c59a6d", font: { family: "Roboto Mono", color: "#f1f3f4" } },
    meta: { role: "comparison-family" },
  });
  return traces;
}

export function createOrbitLayout() {
  const axis = { gridcolor: "#34393e", showbackground: false, zerolinecolor: "#555d63", color: "#8f979c" };
  return {
    scene: {
      xaxis: { ...axis, title: "X (AU)", range: [-35, 35] },
      yaxis: { ...axis, title: "Y (AU)", range: [-35, 35] },
      zaxis: { ...axis, title: "Z (AU)", range: [-15, 15] },
      aspectmode: "manual", aspectratio: { x: 1, y: 1, z: 0.4 }, bgcolor: "#101214",
      camera: { eye: { x: 0, y: -0.5, z: 2.2 }, up: { x: 0, y: 1, z: 0 } },
    },
    paper_bgcolor: "#101214", margin: { l: 0, r: 0, b: 0, t: 0 }, showlegend: false,
    legend: { x: 0, y: 1, font: { color: "#aeb4b8", size: 13 }, bgcolor: "rgba(16,18,20,0.65)" },
  };
}

export function selectedFamilyUpdate(family) {
  const path = calculateOrbitPath(family.a_center_au, family.e_center, family.i_center_deg);
  const name = family.family_name || `Family ${family.family_id}`;
  const text = `<b>${name}</b><br>a: ${family.a_center_au.toFixed(3)} AU<br>e: ${family.e_center.toFixed(3)}<br>i: ${family.i_center_deg.toFixed(2)}°<br>Members: ${family.n_members}<br>Parent: ${family.parent_id || "–"}`;
  return { ...path, name: `${name} Family`, text: new Array(path.x.length).fill(text) };
}
