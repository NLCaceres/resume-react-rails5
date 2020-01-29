# My Resume with React Plus Rails!

After working through my resume and portfolio site based on just React as a simple single page app, I knew I could still improve it technology wise. With a giant list of json files sitting in the src folder of my app, I automatically knew that a REST API would be exactly what the doctor ordered. Having heard a ton about Ruby on Rails and not having a lot of experience with Ruby itself, this seemed like a great opportunity to brush up on Ruby and play with a new backend framework! From that little idea, I ended up learning a ton more than I expected from git submodules to rails routing and react proxying.

## Incoming Improvements

- Create a Swagger UI inspired routes list view
- Constrain/Restrict certain routes to only authorized users

## Notes about Deploying to Heroku

- There are currently two different versions of this app. One version uses Rails 6 with the API flag set, simply proxying over the React app's requests. Though this version can still use the proxy to handle requests from the react client, it was built using Rails 5.2.4.1 and happens to be a full Rails App that can serve and display its own routes without any help from React. Both versions had their challenges but this version had a particularly difficult to diagnose problem due to the PIDFile, normally used to kill the server if needed. I had two options, either go to the puma config file and get rid of the line dedicated to specifying a PIDFile for the server or configure the gitignore file to track the tmp/pids directory via .keep file (.gitkeep would work as well). Since the latter seemed last destructive, I elected to go that route. Ultimately the solution to both versions seems to be starting up the Rails end of things directly with Puma and a .env file as opposed to simply issuing a 'rails server' command in the heroku Procfile. With Rails 6 now using webpacker instead of sprockets to handle assets, a Rails 6 app in normal mode (instead of API only mode) would likely not play nicely with a React app made by create-react-app due to conflicting node_modules folders unless serious configuration care was taken.
