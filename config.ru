# This file is used by Rack-based servers to start the application.
#map '/vocsub' do
 require ::File.expand_path('../config/environment',  __FILE__)
 run CommentToolPublic::Application
#end