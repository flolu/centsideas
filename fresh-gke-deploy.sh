gcloud beta container --project "centsideas" clusters create "centsideas" --zone "europe-west3-b" --no-enable-basic-auth --machine-type "n1-standard-1" --disk-size "10" && \
gcloud container clusters get-credentials centsideas --zone europe-west3-b --project centsideas && \

helm repo add stable https://kubernetes-charts.storage.googleapis.com/ && \
helm repo add jetstack https://charts.jetstack.io/ && \
helm repo update && \

kubectl create clusterrolebinding cluster-admin-binding --clusterrole cluster-admin --user $(gcloud config get-value account) && \
helm install nginx-ingress stable/nginx-ingress && \

kubectl apply --validate=false -f https://raw.githubusercontent.com/jetstack/cert-manager/v0.13.0/deploy/manifests/00-crds.yaml && \
kubectl create namespace cert-manager && \
helm install cert-manager jetstack/cert-manager --namespace cert-manager && \

yarn deploy