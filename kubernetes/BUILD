package(default_visibility = ["//visibility:public"])

load("@io_bazel_rules_k8s//k8s:objects.bzl", "k8s_objects")
load("@io_bazel_rules_k8s//k8s:object.bzl", "k8s_object")

k8s_object(
  name = "kafka_deployment",
  kind = "deployment",
  cluster = "gke_cents-ideas_europe-west3-b_cents-ideas",
  template = ":kafka/kafka.yaml",
)
k8s_object(
  name = "zookeeper_deployment",
  kind = "deployment",
  cluster = "gke_cents-ideas_europe-west3-b_cents-ideas",
  template = ":kafka/zookeeper.yaml",
)
k8s_objects(
    name = "kafka",
    objects = [
        ":kafka_deployment",
        ":zookeeper_deployment",
    ]
)

k8s_object(
  name = "nginx_admin_binding",
  kind = "deployment",
  cluster = "gke_cents-ideas_europe-west3-b_cents-ideas",
  template = ":nginx/admin-binding.yaml",
)
k8s_object(
  name = "nginx_cloud_generic",
  kind = "deployment",
  cluster = "gke_cents-ideas_europe-west3-b_cents-ideas",
  template = ":nginx/cloud-generic.yaml",
)
k8s_object(
  name = "nginx_mandatory",
  kind = "deployment",
  cluster = "gke_cents-ideas_europe-west3-b_cents-ideas",
  template = ":nginx/mandatory.yaml",
)
k8s_objects(
    name = "nginx",
    objects = [
        ":nginx_admin_binding",
        ":nginx_cloud_generic",
        ":nginx_mandatory"
    ]
)

k8s_object(
  name = "k8s_database_storage",
  cluster = "gke_cents-ideas_europe-west3-b_cents-ideas",
  template = ":database-storage.yaml",
)

k8s_object(
  name = "k8s_config",
  cluster = "gke_cents-ideas_europe-west3-b_cents-ideas",
  template = ":config.yaml",
)

k8s_object(
  name = "k8s_ingress",
  cluster = "gke_cents-ideas_europe-west3-b_cents-ideas",
  template = ":ingress.yaml",
)
