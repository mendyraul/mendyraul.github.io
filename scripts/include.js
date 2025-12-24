document.addEventListener("DOMContentLoaded", () => {
  const includeTargets = Array.from(document.querySelectorAll("[data-include]"));
  if (!includeTargets.length) return;

  const requests = includeTargets.map((target) => {
    const url = target.getAttribute("data-include");
    if (!url) return Promise.resolve();
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Include failed: ${url}`);
        }
        return response.text();
      })
      .then((html) => {
        target.innerHTML = html;
      });
  });

  Promise.all(requests)
    .then(() => {
      setActiveNavItem();
      ensureNavScript();
    })
    .catch((error) => {
      console.error(error);
    });
});

function setActiveNavItem() {
  const nav = document.getElementById("topnav");
  if (!nav) return;

  const currentPath = normalizePath(window.location.pathname);
  const links = nav.querySelectorAll("a[href]");
  links.forEach((link) => {
    const listItem = link.closest("li");
    if (!listItem) return;
    listItem.classList.remove("active");
    const linkPath = normalizePath(new URL(link.href, window.location.origin).pathname);
    if (linkPath === currentPath) {
      listItem.classList.add("active");
    }
  });
}

function normalizePath(pathname) {
  if (pathname === "/") return "/index.html";
  return pathname;
}

function ensureNavScript() {
  if (document.querySelector('script[src="/scripts/nav.js"]')) return;
  const script = document.createElement("script");
  script.src = "/scripts/nav.js";
  document.body.appendChild(script);
}
