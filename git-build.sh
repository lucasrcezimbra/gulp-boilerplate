#!/bin/bash
if [ -z "$1" ]; then
  echo "GitHub repository with user (example: Lrcezimbra/gulp-boilerplate): "
  read repository
else
  repository="$1"
fi

gulp build
cd build
git init
git remote add origin git@github.com:"$repository".git
git add .
git commit -m 'Build'
git push --force origin master:gh-pages
