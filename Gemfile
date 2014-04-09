source 'http://rubygems.org'

# 3.0 stable as of March 15, 2013, see https://github.com/rails/rails/commits/3-0-stable
gem 'rails', :git => 'git://github.com/rails/rails.git', :ref => '77403a9'

gem 'memcache-client'
gem 'paperclip'
gem 'jquery-rails'
gem 'kaminari'
gem 'authlogic'
gem 'browser'

# OLD! Delayed_Job for asynchronous processing
# gem 'delayed_job_active_record'
# gem 'daemons', :require => false

# NEW: Resque
gem 'resque'
gem 'resque_mailer'
gem 'resque-status'
gem 'resque_unit', :group => :test

gem 'redis-objects'

platform :ruby do
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
  gem 'pry-rails'
  gem 'better_errors'
  gem 'binding_of_caller'
  gem 'yard'
end

gem "mocha", :group => :test
