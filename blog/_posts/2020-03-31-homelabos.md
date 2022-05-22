---
layout: post
title: Deploying HomelabOS on a Raspberry Pi 4
---

HomelabOS is a tool for deploying self-hosted services on a server. For this installation, you will need:

- Raspberry Imager
- Latest `ubuntu-preinstalled-server-arm64` from here: https://github.com/TheRemote/Ubuntu-Server-raspi4-unofficial/releases
- Docker on your PC (your user should be in the `docker` group, `sudo usermod -a -G docker username`)
- Latest HomelabOS zip from here: https://gitlab.com/NickBusey/HomelabOS/-/tags

## Installing Ubuntu

We will need Ubuntu 18.04 on the Raspberry. Here's how to install it.

### Fixing firmware

First, open up Raspberry Imager and flash Raspbian to your SD card. Boot up your RPi 4 and run these commands:

```bash
sudo apt-get update && sudo apt-get dist-upgrade -y
sudo rpi-update
sudo rpi-eeprom-update -a
```

### Actually installing Ubuntu

Now, use Raspbian Imager to flash the IMG file for Ubuntu Server 18.04 to your SD card. Boot up your Raspberry and check for working SSH (default user and password are `ubuntu`, `ubuntu`). You will need to configure an SSH key if you don't have one, so `ssh-keygen` and `ssh-copy-id` are your friends. A static IP would also be convenient, you can [use netplan to configure it](https://linuxize.com/post/how-to-configure-static-ip-address-on-ubuntu-18-04/), it's easy!

## Installing HomelabOS

Extract files from the downloaded ZIP **on your PC**. Now `cd` to the HomelabOS directory and run the following:

```bash
make logo
make config # answer some questions
make set enable_miniflux true # miniflux is a feed reader
make
```

This should accomplish the following steps:

1. Build Docker images for HomelabOS
2. Set some configuration variables and create `settings/config.yml`
3. Enable a service, it doesn't have to be miniflux, I chose that for testing
4. Deploy the configured services to your Raspberry

For more info and troubleshooting, see the original posts.

# Sources

- Ubuntu 18.04.4 unofficial image: https://jamesachambers.com/raspberry-pi-4-ubuntu-server-desktop-18-04-3-image-unofficial/
- HomelabOS installation: https://nickbusey.gitlab.io/HomelabOS/setup/installation/

I'll be updating this post with more info and tips as I continue optimizing my configuration.