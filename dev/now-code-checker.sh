#!/bin/sh

for FILE in `git diff --name-only --cached`; do
    grep 'NOW ' $FILE 2>&1 >/dev/null
    if [ $? -eq 0 ]; then
        echo 'Error:' $FILE 'contains a "NOW". Please fix before committing!'
        exit 1
    fi
done
exit