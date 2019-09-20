# CENTS Ideas

⚙ Control
🔓 Entry
🙏 Need
⏳ Time
🌍 Scale

```
docker exec -ti ideas-event-store /bin/bash

ifconfig | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1
```
