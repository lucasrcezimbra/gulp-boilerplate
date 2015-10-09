#!/bin/bash

gulp build
cd build
git init
git remote add origin git@github.com:Lrcezimbra/REPOSITORIO.git
git add .
git commit -m 'Build'
git push --force origin master:gh-pages
