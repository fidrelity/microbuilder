class GamesController < ApplicationController
  respond_to :js, :only => :create
  
  def show
    @game = Game.find(params[:id])
  end
  
  def new
  end
  
  def embed
    @game = Game.find(params[:id])
    render :file => "app/views/games/embed", :layout => false
  end
  
  def create
    @game = current_user.games.create(params[:game]) if current_user

    render :text => play_url(@game)
  end
end
