#!/bin/bash

# Installer for SVOX Pico TTS on non-Debian platforms
# Author: Steven Mirabito <smirabito@csh.rit.edu>

# Check architechure
if [ $(uname -m) == 'x86_64' ]; then
    pkgarch="amd64"
else
    pkgarch="i386"
fi

# Get work directories set up
cd /usr/src
mkdir -p libttspico

# Download and extract Pico TTS libraries
curl -O "http://mirrors.kernel.org/ubuntu/pool/multiverse/s/svox/libttspico0_1.0+git20130326-3_${pkgarch}.deb"
ar x libttspico0_1.0+git20130326-3_${pkgarch}.deb data.tar.xz
tar -xf data.tar.xz -C "libttspico"
rm -f data.tar.xz

# Dowload and extract Pico TTS voice data
curl -O "http://mirrors.kernel.org/ubuntu/pool/multiverse/s/svox/libttspico-data_1.0+git20130326-3_all.deb"
ar x libttspico-data_1.0+git20130326-3_all.deb data.tar.xz
tar -xf data.tar.xz -C "libttspico"
rm -f data.tar.xz

# Download and extract Pico TTS utilities (pico2wave)
curl -O "http://mirrors.kernel.org/ubuntu/pool/multiverse/s/svox/libttspico-utils_1.0+git20130326-3_${pkgarch}.deb"
ar x libttspico-utils_1.0+git20130326-3_${pkgarch}.deb data.tar.xz
tar -xf data.tar.xz -C "libttspico"
rm -f data.tar.xz

# Delete packages
rm -f libttspico*.deb

# Move files into place
mv "libttspico/usr/lib/"*-linux-gnu/* "libttspico/usr/lib"
rmdir "libttspico/usr/lib/"*-linux-gnu
mv libttspico/usr/bin/* /usr/bin/
mv libttspico/usr/lib/* /usr/lib/
mv libttspico/usr/share/pico /usr/share/
mv libttspico/usr/share/doc/* /usr/share/doc/
mv libttspico/usr/share/man/man1/* /usr/share/man/man1/

# Load new libraries
ldconfig
