---
layout: post
title: Deploying Mastodon on a single DigitalOcean droplet
tags:
  - code
  - mastodon
  - decentralized
---


## What happened
I bought a super cheap domain with a [cool name](https://quotient.space). I had to put something there, so why not Mastodon? I had a 10$ coupon from DigitalOcean so I could try it for free for a month or two.

## Prerequisites

You'll need a domain name for this. There are free domains available in certain TLDs, and also very cheap ones out there (quotient.space was just 0.55€ for the first year).

## How to do the thing

Most of this process is just following Mastodon's own [Docker guide](https://github.com/tootsuite/documentation/blob/master/Running-Mastodon/Docker-Guide.md). I used version 2.3.0 for this, so the process may be different for other versions.

**Disclaimer**:  This is my first time deploying Mastodon so trust your own common sense over these steps.

1. Set up a single 5$ droplet in your DO account (if you are not yet an user you can use this link to get 10$ credit: <https://m.do.co/c/ca70d8a84d85>). Throw your public SSH key in there and use its IP address to login: `ssh root@[ip-address]`. You can also set up your domain so that it points to DO's nameservers and redirects to your droplet.
2. `apt install docker.io nginx letsencrypt`
3. You'll need a new version of docker-compose so run this ([source](https://gist.github.com/wdullaer/f1af16bd7e970389bad3)):
    
    ~~~sh
    COMPOSE_VERSION=`git ls-remote https://github.com/docker/compose | grep refs/tags | grep -oP "[0-9]+\.[0-9][0-9]+\.[0-9]+$" | tail -n 1`
    sudo sh -c "curl -L https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose"
    sudo chmod +x /usr/local/bin/docker-compose
    sudo sh -c "curl -L https://raw.githubusercontent.com/docker/compose/${COMPOSE_VERSION}/contrib/completion/bash/docker-compose > /etc/bash_completion.d/docker-compose"
    ~~~

4. Also, create a swapfile:
     
    ~~~sh
    fallocate -l 1G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    ~~~

5. Follow the guide for Docker in Mastodon documentation to clone the repository. Now, `touch .env.production` since docker-compose will not work without it. Follow the guide to get the images.
6. Check that file permissions are correct. I came across a couple of `Permission denied` errors since some directories in the Docker container were owned by `root` instead of `mastodon`. To check this, login into the web container as root:
    
    ~~~sh
    docker-compose run --rm -u 0 web bash
    # in the container:
    chmod -R mastodon:mastodon /mastodon/public/
    ~~~
    
    > Is this terrible? Shouldn't I have changed it? Tell me 
    
7. Follow the guide to setup your instance. You don't need a MailGun account if it's a single-user instance, but put some fake user and password just in case. The compilation of assets may take several minutes, for convenience make sure you aren't kicked out of the ssh session. Set up an admin account for yourself.
8. `docker-compose up -d`
9. Follow the nginx and Let's Encrypt sections of the [production guide](https://github.com/tootsuite/documentation/blob/master/Running-Mastodon/Production-guide.md#nginx-configuration).
10. If all went well you should be able to see your new Mastodon instance when you visit your domain.

## Useful stuff

If assets compilation didn't work, you can try again with

~~~sh
docker-compose run --rm web rake assets:precompile
~~~

If creating the user didn't work, try adding a new user, locating the password reset token in the logs (then navigating to `example.com/auth/password/edit?reset_password_token=[your-token]` to create a password) and lastly confirming the email address:
~~~sh
docker-compose run --rm web rake mastodon:add_user
docker logs mastodon_web_1
docker-compose run --rm web rake mastodon:confirm_email USER_EMAIL=[your-email]
~~~