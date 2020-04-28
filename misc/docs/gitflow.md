# Git Flow

**Create a feature branch**

```bash
git checkout dev
git checkout -b <name-of-feature-branch>
```

**Finish a feature branch**

```bash
git checkout dev
git merge <name-of-feature-branch>
```

**Release branches**

```bash
git checkout dev
git checkout -b release/0.1.0
# release work
git checkout master
git merge release/0.1.0
```
