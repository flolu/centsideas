# TODO read from .env file
GOOGLE_CLOUD_PROJECT_ID = "centsideas"

CLUSTER_ZONE = "europe-west3-b"

CLUSTER_NAME = "cents-ideas"

KUBERNETES_CLUSTER = "_".join([
    "gke",
    GOOGLE_CLOUD_PROJECT_ID,
    CLUSTER_ZONE,
    CLUSTER_NAME,
])

# TODO also make configurable for deployment yaml's
CONTAINER_REGISTRY_HOST = "gcr.io"
CONTAINER_REGISTRY = CONTAINER_REGISTRY_HOST + "/" + GOOGLE_CLOUD_PROJECT_ID
