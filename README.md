# thedibendu.github.io

Personal academic website for Dibendu Singh. The site is plain HTML, CSS, and JavaScript, so most updates can be made by editing the files directly.

## Main Files

- `index.html` - main portfolio page.
- `blog.html` - journal page layout and journal behavior.
- `posts.js` - journal post data.
- `publications.html` - standalone publications page.
- `publications.js` - publication card data.
- `research.html` - reusable research explainer page.
- `research.js` - research topic data.
- `research-pages.css` - research explainer page styles.
- `style.css` - shared site styles.
- `blog.css` - journal-only styles.
- `publications.css` - publications-only styles.

## How To Add A Real Publication

Open `publications.js`. Copy the commented template near the top, paste it inside the `PUBLICATIONS` array, and edit the fields:

```js
{
  id: 4,
  badge: "Published",
  year: "2026",
  title: "Your full publication title goes here",
  authors: "Author One, Dibendu Singh, Author Three",
  note: "Journal name, volume, pages, or a short one-sentence description.",
  tags: ["cryo-EM", "molecular motors", "DNA translocation"],
  url: "https://doi.org/YOUR-DOI-HERE"
}
```

The Publications page builds the visual cards automatically from `publications.js`.

Good `badge` examples:

- `Published article`
- `Preprint`
- `Manuscript in preparation`
- `Poster`
- `Conference talk`
- `Research notes`

## How To Link A Publication Card

Each publication card is designed to work as one big clickable button. Put the research paper website, DOI, PubMed page, preprint, poster, or PDF URL directly in the `url` field in `publications.js`.

Use these common link formats:

- DOI: `https://doi.org/10.xxxx/xxxxx`
- PubMed: `https://pubmed.ncbi.nlm.nih.gov/PMID/`
- Journal page: paste the journal article URL
- Local PDF: put the PDF in the repo, then use `href="filename.pdf"`

Use `url: "#"` only when the work is not public yet. Do not add separate DOI/PDF buttons at the bottom unless the page design is intentionally changed.

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

## How To Edit Research Explainer Pages

The six Research Interest cards on `index.html` link to one reusable page:

```text
research.html?topic=dna-translocases
```

The page content comes from `research.js`. To change the text for a topic, open `research.js` and edit the matching object:

```js
{
  id: "dna-translocases",
  title: "DNA Translocases",
  lede: "Short hero text...",
  visual: "translocase",
  chips: ["DNA", "ATP", "Force"],
  overview: {
    heading: "Section heading",
    paragraphs: ["First paragraph.", "Second paragraph."],
    stat: { value: "ATP", label: "short stat label" }
  },
  points: [
    { label: "Grip", text: "Point text." },
    { label: "Cycle", text: "Point text." },
    { label: "Translocate", text: "Point text." }
  ],
  focus: [
    { label: "Research question", text: "A question this topic helps answer." },
    { label: "Structural readout", text: "The data or structure you would inspect." }
  ],
  why: "Why this topic matters.",
  next: "molecular-motors",
  nextLabel: "Molecular Motors"
}
```

Current visual options are:

- `translocase` - DNA strand threaded through an ATPase ring.
- `motor` - conformational motor cycle.
- `capsid` - viral capsid plus genome packaging motor.
- `microscope` - cryo-EM imaging and particle reconstruction.
- `model` - density map plus fitted model.
- `workflow` - computational pipeline panel.

To add a new research topic:

- Add a new object to `research.js`.
- Add a new card on `index.html` linking to `research.html?topic=your-id`.
- Use one of the visual options listed at the top of `research.js`.

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
