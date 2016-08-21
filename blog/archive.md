---
layout: default
title: Archive
---

[{% icon fa-arrow-left %}](/blog)

{% for post in site.posts %}
{:.archive-post}
{{ post.date | date: "%d-%m-%Y" }} [{{ post.title }}]({{ post.url }})
{% endfor %}
