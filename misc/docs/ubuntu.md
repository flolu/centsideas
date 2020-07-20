# Development on Ubuntu

[Git](https://github.com/git/git) - version control

```bash
sudo apt install git -y && \
git config --global user.email "email@mail.com" && \
git config --global user.name "username" && \
```

[Visual Studio Code](https://github.com/Microsoft/vscode) - text editor

```bash
sudo snap install code --classic
```

To get my VSCode settings you can install the [Settings Sync](https://marketplace.visualstudio.com/items?itemName=Shan.code-settings-sync) extension.
Then hit `CTRL + SHIFT + P` and enter `Sync: Download Settings`. Enter the following ID `6c4dfda01f083d7f104a2a8f51c8f452` and the settings will be installed. (The settings will be pull from [this](https://gist.github.com/flolu/6c4dfda01f083d7f104a2a8f51c8f452) Github Gist)

[Docker Compose](https://github.com/docker/compose) - run multiple docker containers simultaneously

```
sudo apt install docker-compose -y && \
sudo gpasswd -a $USER docker && \
newgrp docker
```

[Node.js](https://nodejs.org) - server side javascript runtime

```bash
sudo apt install nodejs -y
```

[Yarn](https://github.com/yarnpkg/yarn) - node package manager

```bash
sudo apt install curl -y && \
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - && \
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list && \
sudo apt update && sudo apt install yarn
```

[Bazel](https://github.com/bazelbuild/bazel) - test and build automation

```bash
sudo apt install python gcc -y
sudo yarn global add @bazel/buildifier --prefix /usr/local && \
sudo yarn global add @bazel/bazelisk --prefix /usr/local
```

[Chromium](https://github.com/chromium/chromium) and [Firefox](https://www.mozilla.org/en-US/firefox/new) - web browsers

```bash
sudo snap install chromium && \
sudo snap install firefox
```

[MicroK8s](https://github.com/ubuntu/microk8s) - lightweight kubernetes for development

```bash
sudo snap install microk8s --classic && \
sudo snap alias microk8s.kubectl kubectl && \
sudo snap alias microk8s.kubectl k && \
sudo usermod -a -G microk8s $USER && \
sudo chown -f -R $USER ~/.kube && \
su - $USER
```

[Google Cloud SDK](https://cloud.google.com/sdk/) - cli for google cloud

```bash
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && \
sudo apt-get install apt-transport-https ca-certificates gnupg && \
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add - && \
sudo apt-get update && sudo apt-get install google-cloud-sdk -y && \
gcloud init
```
