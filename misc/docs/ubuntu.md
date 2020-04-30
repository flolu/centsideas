# Develop on Ubuntu

## If you want to get started as quickly as possible, just run the script `~/misc/scripts/ubuntu-installs.sh`

## Required

- [Git](https://github.com/git/git) - version control

  ```bash
  sudo apt install git -y
  ```

- [Visual Studio Code](https://github.com/Microsoft/vscode) - text editor

  ```bash
  sudo snap install code --classic
  ```

  To get my VSCode settings you can install the [Settings Sync](https://marketplace.visualstudio.com/items?itemName=Shan.code-settings-sync) extension.
  Then hit `CTRL + SHIFT + P` and enter `Sync: Download Settings`. Enter the following ID `6c4dfda01f083d7f104a2a8f51c8f452` and the settings will be installed. (The settings will be pull from [this](https://gist.github.com/flolu/6c4dfda01f083d7f104a2a8f51c8f452) Github Gist)

- [Docker Compose](https://github.com/docker/compose) - run multiple docker containers simultaneously

  ```
  sudo apt install docker-compose -y
  ```

- [Node.js](https://nodejs.org) - server side javascript runtime

  ```bash
  sudo apt install nodejs -y
  ```

- [Yarn](https://github.com/yarnpkg/yarn) - node package manager

  ```bash
  sudo apt install curl -y && \
  curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - && \
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list && \
  sudo apt update && sudo apt install yarn
  ```

- [Bazel](https://github.com/bazelbuild/bazel) - test and build automation

  ```bash
  sudo apt install python gcc -y
  sudo yarn global add @bazel/buildifier --prefix /usr/local && \
  sudo yarn global add @bazel/bazelisk --prefix /usr/local
  ```

## Optional

- [Chromium](https://github.com/chromium/chromium) and [Firefox](https://www.mozilla.org/en-US/firefox/new) - web browsers

  ```bash
  sudo snap install chromium && \
  sudo snap install firefox
  ```

- [MicroK8s](https://github.com/ubuntu/microk8s) and [kubectl](https://github.com/kubernetes/kubectl) and [Helm](https://github.com/helm/helm)- lightweight kubernetes for development

# TODO try `alias kubectl='microk8s kubectl'` instead (https://microk8s.io/docs/)

```bash
sudo snap install microk8s --classic && \
echo "alias kubectl='microk8s kubectl'" >> ~/.bash_aliases && \
microk8s enable helm3 && \
sudo snap alias microk8s.helm3 helm && \
sudo usermod -a -G microk8s $USER && \
sudo chown -f -R $USER ~/.kube && \
su - $USER
```

- [Google Cloud SDK](https://cloud.google.com/sdk/) - cli for google cloud

  ```bash
  echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && \
  curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add - && \
  sudo apt-get update && sudo apt-get install google-cloud-sdk && \
  gcloud init && \
  gcloud auth configure-docker
  ```
