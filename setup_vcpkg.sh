#!/bin/bash
set -e

# 1. Clone vcpkg if it doesn't exist
if [ ! -d "vcpkg" ]; then
  echo "Cloning vcpkg..."
  git clone --depth=1 https://github.com/microsoft/vcpkg.git
fi

# 2. Bootstrap vcpkg
if [ ! -f "vcpkg/vcpkg" ]; then
  echo "Bootstrapping vcpkg..."
  ./vcpkg/bootstrap-vcpkg.sh
fi

# 3. Install dependencies using manifest mode (reads vcpkg.json)
echo "Installing dependencies (this may take a while)..."
# We'll use the default dynamic triplets. 
# You can change to x64-linux-static if you want statically linked binaries.
./vcpkg/vcpkg install --triplet=x64-linux

echo "Done! Dependencies are installed in ./vcpkg_installed"
