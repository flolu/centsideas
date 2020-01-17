package(default_visibility = ["//visibility:public"])

load("@npm_bazel_typescript//:index.bzl", "ts_library")

ts_library(
    name = "lib",
    srcs = glob(
        include = ["**/*.ts"],
        exclude = ["**/*.spec.ts"]
    ),
    deps = [
      "//packages/utils:lib",
      "//packages/enums:lib",

      "@npm//@types/inversify",
      "@npm//@types/async-retry",
      "@npm//@types/mongodb",
      "@npm//@types/kafkajs",

      "@npm//inversify",
      "@npm//async-retry",
      "@npm//mongodb",
      "@npm//kafkajs",
    ],
    module_name = "@cents-ideas/event-sourcing",
)

