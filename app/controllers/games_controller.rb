class GamesController < ApplicationController

  def new
    
  end
  
  def create
    @graphics = User.find(params[:user_id]).assets
  end
end
