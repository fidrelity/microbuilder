Playtin::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb

  # Code is not reloaded between requests
  config.cache_classes = true

  # Full error reports are disabled and caching is turned on
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = true

  # Disable Rails's static asset server (Apache or nginx will already do this)
  config.serve_static_assets = false

  # Compress JavaScripts and CSS
  config.assets.compress = true

  # Don't fallback to assets pipeline if a precompiled asset is missed
  config.assets.compile = true

  # Generate digests for assets URLs
  config.assets.digest = true

  # Defaults to Rails.root.join("public/assets")
  # config.assets.manifest = YOUR_PATH

  # Specifies the header that your server uses for sending files
  # config.action_dispatch.x_sendfile_header = "X-Sendfile" # for apache
  # config.action_dispatch.x_sendfile_header = 'X-Accel-Redirect' # for nginx

  # Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
  # config.force_ssl = true

  # See everything in the log (default is :info)
  # config.log_level = :debug

  # Prepend all log lines with the following tags
  # config.log_tags = [ :subdomain, :uuid ]

  # Use a different logger for distributed setups
  # config.logger = ActiveSupport::TaggedLogging.new(SyslogLogger.new)

  # Use a different cache store in production
  # config.cache_store = :mem_cache_store

  # Enable serving of images, stylesheets, and JavaScripts from an asset server
  # config.action_controller.asset_host = "http://assets.example.com"

  # Precompile additional assets (application.js, application.css, and all non-JS/CSS are already added)
  # config.assets.precompile += %w( search.js )

  # Disable delivery errors, bad email addresses will be ignored
  # config.action_mailer.raise_delivery_errors = false

  config.action_mailer.default_url_options = { :host => 'playtin.com' }

  # Enable threaded mode
  # config.threadsafe!

  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation can not be found)
  config.i18n.fallbacks = true

  # Send deprecation notices to registered listeners
  config.active_support.deprecation = :notify

  # Log the query plan for queries taking more than this (works
  # with SQLite, MySQL, and PostgreSQL)
  # config.active_record.auto_explain_threshold_in_seconds = 0.5
  
  config.active_record.observers = :game_observer
  
  #Facebook Key and Secret
  FACEBOOK_APP_NAME = 'playtin'
  FACEBOOK_ID = '148777278524544'
  FACEBOOK_SECRET = '1385b5ed4c03504ba2e8c05a9be5d740'

  # Pusher Service (Websockets)
  require 'pusher'
  Pusher.app_id = 20822
  Pusher.key = 'a4bc39aab42024a54d27'
  Pusher.secret = 'fcc0e5f4c2220751968e'

  Feedhub::set_user(:name => "playtin", :password => "platin3")
  Feedhub::set_repo(:account => "playtin", :name => "Support")
end

PAPERCLIP_OPTIONS = {
  :url => "/:class/:id/:basename" + ".png",
  :path => "/:class/:id/:basename" + ".png",
  :storage => :s3,
  :bucket => 'mbgfx',
  :s3_credentials => {
    :access_key_id => ENV['S3_KEY'],
    :secret_access_key => ENV['S3_SECRET']
  }
}

PAPERCLIP_THUMB_OPTIONS = {
  :url => "https://s3.amazonaws.com/mbgfx/:class/:id/:basename" + ".png",
  :default_url => "https://s3.amazonaws.com/mbgfx/:class/:id/" + "thumbnail.png",
  :path => "/:class/:id/" + "thumbnail.png",
  :styles => { :small => "210x130!" },
  :storage => :s3,
  :bucket => 'mbgfx',
  :s3_credentials => {
    :access_key_id => ENV['S3_KEY'],
    :secret_access_key => ENV['S3_SECRET']
  }
}