import test from "node:test";
import assert from "node:assert/strict";
import { calculateOrbitPath } from "../js/orbit.js";

const closeTo = (actual, expected, tolerance = 1e-10) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} is not close to ${expected}`);

test("returns steps + 1 points and closes the orbit", () => {
  const path = calculateOrbitPath(2.5, 0.2, 10, 100);
  assert.equal(path.x.length, 101);
  assert.equal(path.y.length, 101);
  assert.equal(path.z.length, 101);
  closeTo(path.x[0], path.x.at(-1));
  closeTo(path.y[0], path.y.at(-1));
  closeTo(path.z[0], path.z.at(-1));
});

test("keeps a circular orbit at a constant radius", () => {
  const path = calculateOrbitPath(3, 0, 0, 24);
  path.x.forEach((x, index) => closeTo(Math.hypot(x, path.y[index], path.z[index]), 3));
});

test("keeps zero-inclination orbits on the ecliptic plane", () => {
  const path = calculateOrbitPath(2, 0.1, 0, 24);
  path.z.forEach((z) => closeTo(z, 0));
});

test("rejects invalid orbital inputs", () => {
  assert.throws(() => calculateOrbitPath(0, 0.1, 0), /positive/);
  assert.throws(() => calculateOrbitPath(1, 1, 0), /\[0, 1\)/);
  assert.throws(() => calculateOrbitPath(1, 0.1, Number.NaN), /number/);
  assert.throws(() => calculateOrbitPath(1, 0.1, 0, 2), /at least 3/);
});
