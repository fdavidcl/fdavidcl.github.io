---
layout: default
title: Archive
---

# Archive

{% for c in site.categories %}
{% assign cname = c | first %}
{% if cname == "docencia" %}
{% assign posts = c | last %}
{% endif %}
{% endfor %}
{% for post in posts %}
{:.archive-post}
{{ post.date | date: "%d-%m-%Y" }} [{{ post.title }}]({{ post.url }})
{% endfor %}
