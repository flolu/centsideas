package(default_visibility = ["//visibility:public"])

exports_files([
    "package.json",
    "tsconfig.json",
    "jest.config.js"
])

load("@npm_bazel_typescript//:index.bzl", "ts_config")
ts_config(
    name = "tsconfig.jest.json",
    src = "tsconfig.test.json",
    deps = [
        ":tsconfig.json",
    ],
)

load("@io_bazel_rules_k8s//k8s:objects.bzl", "k8s_objects")
# TODO config, kafka, zookeeper, database-storage, ingress, tsl-secret

k8s_objects(
    name = "kubernetes",
    objects = [
        "//services/consumer:k8s",
        "//services/gateway:k8s",
        "//services/ideas:k8s",
        "//services/reviews:k8s",
        "//services/users:k8s",
    ]
)