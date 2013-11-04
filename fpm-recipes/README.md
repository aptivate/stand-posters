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

The chromium-profile is included in the `chromium-profile` folder. To
reconfigure or add new links save changes after launching chromium with:

    chromium-browser --user-data-dir=$(pwd)/chromium-profile

The profiles include the following extensions:

- [tab slideshow](https://chrome.google.com/webstore/detail/tab-slideshow/loepeenhjndiclafjgoackjblfhonogb)
- [humble new tab page](https://chrome.google.com/webstore/detail/humble-new-tab-page/mfgdmpfihlmdekaclngibpjhdebndhdj)

### aptidemo offline appliance ###

The vagrant-based offline appliance works independently of the
chromium-kiosk.

aptidemo-chromum-kiosk will pull vagrant and virtualbox as
dependencies during its install.

After the package installation, the latest aptidemo vagrant box needs
to be added.

    # sudo aptivate-vagrant-box-reload uri_or_path_to_box
    
To start the appliance (run without sudo, will ask for sudo password):

    # aptivate-vagrant-up

The vagrant box requires the following to be run:

- Ubuntu 13.04
- Virtualbox 4.2.10 from ubuntu
- vagrant 1.3.5
- possibly a x86_64 system

Check ../packer/Vagrantfile for the initial vagrant configuration of
the box. It's derived from
[centos 6.3 minimal found on vagrantbox.es]([https://dl.dropbox.com/u/7225008/Vagrant/CentOS-6.3-x86_64-minimal.box)



