load("@npm//html-insert-assets:index.bzl", "html_insert_assets")

def insert_html_assets(name, outs, html_file, asset_paths, data):
    html_insert_assets(
        name = name,
        outs = outs,
        args = [
            "--html",
            "$(execpath %s)" % html_file,
            "--out",
            "$@",
            "--roots",
            "$(RULEDIR)",
            "--assets",
        ] + asset_paths,
        data = data,
    )
