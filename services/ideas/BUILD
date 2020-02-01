package(default_visibility = ["//visibility:public"])

lib_deps = [
    "//packages/enums:lib",
    "//packages/models:lib",
    "//packages/utils:lib",
    "//packages/event-sourcing:lib",

    "@npm//@types/body-parser",
    "@npm//@types/express",
    "@npm//@types/jest",

    "@npm//body-parser",
    "@npm//express",
    "@npm//inversify",
    "@npm//reflect-metadata",
    "@npm//shortid",
    "@npm//module-alias",
]

load("@npm_bazel_typescript//:index.bzl", "ts_library")
ts_library(
    name = "lib",
    srcs = glob(
        include = ["**/*.ts"],
        exclude = ["**/*.spec.ts"]
    ),
    deps = lib_deps,
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
   repository = "cents-ideas/ideas",
   tag = "develop",
)

load("@npm_bazel_typescript//:index.bzl", "ts_library")
lib_deps.insert(0, ":lib")
ts_library(
    name = "test_lib",
    srcs = glob(include = ["**/*.spec.ts"]),
    tsconfig = "//:tsconfig.jest.json",
    deps = lib_deps
)

filegroup(
    name = "test_lib.js",
    srcs = [":test_lib"],
    output_group = "es5_sources",
)
load("@cents_ideas//:jest.bzl", "jest_test")

jest_test(
    name = "test",
    srcs = [":test_lib.js"],
    jest_config = "//:jest.config.js",
    deps = [":lib"],
)

load("@io_bazel_rules_k8s//k8s:object.bzl", "k8s_object")
k8s_object(
  name = "k8s",
  kind = "deployment",
  namespace = "default",
  template = ":ideas.yaml",
  cluster = "cents-ideas"
  images = {
    "gcr.io/cents-ideas/ideas:dev": "//services/ideas:image"
  },
)