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
      "@npm//reflect-metadata",
      "@npm//module-alias",

      "@npm//@types/express",
      "@npm//@types/body-parser",
      "@npm//@types/jsonwebtoken",
      "@npm//@types/cors",
    ],
)

load("@io_bazel_rules_docker//nodejs:image.bzl", "nodejs_image")
nodejs_image(
    name = "image",
    data = [":lib", "//:package.json"],
    entry_point = ":index.ts",
)

load("@k8s_deploy//:defaults.bzl", "k8s_deploy")
k8s_deploy(
  name = "k8s",
  template = ":gateway.yaml",
  images = {
    "gcr.io/cents-ideas/gateway:latest": ":image"
  },
)