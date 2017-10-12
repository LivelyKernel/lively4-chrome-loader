#!/bin/bash

ZIP="lively4-chrome-loader.zip"

pushd ".."
rm $ZIP
zip $ZIP -r lively4-chrome-loader
popd
