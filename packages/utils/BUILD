package(default_visibility = ["//visibility:public"])

load("@npm_bazel_typescript//:index.bzl", "ts_library")
ts_library(
    name = "lib",
    srcs = glob(
        include = ["**/*.ts"],
        exclude = ["**/*.spec.ts"]
    ),
    deps = [
      "//packages/models:lib",
      "//packages/enums:lib",

      "@npm//express",
      "@npm//inversify",
      "@npm//sanitize-html",
      "@npm//shortid",
      "@npm//uuid",
      "@npm//module-alias",

      "@npm//@types/uuid",
      "@npm//@types/express",
      "@npm//@types/sanitize-html",
      "@npm//@types/shortid",
      "@npm//@types/jest",
      "@npm//@types/module-alias",
    ],
    module_name = "@cents-ideas/utils",
)
