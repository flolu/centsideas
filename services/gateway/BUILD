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
      "@npm//@types/jsonwebtoken",
      "@npm//reflect-metadata",
      "@npm//@types/body-parser",
      "@npm//@types/cors",
      "@npm//@types/express",
      "@npm//@types/jest",
      "@npm//jest",
      "@npm//nodemon",
      "@npm//rimraf",
      "@npm//ts-node",
      "@npm//typescript",
    ],
)