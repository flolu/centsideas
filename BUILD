package(default_visibility = ["//visibility:public"])

exports_files([
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