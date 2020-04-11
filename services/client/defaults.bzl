load("@build_bazel_rules_nodejs//:index.bzl", "pkg_web")
load("@npm//@babel/cli:index.bzl", "babel")
load("//services/client:ngsw_config.bzl", _ngsw_config = "ngsw_config")
load("@npm//html-insert-assets:index.bzl", _html_insert_assets = "html_insert_assets")

store_srcs_matcher = [
    "*.actions.ts",
    "*.effects.ts",
    "*.reducer.ts",
    "*.state.ts",
    "*.selectors.ts",
]

static_assets = [
    "@npm//:node_modules/zone.js/dist/zone.min.js",
    ":styles.css",
    "favicon.ico",
    "manifest.webmanifest",
]

bundle_assets = [
    ":bundle_es2015.min",
    #":bundle_es5.min",
]

root_paths = [
    "npm/node_modules/core-js/client",
    "npm/node_modules/systemjs/dist",
]

def html_insert_assets(
        name,
        asset_args,
        assets,
        index_html = ":_index.html",
        outs = ["index.html"]):
    _html_insert_assets(
        name = name,
        outs = outs,
        args = [
            "--html=$(execpath %s)" % index_html,
            "--out=$@",
            "--roots=. $(RULEDIR)",
            "--assets",
        ] + asset_args,
        data = [index_html] + assets,
    )

def babel_bundle_es5(name, src):
    babel(
        name = name,
        args = [
            "$(execpath %s)" % src,
            "--no-babelrc",
            "--source-maps",
            "--presets=@babel/preset-env",
            "--out-dir",
            "$(@D)",
        ],
        data = [
            src,
            "@npm//@babel/preset-env",
        ],
        output_dir = True,
    )

def pkg_pwa(
        name,
        additional_root_paths,
        srcs,
        index_html,
        ngsw_config):
    pkg_web(
        name = "%s_app" % name,
        srcs = static_assets + srcs,
        additional_root_paths = additional_root_paths,
        visibility = ["//visibility:private"],
    )

    _ngsw_config(
        name = name,
        src = ":%s_app" % name,
        config = ngsw_config,
        index_html = index_html,
        tags = ["app"],
    )
