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
      "@npm//@types/mongodb",
      "@npm//@types/jsonwebtoken",
      "@npm//@types/faker",

      "@npm//body-parser",
      "@npm//express",
      "@npm//inversify",
      "@npm//reflect-metadata",
      "@npm//shortid",
      "@npm//mongodb",
      "@npm//jsonwebtoken",
      "@npm//faker",
    ],
)

# // TODO implement bazel tests
# // TODO add nodejs_binary dev servers

# // TODO maybe replace nodejs_image with nodejs_binary
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
   repository = "cents-ideas/users",
   tag = "experimenting",
)
