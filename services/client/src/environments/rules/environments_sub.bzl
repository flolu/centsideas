"environments_sub() rule"

load(":rules/copy_to_bin.bzl", "copy_to_bin")

def environments_sub(envs = []):
    """copies the app's environment into the bazel bin

    reads the environment configuration from the "--define configuration=dev" flag
    and then copies the file into the bazel bin via "copy_to_bin"

    Args:
        envs: a list of all possible environments
    """
    src_select = {}
    for env in envs:
        native.config_setting(
            name = env,
            values = {"define": "configuration=%s" % env},
        )
        src_select[":%s" % env] = ":environment.%s.ts" % env
    src_select["//conditions:default"] = "environment.ts"

    copy_to_bin(
        name = "environments_sub",
        src = select(src_select),
        dst = "environment.ts",
    )
