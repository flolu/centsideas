load("@build_bazel_rules_nodejs//:index.bzl", "pkg_web")
load(":tools/ngsw_config.bzl", _ngsw_config = "ngsw_config")

def pkg_pwa(
        name,
        srcs,
        index_html,
        ngsw_config,
        additional_root_paths = []):
    pkg_web(
        name = "%s_web" % name,
        srcs = srcs + ["@npm//:node_modules/@angular/service-worker/ngsw-worker.js", "@npm//:node_modules/zone.js/dist/zone.min.js"],
        additional_root_paths = additional_root_paths + ["npm/node_modules/@angular/service-worker"],
        visibility = ["//visibility:private"],
    )

    _ngsw_config(
        name = name,
        src = ":%s_web" % name,
        config = ngsw_config,
        index_html = index_html,
        tags = ["app"],
    )
