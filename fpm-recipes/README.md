Omnibus type recipes to install all local dependencies
of the live demo.

This includes the launcher scripts to start the kiosk
and the appliances if required.

## Building ##

To build in Ubuntu raring 13.04

    sudo aptitude install bundler
    bundle install
    bundle exec fpm-cook package chromium-kiosk.rb

## chromium-kiosk ##

Install a chromium browser locally from packages and specialized
profiles to be used by the kiosk.

To repack with updated profiles the easiest approach is to install the
last .deb package on a clean system, manually reconfigure and install
extensions, and finally repackage from the profile dir.

The profiles include the following extensions:

- [tab slideshow](https://chrome.google.com/webstore/detail/tab-slideshow/loepeenhjndiclafjgoackjblfhonogb)
