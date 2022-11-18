internet link: https://shrouded-ocean-55519.herokuapp.com/


cp -r build //

git add .
git commit -m "Added a Procfile."
heroku login
Enter your Heroku credentials.
...
heroku create
Creating arcane-lowlands-8408... done, stack is cedar
http://arcane-lowlands-8408.herokuapp.com/ | git@heroku.com:arcane-lowlands-8408.git
Git remote heroku added
git push heroku main

cp -r build

npm install mongoose