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
      "@npm//inversify",
      "@npm//@types/inversify",
      "@npm//async-retry",
      "@npm//@types/async-retry",
      "@npm//mongodb",
      "@npm//@types/mongodb",
      "@npm//kafkajs",
      "@npm//@types/kafkajs",
    ],
    module_name = "@cents-ideas/event-sourcing",
)

