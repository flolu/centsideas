load("@npm//jest-cli:index.bzl", _jest_test = "jest_test")

def jest_test(name, srcs, deps, jest_config, **kwargs):
    args = [
        "--no-cache",
        "--no-watchman",
        "--ci",
    ]
    args.extend(["--config", "$(locations %s)" % jest_config])
    for src in srcs:
        args.extend(["--runTestsByPath", "$(locations %s)" % src])

    _jest_test(
        name = name,
        data = [jest_config] + srcs + deps,
        args = args,
        **kwargs
    )
