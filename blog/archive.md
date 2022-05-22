---
layout: default
title: Archive
---

<article>
  <h1>All posts</h1>

  {% for c in site.categories %}
  {% assign cname = c | first %}
  {% if cname == "blog" %}
  {% assign posts = c | last %}
  {% endif %}
  {% endfor %}
  {% for post in posts %}
  <p>
    <time datetime="{{ post.date | date: "%F" }}">{{ post.date | date: "%F" }}</time>
    <a href="{% if post.link %}{{ post.link }}{% else %}{{ post.url }}{% endif %}"><i class="icon fa fa-small {% if post.link %}fa-external-link{% else %}fa-file-text-o{% endif %}"></i> {{ post.title }}</a> 
  </p>
  {% endfor %}
</article>