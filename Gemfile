source 'http://rubygems.org'

gem 'rails', '4.0.13'

gem 'memcache-client'
gem 'paperclip'
gem 'jquery-rails'
gem 'kaminari'
gem 'authlogic'
gem 'browser'

gem "protected_attributes"

# NEW: Resque
gem 'resque'
gem 'resque_mailer'
gem 'resque-status'
gem 'resque_unit', :group => :test

gem 'redis-objects'

gem 'sass-rails'
gem 'coffee-rails'
gem 'uglifier', '>= 1.0.3'

platform :ruby do
  gem 'unicorn-rails'
  gem 'mysql2', "~> 0.3.18"
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

  gem "rspec-rails", "~> 3.4.0"
  gem "factory_girl_rails"
end

group :test do
  gem "capybara-webkit"
  gem "database_cleaner"
  gem "shoulda-matchers"
end

