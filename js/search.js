export function initializeSearch(families, onSelect) {
  let availableFamilies = families;
  const input = document.getElementById("search-input");
  const results = document.getElementById("search-results");
  let matches = [];
  let activeIndex = -1;

  function close() {
    results.replaceChildren();
    results.style.display = "none";
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    activeIndex = -1;
  }

  function choose(family) {
    onSelect(family.family_id);
    input.value = "";
    close();
    input.focus();
  }

  function setActive(index) {
    activeIndex = index;
    [...results.children].forEach((button, itemIndex) => button.setAttribute("aria-selected", String(itemIndex === index)));
    if (index >= 0) {
      const active = results.children[index];
      input.setAttribute("aria-activedescendant", active.id);
      active.scrollIntoView({ block: "nearest" });
    }
  }

  function render() {
    const query = input.value.trim().toLocaleLowerCase();
    if (!query) return close();
    matches = availableFamilies.filter((family) => (family.family_name || "").toLocaleLowerCase().includes(query) || String(family.family_id).includes(query)).slice(0, 10);
    results.replaceChildren();
    if (!matches.length) return close();

    matches.forEach((family, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "search-item";
      button.id = `search-option-${index}`;
      button.role = "option";
      button.setAttribute("aria-selected", "false");
      button.textContent = family.family_name ? `${family.family_name} (${family.family_id})` : `Family ${family.family_id}`;
      button.addEventListener("click", () => choose(family));
      results.append(button);
    });
    results.style.display = "block";
    input.setAttribute("aria-expanded", "true");
    activeIndex = -1;
  }

  input.addEventListener("input", render);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") return close();
    if (!matches.length || results.style.display === "none") return;
    if (event.key === "ArrowDown") { event.preventDefault(); setActive((activeIndex + 1) % matches.length); }
    if (event.key === "ArrowUp") { event.preventDefault(); setActive((activeIndex - 1 + matches.length) % matches.length); }
    if (event.key === "Enter" && activeIndex >= 0) { event.preventDefault(); choose(matches[activeIndex]); }
  });
  document.addEventListener("click", (event) => { if (!event.target.closest(".search-container")) close(); });
  return {
    setFamilies(nextFamilies) {
      availableFamilies = nextFamilies;
      input.value = "";
      close();
    },
  };
}
