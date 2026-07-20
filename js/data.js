const REQUIRED_NUMBERS = ["family_id", "a_center_au", "e_center", "i_center_deg", "n_members"];

export async function loadFamilies(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load data (HTTP ${response.status})`);

  const payload = await response.json();
  const families = Array.isArray(payload) ? payload : payload.families;
  if (!Array.isArray(families) || families.length === 0) throw new Error("The dataset contains no family records");

  families.forEach((family, index) => {
    const missing = REQUIRED_NUMBERS.filter((field) => !Number.isFinite(family[field]));
    if (missing.length) throw new Error(`Invalid fields in record ${index + 1}: ${missing.join(", ")}`);
  });

  // PDS uses negative sentinel values for records without usable orbital elements.
  const usableFamilies = families.filter((family) => family.a_center_au > 0 && family.e_center >= 0 && family.e_center < 1);
  if (!usableFamilies.length) throw new Error("The dataset contains no drawable family orbits");
  return usableFamilies;
}
