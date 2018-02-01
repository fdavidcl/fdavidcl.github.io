---
title: Time tracking in Emacs with org-clock
tags:
- emacs
- linux
- code
---

This is yet another short post about a little feature in Emacs that turned out to be pretty useful. If you ever feel that you'd like to know how much time you are spending working on different projects (and are an Emacs user), this is the post for you.

## org-clock

After searching for a simple app to track my time for an hour or so, I ended up looking for that functionality in Emacs and, [unsurprisingly enough](https://www.xkcd.com/378/), it exists. It's integrated inside *org-mode* so it works very well with any task list you may already have, or you could create a completely separate file exclusive for time tracking.

The following is the skeleton for my time log:

~~~org
#+title: Time log

=CHEATSHEET=
- S-c         open this window (i3)
- C-c C-x C-i org-clock-in
- C-c C-x C-o org-clock-out
- C-c C-x C-j org-clock-goto
- C-c C-x C-d org-clock-display
- C-c C-x C-r org-clock-report

* Work
* M.Sc.
* Projects / Fun
~~~

Easy enough, the only actual content of the file is that last stack of headers (it could be a list with `-` instead of `*` as well). Now onto the good part: place the cursor over one of the tasks and type <kbd>Ctrl + c</kbd>,<kbd>Ctrl + x</kbd>,<kbd>Ctrl + i</kbd>. This will set a clock under that task with the starting time of the task. Let some time pass, and use <kbd>Ctrl + c</kbd>,<kbd>Ctrl + x</kbd>,<kbd>Ctrl + o</kbd> to stop the clock. Emacs will also remember when you have a clock running, and will warn you if you try to close the buffer or stop the clock if you start another one.

When you have tracked several time periods for the same task, you can compute the total time with <kbd>Ctrl + c</kbd>,<kbd>Ctrl + x</kbd>,<kbd>Ctrl + d</kbd>. *org-clock* also understands nested tasks (second-level headers, nested lists, etc.) and will sum the time of all the tasks inside a higher-level task to compute the overall spent time. You can generate a daily report with <kbd>Ctrl + c</kbd>,<kbd>Ctrl + x</kbd>,<kbd>Ctrl + r</kbd> and setting the `:block today` parameter. The following screenshot shows all these features at work:

![Screenshot of my time log](/assets/images/emacs-org-clock.png)

## Convenient stuff

As a user of i3, it's easy to set keybindings that will let me access my time log instantly:

~~~sh
# .config/i3/config
bindsym $mod+c exec "xdotool search --name 'timelog.org' windowactivate && i3-msg kill || emacsclient -c /media/datos/Documents/timelog.org"
for_window [class="Emacs" title="timelog.org"] floating enable
for_window [class="Emacs" title="timelog.org"] resize set 1920 1280
for_window [class="Emacs" title="timelog.org"] move position center
~~~

This enables a <kbd>Super + c</kbd> binding that will toggle an Emacs window with the time log file.

In order to save some keystrokes and prevent forgetting to save the time log, I have also added these hooks into my Emacs config:

~~~lisp
(add-hook 'org-clock-in-hook 'save-buffer)
(add-hook 'org-clock-out-hook 'save-buffer)
~~~

Finally, I let Emacs open the file in background at startup with the following line in the configuration, so the buffer isn't actually closed when I close the window:

~~~lisp
(find-file-noselect "~/Documentos/timelog.org")
~~~

And that's all there is to simple time tracking in Emacs. I hope you learned something useful and I didn't waste your time.
