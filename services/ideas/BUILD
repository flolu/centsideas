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
      "@npm//body-parser",
      "@npm//express",
      "@npm//inversify",
      "@npm//reflect-metadata",
      "@npm//shortid",
      "@npm//@types/body-parser",
      "@npm//@types/express",
      "@npm//@types/jest",
      "@npm//@types/shortid",
      "@npm//jest",
      "@npm//nodemon",
      "@npm//rimraf",
      "@npm//ts-jest",
      "@npm//ts-node",
      "@npm//typescript",
    ],
)