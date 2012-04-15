class GamesController < ApplicationController
  respond_to :js, :only => [:create, :index]
  before_filter :authenticate_user!, :only => [:create, :destroy]
  
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
    @game = current_user.games.new(params[:game])
    @game.create_graphics_association(params[:graphic_ids])
    
    if @game.save
      response, status = [play_url(@game), 200]
    else
      response, status = [I18n.t(".games.create.error"), 400]
    end

    render :json => response, :status => status
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
