check-plat() {
  local plat="$(uname -s)"
  if [[ $plat != Linux ]]; then
    echo "System must be Linux, found: $plat" >&2
    return 1
  fi
}

check-plat

# git
sudo apt install git -y

# vscode
sudo snap install code --classic

# docker compose
sudo apt install docker-compose -y

# node.js
sudo apt install nodejs -y

# yarn
sudo apt install curl -y && \
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - && \
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list && \
sudo apt update && sudo apt install yarn

# bazel
sudo apt install python gcc -y
sudo yarn global add @bazel/buildifier --prefix /usr/local && \
sudo yarn global add @bazel/bazelisk --prefix /usr/local

# chromium and firefox
sudo snap install chromium && \
sudo snap install firefox

# microk8s and kubectl and helm
sudo snap install microk8s --classic && \
sudo snap alias microk8s.kubectl kubectl && \
# echo "alias kubectl='microk8s kubectl'" >> ~/.bash_aliases && \
sudo microk8s enable helm3 && \
sudo snap alias microk8s.helm3 helm && \
sudo usermod -a -G microk8s $USER && \
sudo chown -f -R $USER ~/.kube

# helm
sudo snap install helm --classic

# gcloud sdk
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && \
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add - && \
sudo apt-get update && sudo apt-get install google-cloud-sdk && \
gcloud init && \
gcloud auth configure-docker

# reenter password to activate sudo access to microk8s for current user
su - $USER

return 0