function paddedRange(values, lowerBound = null) {
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const padding = Math.max((maximum - minimum) * 0.08, 0.01);
  return [lowerBound ?? minimum - padding, maximum + padding];
}

function phaseLayout(families, yField, yTitle, theme) {
  const xRange = paddedRange(families.map((family) => family.a_center_au));
  const yRange = paddedRange(families.map((family) => family[yField]), 0);
  return {
    margin: { l: 48, r: 20, t: 10, b: 34 }, paper_bgcolor: theme.panel, plot_bgcolor: theme.plot,
    font: { family: "Roboto Mono", color: theme.axis, size: 12 }, showlegend: false,
    hovermode: "closest", dragmode: "zoom",
    xaxis: { title: "a (AU)", range: xRange, gridcolor: theme.grid, linecolor: theme.line, zerolinecolor: theme.line },
    yaxis: { title: yTitle, range: yRange, gridcolor: theme.grid, linecolor: theme.line, zerolinecolor: theme.line },
  };
}

function trace(families, yField, unit, theme) {
  return {
    x: families.map((family) => family.a_center_au),
    y: families.map((family) => family[yField]),
    text: families.map((family) => family.family_name || `Family ${family.family_id}`),
    customdata: families.map((family) => family.family_id),
    mode: "markers", type: "scatter", marker: { color: theme.point, size: 6, opacity: 0.5 },
    hovertemplate: `<b>%{text}</b><br>a: %{x:.3f} AU<br>${unit}: %{y:.3f}<extra></extra>`,
  };
}

export async function initializePhasePlots(families, onSelect, onHover, theme) {
  const selectedTrace = {
    x: [], y: [], text: [], mode: "markers+text", type: "scatter", name: "Selected Family",
    textposition: "top center", textfont: { color: theme.accentText, size: 14 },
    marker: { color: theme.accent, size: 14, line: { color: theme.plot, width: 2 } },
    hovertemplate: "<b>%{text}</b><extra></extra>", showlegend: false,
  };
  const comparisonTrace = {
    x: [], y: [], text: [], mode: "markers+text", type: "scatter", name: "Comparison Family",
    textposition: "bottom center", textfont: { color: "#c59a6d", size: 14 },
    marker: { color: "#c59a6d", symbol: "circle", size: 14, line: { color: theme.plot, width: 2 } },
    hovertemplate: "<b>%{text}</b><extra></extra>", showlegend: false,
  };
  await Promise.all([
    Plotly.newPlot("plot-ae", [trace(families, "e_center", "e", theme), { ...selectedTrace }, { ...comparisonTrace }], phaseLayout(families, "e_center", "Eccentricity", theme), { displayModeBar: false, responsive: true }),
    Plotly.newPlot("plot-ai", [trace(families, "i_center_deg", "i", theme), { ...selectedTrace }, { ...comparisonTrace }], phaseLayout(families, "i_center_deg", "Inclination (deg)", theme), { displayModeBar: false, responsive: true }),
  ]);

  ["plot-ae", "plot-ai"].forEach((id) => {
    const element = document.getElementById(id);
    element.on("plotly_click", ({ points }) => onSelect(points[0].customdata));
    element.on("plotly_hover", ({ points }) => onHover(points[0].customdata));
    element.on("plotly_unhover", () => onHover(null));
  });
}

export function updatePhaseHighlight(families, selectedId, hoverId, theme) {
  const colors = families.map(({ family_id: id }) => id === hoverId ? theme.hover : id === selectedId ? theme.accent : theme.point);
  const sizes = families.map(({ family_id: id }) => id === hoverId ? 11 : id === selectedId ? 9 : 6);
  ["plot-ae", "plot-ai"].forEach((id) => Plotly.restyle(id, { "marker.color": [colors], "marker.size": [sizes] }, [0]));
}

export function showSelectedFamily(family, theme) {
  const name = family.family_name || `Family ${family.family_id}`;
  const configs = [
    { id: "plot-ae", y: family.e_center },
    { id: "plot-ai", y: family.i_center_deg },
  ];
  configs.forEach(({ id, y }) => {
    Plotly.restyle(id, { x: [[family.a_center_au]], y: [[y]], text: [[name]] }, [1]);
    Plotly.relayout(id, {
      shapes: [
        { type: "line", x0: family.a_center_au, x1: family.a_center_au, y0: 0, y1: 1, yref: "paper", line: { color: theme.selectedLine, width: 1, dash: "dot" } },
        { type: "line", x0: 0, x1: 1, xref: "paper", y0: y, y1: y, line: { color: theme.selectedLine, width: 1, dash: "dot" } },
      ],
    });
  });
}

export function showComparisonFamily(family) {
  const name = family.family_name || `Family ${family.family_id}`;
  [{ id: "plot-ae", y: family.e_center }, { id: "plot-ai", y: family.i_center_deg }].forEach(({ id, y }) => {
    Plotly.restyle(id, { x: [[family.a_center_au]], y: [[y]], text: [[name]] }, [2]);
  });
}

export function clearComparisonFamily() {
  ["plot-ae", "plot-ai"].forEach((id) => Plotly.restyle(id, { x: [[]], y: [[]], text: [[]] }, [2]));
}

export function updatePhaseFamilies(families, theme) {
  const configs = [{ id: "plot-ae", field: "e_center" }, { id: "plot-ai", field: "i_center_deg" }];
  configs.forEach(({ id, field }) => {
    const nextTrace = trace(families, field, field === "e_center" ? "e" : "i", theme);
    Plotly.restyle(id, { x: [nextTrace.x], y: [nextTrace.y], text: [nextTrace.text], customdata: [nextTrace.customdata], "marker.color": theme.point }, [0]);
    Plotly.restyle(id, { x: [[], []], y: [[], []], text: [[], []] }, [1, 2]);
    const layout = phaseLayout(families, field, field === "e_center" ? "Eccentricity" : "Inclination (deg)", theme);
    Plotly.relayout(id, { "xaxis.range": layout.xaxis.range, "yaxis.range": layout.yaxis.range, shapes: [] });
  });
}
