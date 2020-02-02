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

      "@npm//@types/express",
      "@npm//@types/body-parser",
      "@npm//@types/jsonwebtoken",
      "@npm//@types/cors",

      "@npm//axios",
      "@npm//body-parser",
      "@npm//cors",
      "@npm//express",
      "@npm//inversify",
      "@npm//jsonwebtoken",
      "@npm//reflect-metadata",
      "@npm//module-alias",
    ],
)

load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")
nodejs_binary(
    name = "dev",
    data = [":lib", "//:package.json"],
    entry_point = ":index.ts",
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
   repository = "cents-ideas/gateway",
   tag = "develop",
)

load("@k8s_deploy//:defaults.bzl", "k8s_deploy")
k8s_deploy(
  name = "k8s_deployment",
  template = ":gateway.deployment.yaml",
  images = {
    "gcr.io/cents-ideas/gateway:latest": ":image"
  },
)

k8s_deploy(
  name = "k8s_service",
  kind = "service",
  template = ":gateway.service.yaml",
)

k8s_objects(
  name = "k8s",
  objects = [
    ":k8s_deployment",
    ":k8s_service",
  ]
)