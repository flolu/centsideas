load("@npm//jest-cli:index.bzl", _jest_test = "jest_test")
load("@npm_bazel_typescript//:index.bzl", "ts_library")

def jest_test(name, srcs, deps, jest_config, data = [], **kwargs):
    """Wrapper for running jest tests with the jest cli

    Args:
        name: name
        srcs: javascript source test files
        deps: test dependencies
        jest_config: jest config file
        data: additional data (e.g. .proto files)
        **kwargs:
    """
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
        data = [jest_config] + srcs + deps + data,
        args = args,
        **kwargs
    )

def ts_jest(name, srcs, tsconfig, test_lib, deps = [], data = [], **kwargs):
    """Runs jest tests over a typescript library

    Args:
        name: name
        srcs: typescript test source files
        tsconfig: typescript config file
        test_lib: typescript library
        deps: typescript test_lib dependencies
        data: additional data (e.g. .proto files)
        **kwargs:
    """
    test_lib_name = "%s_lib" % name
    filegroup_name = "%s.js" % name

    ts_library(
        name = test_lib_name,
        srcs = srcs,
        tsconfig = tsconfig,
        deps = ["@npm//@types/jest"] + [test_lib] + deps,
    )

    native.filegroup(
        name = filegroup_name,
        srcs = [test_lib_name],
        output_group = "es5_sources",
    )

    jest_test(
        name = name,
        srcs = [filegroup_name],
        jest_config = "//packages/jest:jest.config.js",
        deps = [test_lib] + deps,
        data = data,
    )
