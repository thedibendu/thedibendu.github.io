/* ══════════════════════════════════════════════════════════════
   RESEARCH.JS  ·  Your research topics — edit entries here!
   ──────────────────────────────────────────────────────────────
   HOW TO ADD A NEW RESEARCH TOPIC:
   1. Copy the template block below (between the dashes)
   2. Fill in your details
   3. Save — research.html renders it automatically!
   4. Add a card in index.html linking to:
        research.html?topic=your-id

   VISUAL OPTIONS:
     "translocase" → DNA strand threaded through an ATPase ring
     "motor"       → conformational motor cycle
     "capsid"      → viral capsid + genome packaging motor
     "microscope"  → cryo-EM imaging / particle reconstruction
     "model"       → density map + fitted model
     "workflow"    → computational pipeline
══════════════════════════════════════════════════════════════ */

window.RESEARCH = [

  // ── ✦ TEMPLATE — copy this whole block for every new topic ──
  // {
  //   id:    "your-topic-id",              // used in the URL: ?topic=your-topic-id
  //   title: "Your Topic Title",
  //   lede:  "One sentence shown in the hero under the title.",
  //   visual: "translocase",               // visual type (see options above)
  //   chips:  ["Word1", "Word2", "Word3"], // three labels on the visual
  //   overview: {
  //     heading:    "A short, bold statement about this topic.",
  //     paragraphs: [
  //       "First paragraph of explanation.",
  //       "Second paragraph of explanation."
  //     ],
  //     stat: { value: "ATP", label: "short label shown under the stat" }
  //   },
  //   points: [
  //     { label: "Step One",   text: "What happens in this step." },
  //     { label: "Step Two",   text: "What happens in this step." },
  //     { label: "Step Three", text: "What happens in this step." }
  //   ],
  //   focus: [
  //     { label: "Question", text: "A research question this topic helps answer." },
  //     { label: "Readout",  text: "What data or structure tells you." }
  //   ],
  //   why:       "Why this research area matters.",
  //   next:      "next-topic-id",          // id of the topic the Next button links to
  //   nextLabel: "Next Topic Title"        // text shown on the Next button
  // },
  // ──────────────────────────────────────────────────────────

  {
    id:    "dna-translocases",
    title: "DNA Translocases",
    lede:  "DNA translocases are ATP-powered enzymes that convert coordinated nucleotide turnover into directional movement of DNA through protein channels and macromolecular assemblies.",
    visual: "translocase",
    chips:  ["Substrate", "ATPase", "Direction"],
    overview: {
      heading: "Moving genetic material is a nanoscale engineering problem.",
      paragraphs: [
        "DNA presents a difficult substrate: it is long, polyanionic, mechanically flexible, and frequently constrained by bound proteins or confined compartments. Translocases solve this problem by forming ordered DNA-binding paths and coupling ATP binding, hydrolysis, and product release to discrete mechanical states.",
        "Many DNA translocases are oligomeric ATPases, often organized as rings or pseudo-rings around nucleic acid. Individual subunits cycle through nucleotide states and reposition DNA-contacting elements, raising the central question of how local ATPase chemistry is phased across the assembly to produce vectorial motion.",
        "Structural biology can directly resolve DNA trajectories, pore-loop contacts, nucleotide occupancy, and asymmetric subunit conformations. Comparing trapped states helps assign which subunits grip DNA, which are primed for hydrolysis or product release, and how the motor advances along the substrate."
      ],
      stat: { value: "ATP", label: "chemical energy coupled to DNA movement" }
    },
    points: [
      { label: "Substrate engagement", text: "The motor must recognize and contact DNA without permanently locking onto it. Productive contacts often involve loops, channels, or positively charged surfaces." },
      { label: "Nucleotide coordination", text: "ATP binding and hydrolysis are not just fuel; they order the timing of conformational states across different motor subunits." },
      { label: "Directional stepping", text: "A useful structure can suggest whether motion is hand-over-hand, rotary, sequential, or driven by asymmetric subunit states." }
    ],
    focus: [
      { label: "Research question", text: "Which conformational state corresponds to DNA gripping, ATP hydrolysis, or DNA release?" },
      { label: "Structural readout", text: "DNA position, pore-loop geometry, nucleotide occupancy, and subunit asymmetry." }
    ],
    why:       "DNA translocation underlies genome segregation, recombination, repair, conjugation, and viral genome packaging. Defining these mechanisms explains how ATPase assemblies generate force while preserving specificity on a chemically repetitive substrate.",
    next:      "molecular-motors",
    nextLabel: "Molecular Motors"
  },

  {
    id:    "molecular-motors",
    title: "Molecular Motors",
    lede:  "Molecular motors are dynamic protein assemblies that convert chemical potential, most often from ATP, into directed conformational changes, force generation, and mechanical work.",
    visual: "motor",
    chips:  ["State 1", "State 2", "Work"],
    overview: {
      heading: "Biology uses moving parts, not just static structures.",
      paragraphs: [
        "A molecular motor is a protein system in which conformational changes are organized into a repeatable mechanochemical cycle. Those transitions can translate, rotate, remodel, package, segregate, or otherwise reposition biological substrates.",
        "Across motor families, chemical events reshape the free-energy landscape of the protein and its substrate-bound complex. Directionality emerges when conformational transitions, substrate affinity, and product release are coordinated so that Brownian motion is rectified into productive work.",
        "For structural biology, a single endpoint rarely defines mechanism. Interpretable models come from comparing nucleotide- and substrate-dependent states such as ATP-bound, ADP-bound, apo, pre-hydrolysis, post-hydrolysis, inhibited, or transition-state-like conformations."
      ],
      stat: { value: "nm", label: "motion measured at the nanometer scale" }
    },
    points: [
      { label: "Energy landscape", text: "ATP binding and hydrolysis shift which conformations are favorable, creating opportunities for motion." },
      { label: "Allostery", text: "A change at one site can be transmitted across the protein, coordinating distant domains or neighboring subunits." },
      { label: "Mechanical output", text: "The final output can be translation, rotation, bending, substrate remodeling, or force generation." }
    ],
    focus: [
      { label: "Research question", text: "How are chemical states converted into a mechanical cycle with directionality?" },
      { label: "Structural readout", text: "Domain rotations, subunit asymmetry, nucleotide pockets, and substrate-binding interfaces." }
    ],
    why:       "Molecular motors provide a structural framework for understanding energy coupling in biology. Their mechanisms connect ATPase chemistry to large-scale conformational change in systems ranging from chromosome maintenance and membrane remodeling to viral genome packaging.",
    next:      "viral-dna-packaging",
    nextLabel: "Viral DNA Packaging"
  },

  {
    id:    "viral-dna-packaging",
    title: "Viral DNA Packaging",
    lede:  "Double-stranded DNA viruses package their genomes into preassembled capsids using powerful ATPase motors that translocate DNA through a portal channel against increasing confinement.",
    visual: "capsid",
    chips:  ["Capsid", "Portal", "Genome"],
    overview: {
      heading: "A virus has to solve a packing problem under pressure.",
      paragraphs: [
        "Many double-stranded DNA viruses build a precursor capsid before genome encapsidation. The packaging motor then actively translocates DNA into this confined volume, where bending stress, electrostatic repulsion, and internal pressure increase as the capsid fills.",
        "In tailed bacteriophages and related viruses, DNA enters through a specialized portal vertex. A terminase ATPase complex docks at this portal and couples ATP turnover to DNA gripping, release, and forward translocation through the portal channel.",
        "The motor must coordinate ATPase subunits, DNA contacts, portal coupling, and capsid geometry without losing register on the genome. Structural studies define how the terminase, portal, DNA, and capsid are aligned and how conformational changes are positioned to transmit force."
      ],
      stat: { value: "High", label: "force generation under genome confinement" }
    },
    points: [
      { label: "Procapsid assembly", text: "A protein shell forms before the genome is fully packaged, creating a confined target chamber." },
      { label: "Portal coupling", text: "The motor docks at a specialized portal complex that acts as the entry channel for DNA." },
      { label: "Genome compaction", text: "As packaging proceeds, the motor works against rising internal pressure and DNA-DNA repulsion." }
    ],
    focus: [
      { label: "Research question", text: "How does the ATPase motor coordinate with the portal and capsid during packaging?" },
      { label: "Structural readout", text: "Portal symmetry, motor docking geometry, DNA path, and conformational state of the ATPase." }
    ],
    why:       "Viral DNA packaging motors are among the strongest biological motors known and provide tractable systems for studying ATP-driven force generation, nucleic-acid translocation, and the ordered assembly of large viral machines.",
    next:      "cryo-em",
    nextLabel: "Cryo-EM"
  },

  {
    id:    "cryo-em",
    title: "Cryo-Electron Microscopy",
    lede:  "Single-particle cryo-EM images vitrified macromolecules in many orientations and reconstructs three-dimensional density maps from large ensembles of low-dose particle projections.",
    visual: "microscope",
    chips:  ["Grid", "Particles", "3D Map"],
    overview: {
      heading: "Cryo-EM turns many noisy molecular images into a 3D structure.",
      paragraphs: [
        "In single-particle cryo-EM, purified complexes are rapidly vitrified in a thin aqueous film. Vitrification preserves particles in a hydrated, native-like environment while immobilizing them for imaging in the electron microscope.",
        "Each micrograph contains many low-contrast projections recorded under electron-dose limits that minimize radiation damage. Image processing corrects motion and optics, identifies particles, estimates orientations, classifies structural heterogeneity, and reconstructs a three-dimensional Coulomb-potential map.",
        "For molecular motors, cryo-EM is especially powerful because conformational and compositional heterogeneity can be separated computationally. Distinct ATPase states, substrate-bound states, or assembly intermediates can therefore be analyzed rather than collapsed into a single average."
      ],
      stat: { value: "3D", label: "density maps reconstructed from 2D particle images" }
    },
    points: [
      { label: "Vitrification", text: "Rapid freezing traps particles in glass-like ice and limits damage from drying or crystallization." },
      { label: "Low-dose imaging", text: "Electrons reveal structure but also damage samples, so images are collected with carefully limited exposure." },
      { label: "Classification", text: "Computational sorting can reveal multiple conformations, assemblies, or compositional states." }
    ],
    focus: [
      { label: "Research question", text: "Which structural states are present in the particle population?" },
      { label: "Structural readout", text: "2D classes, 3D reconstructions, local resolution, map quality, and conformational variability." }
    ],
    why:       "Cryo-EM links biochemical state to structural mechanism by resolving macromolecular assemblies in multiple conformations, including large or flexible complexes that are difficult to crystallize.",
    next:      "model-building",
    nextLabel: "Model Building"
  },

  {
    id:    "model-building",
    title: "Model Building",
    lede:  "Model building converts cryo-EM density into an atomic interpretation that can be tested against sequence, chemistry, map quality, and mechanistic hypotheses.",
    visual: "model",
    chips:  ["Map", "Fit", "Validate"],
    overview: {
      heading: "A map becomes useful when it can explain chemistry.",
      paragraphs: [
        "A cryo-EM reconstruction provides experimental density, but mechanistic interpretation usually requires a chemically sensible atomic or near-atomic model. Model building assigns residues, nucleic acids, ligands, domains, and interfaces to features in the map.",
        "The process integrates sequence registration, homologous or predicted starting models, rigid-body fitting, manual rebuilding, real-space refinement, and validation. A credible model must agree with the density while maintaining stereochemistry, plausible contacts, and appropriate restraint against overfitting.",
        "For ATP-driven DNA motors, model building can identify pore-loop and backbone contacts, nucleotide coordination geometry, catalytic-site organization, and interfaces that stabilize specific motor states."
      ],
      stat: { value: "Fit", label: "atomic interpretation inside experimental density" }
    },
    points: [
      { label: "Dock", text: "Known domains, predicted models, or homologous structures are placed into the density map." },
      { label: "Refine", text: "Coordinates are adjusted to improve map fit while maintaining stereochemistry and realistic geometry." },
      { label: "Validate", text: "Map-model fit, clashes, geometry, and biological plausibility are checked before drawing conclusions." }
    ],
    focus: [
      { label: "Research question", text: "Which atomic contacts explain the observed biochemical or mechanical state?" },
      { label: "Structural readout", text: "Residue placement, interface geometry, ligand density, map-model agreement, and validation metrics." }
    ],
    why:       "Model building is where structural maps become mechanistic arguments. Accurate atomic interpretation makes it possible to test how DNA contacts, ATPase active sites, and intersubunit interfaces support motor function.",
    next:      "computational-workflows",
    nextLabel: "Computational Workflows"
  },

  {
    id:    "computational-workflows",
    title: "Computational Workflows",
    lede:  "Modern cryo-EM relies on reproducible computational workflows that preserve provenance from raw movies through particle metadata, reconstructions, models, validation, and figures.",
    visual: "workflow",
    chips:  ["Data", "Scripts", "Figures"],
    overview: {
      heading: "Good science needs workflows that can be repeated.",
      paragraphs: [
        "Cryo-EM projects generate raw movies, motion-corrected micrographs, CTF estimates, particle stacks, metadata tables, classification jobs, maps, masks, models, plots, and many processing decisions. Without provenance, it becomes difficult to determine which result came from which dataset, parameter set, or software version.",
        "A computational workflow makes analysis traceable and repeatable. Scripts, structured directories, and documented parameters can standardize routine steps, reduce manual bookkeeping, and connect intermediate outputs to final structural conclusions.",
        "For structural biology, the most useful workflows bridge particle metadata, map processing, model refinement, validation, visualization, and figure generation. That continuity helps preserve interpretability from raw data to publication-ready models."
      ],
      stat: { value: "Repro", label: "organized steps from raw data to interpretable structure" }
    },
    points: [
      { label: "Track", text: "Keep datasets, parameters, software versions, maps, models, and outputs linked to each analysis step." },
      { label: "Automate", text: "Use Python, shell scripts, and structured folders to reduce repetitive manual work." },
      { label: "Report", text: "Transform processing outputs into clear summaries, validation tables, and publication-ready figures." }
    ],
    focus: [
      { label: "Research question", text: "How can complex structural data be processed reproducibly without losing interpretability?" },
      { label: "Computational readout", text: "Traceable metadata, consistent scripts, validation summaries, and reusable analysis notebooks." }
    ],
    why:       "Computational workflows protect the interpretability of structural biology projects. They make processing choices auditable, comparisons between states more reliable, and final figures and validation tables easier to reproduce.",
    next:      "dna-translocases",
    nextLabel: "DNA Translocases"
  }

];
