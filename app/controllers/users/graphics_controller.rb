class Users::AssetsController < ApplicationController

  def index
    @graphics = User.find(params[:user_id]).assets
  end
end
