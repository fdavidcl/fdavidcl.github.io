I wanted to have a more convenient way of adding posts to the blog that didn't involve so much editing, dealing with git, jekyll and everything. Something so that I could just jot down some notes on my phone whenever and have them up in no time. This is what I've found at the moment, I may extend this in the future and feel free to send suggestions my way (talk to me at [dci@c.im](https://c.im/@dcl) on the fediverse)

## JekyllEx
An Android app that is supposed to manage Jekyll blogs. Installed it but couldn't get it to launch, it just crashed :(

## isomorphic-git
I didn't find any other promising phone apps and didn't want to deal with developing one myself so I started looking into what tools I would need to write a simple webapp to clone my blog, edit it and send updates. Managing a git repo from the browser seemed daunting but I found this amazing library, isomorphic-git, which makes it a breeze. It is very simple to use and leverages modern features of JS in the browser (the author even has an equivalent implementation of Node's `fs` for the browser!), so huge shoutout for that.

## StackEdit
After seeing that the git part of the problem could be solved, I looked into Markdown editors, and I came across [StackEdit](https://stackedit.io) which I had already used ages ago.

...and it turns out StackEdit has full support for GitHub/Gitlab repos! I'm just writing this post on it right now and I can push it to the repo so that GitHub takes care of compiling and adding it to the blog. Am

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE0MTQwMzc0MDNdfQ==
-->