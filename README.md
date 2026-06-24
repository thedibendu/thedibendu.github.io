# thedibendu.github.io

Personal academic website for Dibendu Singh. The site is plain HTML, CSS, and JavaScript, so most updates can be made by editing the files directly.

## Main Files

- `index.html` - main portfolio page.
- `blog.html` - journal page layout and journal behavior.
- `posts.js` - journal post data.
- `publications.html` - standalone publications page.
- `style.css` - shared site styles.
- `blog.css` - journal-only styles.
- `publications.css` - publications-only styles.

## How To Add A Real Publication

Open `publications.html` and find:

```html
<div class="publication-stack">
```

Each publication is one block that starts with:

```html
<article class="publication-card reveal">
```

and ends with:

```html
</article>
```

Copy one full `<article>` block, paste it inside `.publication-stack`, and edit these parts:

```html
<span class="publication-badge">Published article</span>
<span class="publication-year">2026</span>

<h2>Your full publication title goes here</h2>
<p class="publication-authors">Author One, Dibendu Singh, Author Three</p>
<p class="publication-note">
  Journal name, volume, pages, or a short one-sentence description.
</p>
```

Update the tags at the bottom of the card:

```html
<span class="publication-tag">cryo-EM</span>
<span class="publication-tag">molecular motors</span>
<span class="publication-tag">DNA translocation</span>
```

Good badge examples:

- `Published article`
- `Preprint`
- `Manuscript in preparation`
- `Poster`
- `Conference talk`
- `Research notes`

## How To Add A DOI, PDF, Or PubMed Link

Inside a publication card, add this near the bottom, after the tags:

```html
<div class="publication-links">
  <a href="https://doi.org/YOUR-DOI-HERE" target="_blank" rel="noopener">DOI</a>
  <a href="cv_claude.pdf" target="_blank" rel="noopener">PDF</a>
</div>
```

If you add this link block, also add matching CSS to `publications.css`:

```css
.publication-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.publication-links a {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--cyan-bright);
  border: 1px solid rgba(6,182,212,0.28);
  border-radius: 999px;
  padding: 6px 12px;
}
```

## How To Update The Snapshot Numbers

In `publications.html`, find:

```html
<div class="metric-grid">
```

Each small number box is:

```html
<div class="metric">
  <strong>1</strong>
  <span>Manuscript pipeline</span>
</div>
```

Change the number inside `<strong>` and the label inside `<span>`.

## How To Add A Journal Post

Open `posts.js`. Copy the commented template near the top, paste it inside the `POSTS` array, then change:

```js
{
  id: 6,
  date: "2026-06-24",
  category: "lab",
  title: "Your post title",
  caption: "Your post caption.",
  images: ["images/posts/your-photo.jpg"],
  tags: ["cryo-em", "lab-life"]
}
```

Notes:

- Use a new unique `id` every time.
- Put images in `images/posts/`.
- Prefer `.jpg`, `.jpeg`, `.png`, or `.webp`.
- Avoid `.heic` because many browsers do not display it.

## Quick Local Preview

Because this is a static site, you can open `index.html`, `blog.html`, or `publications.html` directly in a browser.

For a local server from the project folder:

```sh
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```
