## Emad Salehi — Portfolio (Health Informatics)

Modern, minimal personal site with interactive Publications and Projects. Built with vanilla HTML/CSS/JS for portability and GitHub Pages readiness.

### Local development

Use any static server to test locally (needed due to fetch of JSON files):

```bash
python3 -m http.server 9000 --bind 127.0.0.1
# open http://127.0.0.1:9000/
```

### Content

- `data/publications.json`: Add your entries with fields: `title`, `authors`, `venue`, `year`, `type`, optional `doi`, `pdf`, `code`, `keywords`.
- `data/projects.json`: Fields: `title`, `description`, `tags`, optional `demo`, `code`, `paper`, `thumbnail`.
- `assets/Emad_Salehi_CV.pdf`: Place your CV here and the link in nav will work.

### Deploy to GitHub Pages

1. Create a repo named `<your-username>.github.io`.
2. Copy all files in this folder to the repo root and commit.
3. Push `main` to GitHub; Pages serves automatically at `https://<your-username>.github.io/`.
4. For a project site (non-root), put files in the repo and enable Pages → Source: `main` (root). If using a subpath, add a `<base href="/your-repo/">` tag in `index.html` head.

### Customize

- Update name, bio, and links in `index.html` header and hero.
- Replace placeholder thumbnails in `assets/thumbs/` or remove `thumbnail` fields.
- Adjust theme colors in `css/styles.css` under `:root` and `.light`.


