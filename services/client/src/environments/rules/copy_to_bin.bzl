"""modified version of https://github.com/bazelbuild/rules_nodejs/blob/master/internal/common/copy_to_bin.bzl"""

load(":rules/copy_file_private.bzl", "copy_bash", "copy_cmd")

def _copy_to_bin_impl(ctx):
    all_dst = []
    src = ctx.file.src
    dst = ctx.file.dst
    if not src.is_source:
        fail("A source file must be specified in copy_to_bin rule, %s is not a source file." % src.path)

    dst = ctx.actions.declare_file(dst.basename, sibling = dst)
    if ctx.attr.is_windows:
        copy_cmd(ctx, src, dst)
    else:
        copy_bash(ctx, src, dst)
    return DefaultInfo(files = depset([dst]), runfiles = ctx.runfiles(files = [dst]))

_copy_to_bin = rule(
    implementation = _copy_to_bin_impl,
    attrs = {
        "src": attr.label(mandatory = True, allow_single_file = True),
        "dst": attr.label(mandatory = True, allow_single_file = True),
        "is_windows": attr.bool(mandatory = True, doc = "Automatically set by macro"),
    },
)

def copy_to_bin(name, src, dst, **kwargs):
    _copy_to_bin(
        name = name,
        src = src,
        dst = dst,
        is_windows = select({
            "@bazel_tools//src/conditions:host_windows": True,
            "//conditions:default": False,
        }),
        **kwargs
    )
