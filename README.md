# Raul Mendy's portfolio

Static portfolio website for my projects, infrastructure work, and research.
The site uses HTML, CSS, and browser JavaScript, with no package installation or
build step.

## Run locally

From the repository root, run `python3 -m http.server 8000`, then open
`http://localhost:8000`. Use the local HTTP server so browser requests for page
partials and data work consistently.

## Layout

- `index.html` is the entry page; `pages/` contains additional pages.
- `styles/` and `scripts/` contain presentation and browser behavior.
- `data/` and `partials/` hold shared page content.
- `assests/` contains images and documents. The directory spelling is intentional
  here because existing links use it.

## Publishing and maintenance

The repository is hosted on GitHub. Check the repository's Pages settings for
the active publishing branch before changing deployment configuration. Local
branches can contain work that has not been published to the live website.
Preview links, navigation, and layout locally before publishing. Review resume
and other personal documents explicitly before adding them to Git.
