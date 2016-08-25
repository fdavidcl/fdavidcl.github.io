---
layout: default
title: Archive
---

# Archive

{% for post in site.posts %}
{:.archive-post}
{{ post.date | date: "%d-%m-%Y" }} [{{ post.title }}]({{ post.url }})
{% endfor %}
