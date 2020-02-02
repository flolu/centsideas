package(default_visibility = ["//visibility:public"])

exports_files([
    "package.json",
    "tsconfig.json",
    "jest.config.js"
])

load("@npm_bazel_typescript//:index.bzl", "ts_config")
ts_config(
    name = "tsconfig.jest.json",
    src = "tsconfig.test.json",
    deps = [
        ":tsconfig.json",
    ],
)

load("@io_bazel_rules_k8s//k8s:objects.bzl", "k8s_objects")
k8s_objects(
   name = "deployments",
   objects = [
      "//services/ideas:deployment",
   ]
)
