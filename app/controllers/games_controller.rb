class GamesController < ApplicationController
  respond_to :js, :only => [:create, :index, :update]
  before_filter :authenticate_user!, :only => [:create, :destroy]
  
  def index
    @games = case params[:type]
      when "rating"
        Game.all_by_rating
      when "played"
        Game.all_by_played
      else
        Game.all_latest
      end
  end
  
  def show
    @game = Game.find(params[:id])
    @comments = @game.game_comments
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
  
  def search
    @games = Game.search(params[:query])
    render 'index'
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

  # Game has been played -> update counter
  def played
    @game = Game.find(params[:id])
    counter = @game.played + 1
    @game.update_attribute(:played, counter)
    render :nothing => true, :layout => false
  end

  def like
    @game = Game.find(params[:id])
    counter = @game.likes + 1
    @game.update_attribute(:likes, counter)
    render :nothing => true, :layout => false
  end

  def dislike
    @game = Game.find(params[:id])
    counter = @game.dislikes + 1
    @game.update_attribute(:dislikes, counter)
    render :nothing => true, :layout => false
  end

end
