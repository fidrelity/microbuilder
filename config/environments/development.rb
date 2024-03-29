Playtin::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Log error messages when you accidentally call methods on nil.
  config.whiny_nils = true

  # Show full error reports and disable caching
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false
  #config.action_controller.page_cache_directory = Rails.root.join("public/cache").to_s

  # Don't care if the mailer can't send
  config.action_mailer.raise_delivery_errors = false

  # Print deprecation notices to the Rails logger
  config.active_support.deprecation = :log

  # Only use best-standards-support built into browsers
  config.action_dispatch.best_standards_support = :builtin

  # Raise exception on mass assignment protection for Active Record models
  config.active_record.mass_assignment_sanitizer = :strict

  # Log the query plan for queries taking more than this (works
  # with SQLite, MySQL, and PostgreSQL)
  config.active_record.auto_explain_threshold_in_seconds = 0.5

  # Do not compress assets
  config.assets.compress = false

  # Expands the lines which load the assets
  config.assets.debug = true
 
  #Facebook Key and Secret
  FACEBOOK_ID = '392913504057961'
  FACEBOOK_SECRET = '236e82c66d6b97dd23422df19680db27'
  FACEBOOK_APP_NAME = 'microbuilderdev'
  
  Paperclip.options[:command_path] = '/usr/bin/identify'

  # Pusher Service (Websockets)
  require 'pusher'
  Pusher.app_id = 20822
  Pusher.key = 'a4bc39aab42024a54d27'
  Pusher.secret = 'fcc0e5f4c2220751968e'

  # https://github.com/webarbeit/feedhub
  Feedhub::set_user(:name => "playtinSupport", :password => "baumhaus8")
  Feedhub::set_repo(:account => "playtin", :name => "Support")
  
  # ember-rails
  config.ember.variant = :development
  
  #redis locally. set username and password (the OS user that runs redis)
  REDIS_USER = YAML.load_file("#{Rails.root}/config/redis_credentials.yml")['username']
  REDIS_PW = YAML.load_file("#{Rails.root}/config/redis_credentials.yml")['password']
  ENV["REDISTOGO_URL"] = 'redis://'+ REDIS_USER + ":" + REDIS_PW + '@localhost:6379' 
end

PAPERCLIP_OPTIONS = {
  :url => "/:class/:id/:basename" + ".png",
  :path => Rails.root.to_s + "/public/:class/:id/:basename" + ".png",
}

PAPERCLIP_THUMB_OPTIONS = {
  :default_url => "/:class/:id/" + "thumbnail.png",
  :path => Rails.root.to_s + "/public/:class/:id/" + "thumbnail.png",
  :styles => { :small => "210x130!" }
}
