#!/bin/bash                                                                                                         

cp -R pathcheck-mobile-resources/environment/ ./

git update-index --assume-unchanged .env.bt
git update-index --assume-unchanged .env.bt.staging
git update-index --assume-unchanged .env.bt.release