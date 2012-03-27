class GamesController < ApplicationController
  respond_to :js, :only => [:create, :index]
  
  def index
    @games = Game.all
  end
  
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
  
  def destroy
    @game = Game.find(params[:id])
    if @game.author == current_user
      @game.destroy 
      flash[:notice] = "Successfully deleted game"
    else
      flash[:error] = "Not allowed to delete game"
    end
    
    redirect_to user_path(@game.author)
  end
end
