source 'http://rubygems.org'

gem 'rails', :git => 'git://github.com/rails/rails.git', :ref => '182d4e3719' # 3.0.21, see https://github.com/rails/rails/pull/9126

# Bundle edge Rails instead:
# gem 'rails', :git => 'git://github.com/rails/rails.git'

gem 'jquery-rails'
gem 'thin'
gem 'kaminari'
gem 'delayed_job', '2.1.4'
gem 'unicorn-rails'
gem 'memcache-client'
gem 'authlogic'
gem 'paperclip'


group :development, :test do 
	gem 'ruby-debug19'
	gem 'nifty-generators'
	gem 'annotate'
	gem 'pry-rails'
end

gem "mocha", :group => :test

group :mysql_db do
	gem 'mysql2', '< 0.3'
end
