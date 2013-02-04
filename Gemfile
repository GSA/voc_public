source 'http://rubygems.org'

gem 'rails', '3.0.20'

# Bundle edge Rails instead:
# gem 'rails', :git => 'git://github.com/rails/rails.git'

gem 'jquery-rails'
gem 'kaminari'
gem 'delayed_job_active_record'
gem 'memcache-client'
gem 'authlogic'
gem 'paperclip'

platform :ruby do
  gem 'thin'
  gem 'unicorn-rails'
  gem 'mysql2', '< 0.3'
end

platform :jruby do
  gem 'activerecord-jdbc-adapter'
  gem 'jdbc-mysql'
  gem 'activerecord-jdbcmysql-adapter'

  gem 'jruby-openssl', :require => false

  gem 'jruby-rack', :require => false

  gem 'warbler'
end

group :development, :test do 
  gem 'nifty-generators'
  gem 'annotate'
  gem 'pry-rails'
  gem 'yard'
end

gem "mocha", :group => :test
