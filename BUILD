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
load("@io_bazel_rules_k8s//k8s:object.bzl", "k8s_object")
# TODO config,database-storage, ingress, tsl-secret

k8s_object(
  name = "kafka_deployment",
  kind = "deployment",
  cluster = "gke_cents-ideas_europe-west3-a_cents-ideas",
  template = "//kubernetes:kafka.yaml",
)
k8s_object(
  name = "zookeeper_deployment",
  kind = "deployment",
  cluster = "gke_cents-ideas_europe-west3-a_cents-ideas",
  template = "//kubernetes:zookeeper.yaml",
)

k8s_object(
  name = "k8s_database_storage",
  cluster = "gke_cents-ideas_europe-west3-a_cents-ideas",
  template = "//kubernetes:gcp/database-storage.yaml",
)
k8s_object(
  name = "k8s_config",
  cluster = "gke_cents-ideas_europe-west3-a_cents-ideas",
  template = "//kubernetes:gcp/config.yaml",
)
k8s_object(
  name = "k8s_ingress",
  cluster = "gke_cents-ideas_europe-west3-a_cents-ideas",
  template = "//kubernetes:gcp/ingress.yaml",
)

k8s_objects(
    name = "kubernetes",
    objects = [
        ":kafka_deployment",
        ":zookeeper_deployment",
        ":k8s_database_storage",
        ":k8s_config",
        ":k8s_ingress",
        "//services/consumer:k8s",
        "//services/gateway:k8s",
        "//services/ideas:k8s",
        "//services/reviews:k8s",
        "//services/users:k8s",
    ]
)