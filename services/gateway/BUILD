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
      "//packages/models:lib",
      "//packages/utils:lib",
      "@npm//axios",
      "@npm//body-parser",
      "@npm//cors",
      "@npm//express",
      "@npm//inversify",
      "@npm//jsonwebtoken",
      "@npm//@types/jsonwebtoken",
      "@npm//reflect-metadata",
      "@npm//@types/body-parser",
      "@npm//@types/cors",
      "@npm//@types/express",
      "@npm//@types/jest",
      "@npm//jest",
      "@npm//nodemon",
      "@npm//rimraf",
      "@npm//ts-node",
      "@npm//typescript",
    ],
)

load("@io_bazel_rules_docker//nodejs:image.bzl", "nodejs_image")
nodejs_image(
    name = "image",
    data = [":lib"],
    entry_point = ":index.ts",
)

load("@io_bazel_rules_docker//container:container.bzl", "container_push")
container_push(
   name = "push",
   image = ":image",
   format = "Docker",
   registry = "gcr.io",
   repository = "cents-ideas/gateway",
   tag = "experimenting",
)