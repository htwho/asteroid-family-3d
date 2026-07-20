export const THEMES = {
  dark: {
    page: "#101214", panel: "#171a1d", plot: "#121416", grid: "#34393e",
    axis: "#9ba2a7", line: "#444a4f", accent: "#82b4c0", accentText: "#a8d0d8",
    point: "#7f878c", hover: "#f4f6f7", selectedLine: "rgba(130,180,192,0.34)",
  },
  light: {
    page: "#edf0f2", panel: "#f5f6f7", plot: "#f8f9fa", grid: "#d9dee1",
    axis: "#465158", line: "#aeb7bc", accent: "#386f7c", accentText: "#255f6c",
    point: "#5f6a70", hover: "#111719", selectedLine: "rgba(56,111,124,0.34)",
  },
};

export function currentTheme() {
  return THEMES[document.documentElement.dataset.theme] || THEMES.dark;
}

export function applyPlotTheme(theme) {
  const orbit = document.getElementById("orbit-container");
  if (orbit?.data) {
    Plotly.relayout(orbit, {
      paper_bgcolor: theme.page, "scene.bgcolor": theme.page,
      "scene.xaxis.gridcolor": theme.grid, "scene.yaxis.gridcolor": theme.grid, "scene.zaxis.gridcolor": theme.grid,
      "scene.xaxis.color": theme.axis, "scene.yaxis.color": theme.axis, "scene.zaxis.color": theme.axis,
      "legend.font.color": theme.axis,
    });
    const selectedIndex = orbit.data.findIndex((trace) => trace.meta?.role === "selected-family");
    if (selectedIndex >= 0) Plotly.restyle(orbit, { "line.color": theme.accent }, [selectedIndex]);
  }

  ["plot-ae", "plot-ai"].forEach((id) => {
    const plot = document.getElementById(id);
    if (!plot?.data) return;
    Plotly.relayout(plot, {
      paper_bgcolor: theme.panel, plot_bgcolor: theme.plot, "font.color": theme.axis,
      "xaxis.gridcolor": theme.grid, "yaxis.gridcolor": theme.grid,
      "xaxis.linecolor": theme.line, "yaxis.linecolor": theme.line,
    });
    Plotly.restyle(plot, { "marker.color": theme.point }, [0]);
    Plotly.restyle(plot, {
      "marker.color": theme.accent, "marker.line.color": theme.plot, "textfont.color": theme.accentText,
    }, [1]);
    Plotly.restyle(plot, { "marker.line.color": theme.plot }, [2]);
  });
}
