namespace :application do
  # For public servers there are no background processes to start up
  # Only need to have unicorn running
  desc "start the application and all required background jobs and processes"
  task :start_all => ["unicorn:start"]
  
  desc "stop the application and all background jobs and processes"
  task :stop_all => ["unicorn:stop"]
end