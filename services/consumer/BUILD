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
   repository = "cents-ideas/consumer",
   tag = "develop",
)

load("@io_bazel_rules_k8s//k8s:object.bzl", "k8s_object")
k8s_object(
  name = "k8s_deployment",
  template = ":consumer.deployment.yaml",
  kind = "deployment",
  cluster = "gke_cents-ideas_europe-west3-b_cents-ideas",
  images = {
    "gcr.io/cents-ideas/consumer:latest": ":image"
  },
)

k8s_object(
  name = "k8s_service",
  kind = "service",
  cluster = "gke_cents-ideas_europe-west3-b_cents-ideas",
  template = ":consumer.service.yaml",
)

k8s_object(
  name = "projection_database_k8s_service",
  kind = "service",
  cluster = "gke_cents-ideas_europe-west3-b_cents-ideas",
  template = ":projection-database.service.yaml",
)

k8s_object(
  name = "projection_database_k8s_deployment",
  kind = "deployment",
  cluster = "gke_cents-ideas_europe-west3-b_cents-ideas",
  template = ":projection-database.deployment.yaml",
)

load("@io_bazel_rules_k8s//k8s:objects.bzl", "k8s_objects")
k8s_objects(
    name = "k8s",
    objects = [
      ":k8s_deployment",
      ":k8s_service",
      ":projection_database_k8s_deployment",
      ":projection_database_k8s_service",
    ]
)