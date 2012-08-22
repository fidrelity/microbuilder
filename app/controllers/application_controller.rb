class ApplicationController < ActionController::Base
  protect_from_forgery

  autocomplete :game, :title
end
