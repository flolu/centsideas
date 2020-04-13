store_srcs_matcher = [
    "*.actions.ts",
    "*.effects.ts",
    "*.reducer.ts",
    "*.state.ts",
    "*.selectors.ts",
]

static_assets = [
    ":_index.html",
    ":manifest.webmanifest",
    ":styles.css",
    "@npm//:node_modules/zone.js/dist/zone.min.js",
]

inserted_assets = [
    ":styles.css",
    "@npm//:node_modules/zone.js/dist/zone.min.js",
]
