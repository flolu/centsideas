package(default_visibility = ["//visibility:public"])

load("@io_bazel_rules_k8s//k8s:objects.bzl", "k8s_objects")
load("@k8s_deploy//:defaults.bzl", "k8s_deploy")

k8s_deploy(
  name = "kafka",
  template = ":kafka.yaml",
)

k8s_deploy(
  name = "certificate_issuer",
  template = ":certificate-issuer.yaml",
)

k8s_deploy(
  name = "nginx_admin_binding",
  template = ":nginx-ingress/admin-binding.yaml",
)
k8s_deploy(
  name = "nginx_cloud_generic",
  template = ":nginx-ingress/cloud-generic.yaml",
)
k8s_deploy(
  name = "nginx_mandatory",
  template = ":nginx-ingress/mandatory.yaml",
)
k8s_objects(
    name = "nginx",
    # order is important
    objects = [
        ":nginx_admin_binding",
        ":nginx_mandatory",
        ":nginx_cloud_generic",
    ]
)

k8s_deploy(
  name = "database_storage",
  template = ":database-storage.yaml",
)

k8s_deploy(
  name = "config",
  template = ":config.yaml",
)

k8s_deploy(
  name = "ingress",
  template = ":ingress.yaml",
)