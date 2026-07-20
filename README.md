# Asteroid Family Atlas 3D

An interactive Plotly.js visualization for exploring representative asteroid-family orbits and the distributions of their proper semi-major axes, eccentricities, and inclinations.

## Live Demo

**[Open Asteroid Family Atlas 3D](https://htwho.github.io/asteroid-family-3d/)**

## Features

- Rotate, zoom, and pan an interactive 3D view of the Solar System.
- Explore linked a–e and a–i phase-space plots.
- Search by family name or ID with keyboard navigation support.
- Filter families by the Main Belt, Hilda, and Trojan regions.
- Compare the representative orbits and proper elements of two families.
- Switch between light and dark themes; the selected theme is remembered locally.
- Change the camera angle and toggle planetary orbits and reference grids.
- Inspect central proper elements, member counts, and parent-body IDs.
- Use the responsive interface on desktop and mobile devices.

## Running Locally

The project has no runtime dependencies and requires no build step. Browsers generally prevent pages opened through `file://` from loading local JSON files, so start a local HTTP server from the project directory:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

To run the orbital calculation tests and validate the dataset:

```bash
npm test
npm run check:data
```

The test suite uses only Node.js built-in tools and does not download third-party packages.

## Usage

1. Select a family from either scatter plot, or search for its name or ID in the header.
2. Use the **Region** control to limit the dataset to a dynamical region.
3. Choose a second family under **Compare with** to compare its orbit and proper elements.
4. Drag the 3D view to rotate it, scroll to zoom, or double-click to reset the camera.
5. Use **Camera**, **Range**, and **Display** to adjust the 3D presentation.
6. Hover over plotted data to inspect individual family values.

## Project Structure

```text
.
├── index.html                  # Page structure
├── css/styles.css              # Themes and responsive layout
├── js/
│   ├── app.js                  # Initialization and application state
│   ├── data.js                 # Data loading and validation
│   ├── orbit.js                # Orbit calculations and 3D traces
│   ├── plots.js                # Phase-space plots
│   ├── search.js               # Search and keyboard navigation
│   └── theme.js                # Plotly light/dark theme definitions
├── test/
│   ├── orbit.test.js           # Orbital calculation tests
│   └── validate-data.js        # Dataset validation
└── asteroid_families.json      # Family data and source metadata
```

## Data Source

The included data are derived from the NASA Planetary Data System Small Bodies Node:

- Nesvorný, D. (2015), *Families List from Synthetic Proper Elements*
- PDS logical identifier: `urn:nasa:pds:ast.nesvorny.families:data:familylist_tab`
- Included dataset version: 1.1
- Metadata modification date: 2024-11-12

The catalog contains 122 records, of which 121 contain usable orbital elements. Important fields include `family_id`, `family_name`, `a_center_au`, `e_center`, `i_center_deg`, and `n_members`.

The source dataset uses negative sentinel values for records without usable orbital elements. These records remain unchanged in `asteroid_families.json` but are excluded from the plots. When replacing the data, preserve the `metadata`, `columns`, and `families` structure and run both validation commands.

## Model Limitations

Each displayed family orbit is a schematic representative orbit calculated from the family's central semi-major axis, eccentricity, and inclination. The calculation assumes a longitude of ascending node Ω = 0 and an argument of periapsis ω = 0. Therefore, the visualization:

- does not represent the individual orbits of every family member;
- does not show actual object positions at a specific epoch;
- must not be used for precision ephemerides or orbit prediction.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Run `npm test` and `npm run check:data` before submitting a change. GitHub Actions runs the same checks for pushes and pull requests.

## Citation and License

Citation metadata are available in [CITATION.cff](CITATION.cff). When using this project in research or educational work, please also cite the original NASA PDS dataset.

The source code is released under the [MIT License](LICENSE). Usage conditions for the underlying scientific data are governed by its NASA PDS release.
