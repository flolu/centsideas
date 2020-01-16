package(default_visibility = ["//visibility:public"])

load("@npm_bazel_typescript//:index.bzl", "ts_library")

ts_library(
    name = "lib",
    srcs = glob(
        include = ["**/*.ts"],
        exclude = ["**/*.spec.ts"]
    ),
    deps = [
      "//packages/enums:lib",
      "//packages/event-sourcing:lib",
      "//packages/utils:lib",
      "//packages/models:lib",

      "@npm//@types/body-parser",
      "@npm//@types/express",
      "@npm//@types/mongodb",
      "@npm//@types/async-retry",

      "@npm//async-retry",
      "@npm//body-parser",
      "@npm//express",
      "@npm//inversify",
      "@npm//mongodb",
      "@npm//reflect-metadata",
    ],
)

load("@io_bazel_rules_docker//nodejs:image.bzl", "nodejs_image")
nodejs_image(
    name = "image",
    data = [":lib", "//:package.json"],
    entry_point = ":index.ts",
)

load("@io_bazel_rules_docker//container:container.bzl", "container_push")
container_push(
   name = "push",
   image = ":image",
   format = "Docker",
   registry = "gcr.io",
   repository = "cents-ideas/consumer",
   tag = "experimenting",
)