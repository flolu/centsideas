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
      "//packages/event-sourcing:lib",

      "@npm//@types/body-parser",
      "@npm//@types/express",

      "@npm//body-parser",
      "@npm//express",
      "@npm//inversify",
      "@npm//reflect-metadata",
      "@npm//shortid",
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
   repository = "cents-ideas/reviews",
   tag = "develop",
)

load("@k8s_deploy//:defaults.bzl", "k8s_deploy")
k8s_deploy(
  name = "k8s_deployment",
  template = ":reviews.deployment.yaml",
  images = {
    "gcr.io/cents-ideas/reviews:latest": ":image"
  },
)

k8s_deploy(
  name = "k8s_service",
  kind = "service",
  template = ":reviews.service.yaml",
)

k8s_deploy(
  name = "event_store_k8s_service",
  kind = "service",
  template = ":reviews-event-store.service.yaml",
)

k8s_deploy(
  name = "event_store_k8s_deployment",
  template = ":reviews-event-store.deployment.yaml",
)

k8s_objects(
    name = "k8s",
    objects = [
      ":k8s_deployment",
      ":k8s_service",
      ":event_store_k8s_deployment",
      ":event_store_k8s_service",
    ]
)