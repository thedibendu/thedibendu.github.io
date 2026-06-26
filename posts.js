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
  //   id:       4,                               // unique number (increment each time)
  //   date:     "2026-06-17",                    // YYYY-MM-DD
  //   category: "lab",                           // lab | trip | experiment | life
  //   title:    "Your post title",
  //   caption:  "Write whatever you want here.",
  //   images:   ["images/posts/your-photo.jpg"], // [] if no photo
  //   tags:     ["cryo-em", "lab-life"]
  // },
  // ──────────────────────────────────────────────────────────

  {
    id: 4,
    date: "2026-06-17",
    category: "lab",
    title: "Welcome to my journal!",
    caption: "Sugar valley kayaking",
    images: ["images/posts/t25.jpeg"],
    tags: ["hello", "lab"]
  },

  {
    id: 1,
    date: "2026-06-17",
    category: "life",
    title: "It's Me",
    caption: "I just look great",
    images: ["images/posts/p1.jpg"],
    tags: ["life"]
  },

  {
    id: 2,
    date: "2026-06-17",
    category: "life",
    title: "It's Me",
    caption: "isn't that looks cool, The pose is inspired from someone I really ❤️",
    images: ["images/posts/p2.jpg"],
    tags: ["life"]
  },

  {
    id: 3,
    date: "2026-06-18",
    category: "life",
    title: "It's Me",
    caption: "last saturday",
    images: ["images/posts/p4.jpg"],
    tags: ["life"]
  },

   {
    id: 5,
    date: "2026-06-20",
    category: "trip",
    title: "Turkey Run Hike",
    caption: "went for hiking after 15 miles kayaking",
    images: ["images/posts/t1.jpeg","images/posts/t2.jpeg","images/posts/t3.jpeg","images/posts/t4.jpeg","images/posts/t5.jpeg"],
    tags: ["life"]
  }

];
