workspace(name = 'cents_ideas')

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
load("@bazel_tools//tools/build_defs/repo:git.bzl", "git_repository")

http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "e1a0d6eb40ec89f61a13a028e7113aa3630247253bcb1406281b627e44395145",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/1.0.1/rules_nodejs-1.0.1.tar.gz"],
)

load("@build_bazel_rules_nodejs//:index.bzl", "node_repositories","yarn_install")
node_repositories(package_json = ["//:package.json"])
yarn_install(
    name = "npm",
    package_json = "//:package.json",
    yarn_lock = "//:yarn.lock",
    symlink_node_modules = False
)

load("@npm//:install_bazel_dependencies.bzl", "install_bazel_dependencies")
install_bazel_dependencies()

load("@npm_bazel_typescript//:index.bzl", "ts_setup_workspace")
ts_setup_workspace()

# docker
http_archive(
    name = "io_bazel_rules_docker",
    sha256 = "df13123c44b4a4ff2c2f337b906763879d94871d16411bf82dcfeba892b58607",
    strip_prefix = "rules_docker-0.13.0",
    urls = ["https://github.com/bazelbuild/rules_docker/releases/download/v0.13.0/rules_docker-v0.13.0.tar.gz"],
)
load("@io_bazel_rules_docker//repositories:repositories.bzl", container_repositories = "repositories")
container_repositories()
load("@io_bazel_rules_docker//nodejs:image.bzl", _nodejs_image_repos = "repositories")
_nodejs_image_repos()

# kubernetes
http_archive(
    name = "io_bazel_rules_k8s",
    sha256 = "cc75cf0d86312e1327d226e980efd3599704e01099b58b3c2fc4efe5e321fcd9",
    strip_prefix = "rules_k8s-0.3.1",
    urls = ["https://github.com/bazelbuild/rules_k8s/releases/download/v0.3.1/rules_k8s-v0.3.1.tar.gz"],
)
load("@io_bazel_rules_k8s//k8s:k8s.bzl", "k8s_repositories")
k8s_repositories()