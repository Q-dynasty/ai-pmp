const videoSection = document.querySelector("#videos");

if (videoSection) {
  const buttons = [...videoSection.querySelectorAll(".filter")];
  const cards = [...videoSection.querySelectorAll("[data-track]")];

  const applyFilter = (target) => {
    buttons.forEach((button) => {
      const active = button.dataset.filter === target;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    cards.forEach((card) => {
      const visible = card.dataset.track === target;
      card.classList.toggle("is-hidden", !visible);
    });
  };

  const initial =
    buttons.find((button) => button.classList.contains("is-active"))?.dataset.filter ||
    buttons[0]?.dataset.filter;

  if (initial) {
    applyFilter(initial);
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      applyFilter(button.dataset.filter);
    });
  });
}
