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
      "@npm//async-retry",
      "@npm//@types/async-retry",
      "@npm//body-parser",
      "@npm//express",
      "@npm//inversify",
      "@npm//mongodb",
      "@npm//reflect-metadata",
      "@npm//@types/body-parser",
      "@npm//@types/express",
      "@npm//@types/jest",
      "@npm//@types/mongodb",
      "@npm//jest",
      "@npm//nodemon",
      "@npm//rimraf",
      "@npm//ts-node",
      "@npm//typescript",
    ],
)