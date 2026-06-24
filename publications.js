/* ══════════════════════════════════════════════════════════════
   PUBLICATIONS.JS  ·  Your research output — edit entries here!
   ──────────────────────────────────────────────────────────────
   HOW TO ADD A NEW PUBLICATION:
   1. Copy the template block below (between the dashes)
   2. Fill in your details
   3. Save — the publications page updates automatically!

   BADGE OPTIONS (copy exactly):
     "Manuscript in preparation"
     "Under review"
     "Published"
     "Poster / presentation"
     "Research notes"

   YEAR:
     "2026"      → specific year
     "Upcoming"  → not scheduled yet
     "Active"    → ongoing / in progress

   URL:
     DOI, PubMed link, PDF, bioRxiv, or "#" if not public yet
══════════════════════════════════════════════════════════════ */

window.PUBLICATIONS = [

  // ── ✦ TEMPLATE — copy this whole block for every new entry ──
  // {
  //   id:      4,                              // unique number (increment each time)
  //   badge:   "Manuscript in preparation",    // status label (see options above)
  //   year:    "2026",                         // year or "Upcoming" / "Active"
  //   title:   "Your paper / poster title",
  //   authors: "Dibendu Singh, Collaborator Name, ...",
  //   note:    "One or two sentences describing the work.",
  //   tags:    ["cryo-EM", "molecular motors"],  // keyword chips shown on the card
  //   url:     "#"                              // link when card is clicked
  // },
  // ──────────────────────────────────────────────────────────

  {
    id: 1,
    badge: "Manuscript in preparation",
    year: "2026",
    title: "Structural basis of ATP-driven DNA translocation by molecular motors",
    authors: "Dibendu Singh and collaborators",
    note: "Ongoing work focused on conformational states, ATPase-driven motion, and force generation in DNA-moving protein assemblies.",
    tags: ["cryo-EM", "DNA translocation", "molecular motors"],
    url: "#"
  },

  {
    id: 2,
    badge: "Poster / presentation",
    year: "Upcoming",
    title: "Cryo-EM workflows for resolving dynamic protein complexes",
    authors: "Dibendu Singh",
    note: "A methods-oriented research story around sample preparation, image processing, model building, and interpretation of flexible biological assemblies.",
    tags: ["single-particle analysis", "model building", "workflow automation"],
    url: "#"
  },

  {
    id: 3,
    badge: "Research notes",
    year: "Active",
    title: "Computational analysis for cryo-EM density interpretation",
    authors: "Dibendu Singh",
    note: "Python-based tooling and analysis ideas for connecting density maps, model fitting, and structural interpretation.",
    tags: ["Python", "map interpretation", "structural biology"],
    url: "#"
  }

];
