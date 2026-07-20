# Contributing Guide

Thank you for helping improve Asteroid Family Atlas 3D.

## Development Workflow

1. Fork the repository and create a feature branch from `main`.
2. Start the local website with `python3 -m http.server 8000`.
3. Keep each module focused on one responsibility: data handling belongs in `data.js`, orbital logic in `orbit.js`, chart interaction in `plots.js`, and theme definitions in `theme.js`.
4. Run both validation commands:

   ```bash
   npm test
   npm run check:data
   ```

5. Open a pull request that explains the purpose of the change and how it was tested. Include before-and-after screenshots for visual changes.

## Code Guidelines

- Use ES modules and vanilla JavaScript. Do not introduce new global variables on `window`.
- Write independently testable calculations as pure functions and add appropriate tests.
- Support keyboard interaction and visible focus states when adding interactive controls.
- Preserve appropriate labels and ARIA attributes when changing the interface.
- Keep light and dark Plotly themes consistent with their corresponding CSS themes.
- Do not remove or rewrite the source dataset metadata.
- Update the **Model Limitations** section in the README whenever modeling assumptions or data transformations change.

## Data Changes

- Preserve the `metadata`, `columns`, and `families` structure in `asteroid_families.json`.
- Do not replace negative sentinel values unless the upstream source data have changed.
- Document the source, version, and transformation process for newly imported data.
- Run `npm run check:data` before submitting a data change.

## Reporting Issues

When reporting a problem, include:

- browser and operating-system versions;
- steps needed to reproduce the problem;
- expected and actual behavior;
- the selected family, region, and theme when relevant;
- a screenshot for layout or chart-rendering problems, if possible.

## Pull Request Checklist

- [ ] The change has a focused purpose.
- [ ] Tests and data validation pass locally.
- [ ] Documentation has been updated when necessary.
- [ ] Keyboard navigation remains usable.
- [ ] Visual changes work in both light and dark themes.
- [ ] No unrelated files are included in the change.
