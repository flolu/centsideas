```
docker build -t bazelisk -f images/bazelisk.Dockerfile .
docker run -v $(pwd):/app  bazelisk test //...
```
