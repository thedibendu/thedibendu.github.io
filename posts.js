/* ══════════════════════════════════════════════════════════════
   POSTS.JS  ·  Your daily journal — add new entries here!
   ──────────────────────────────────────────────────────────────
   HOW TO ADD A NEW POST:
   1. Copy the template block below (between the dashes)
   2. Fill in your details
   3. Put your photo(s) in the  images/posts/  folder
   4. Save the file — the journal page updates automatically!

   CATEGORIES:
     "lab"        → Lab Life
     "trip"       → Adventures
     "experiment" → Experiments
     "life"       → Daily Life

   IMAGES:
     Put photos in  images/posts/  then reference by path:
       images: ["images/posts/my-photo.jpg"]
     Multiple photos (carousel):
       images: ["images/posts/a.jpg", "images/posts/b.jpg"]
     No photo yet:
       images: []
══════════════════════════════════════════════════════════════ */

const POSTS = [

  // ── ✦ TEMPLATE — copy this whole block for every new post ──
  // {
  //   id:       2,                               // unique number (increment each time)
  //   date:     "2026-06-17",                    // YYYY-MM-DD
  //   category: "lab",                           // lab | trip | experiment | life
  //   title:    "Your post title",
  //   caption:  "Write whatever you want here — what happened, how you felt, what you learned. As long or short as you like.",
  //   images:   ["images/posts/your-photo.jpg"], // [] if no photo
  //   tags:     ["cryo-em", "lab-life"]          // short, lowercase tags
  // },
  // ──────────────────────────────────────────────────────────


  // ── Your entries go below ─────────────────────────────────

  {
    id: 1,
    date: "2026-06-17",
    category: "lab",
    title: "Welcome to my journal!",
    caption: "This is where I'll document moments from the lab, trips with the Morais lab crew, experiments that worked (and some that didn't), and anything exciting that happens along the way. Stay tuned!",
    images: [],
    tags: ["hello", "lab"]
  }

];
