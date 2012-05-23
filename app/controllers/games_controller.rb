class GamesController < ApplicationController
  respond_to :js, :only => [:create, :index, :update, :like, :dislike]
  before_filter :authenticate_user!, :only => [:create, :destroy]
  before_filter :find_game, :only => [:show, :embed, :destroy, :like, :dislike, :played]
  
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
    @comments = @game.game_comments
  end
  
  def embed
    render :file => "app/views/games/embed", :layout => false
  end
  
  def create
    @game = current_user.games.new(params[:game])
    @game.create_graphics_association(params[:graphic_ids])
    
    if @game.save
      response, status = [play_url(@game), 200]
      push_new_game(@game)
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
    @game = current_user.games.find(params[:id])

    if @game.author == current_user
      @game.destroy 
      flash[:notice] = "Successfully deleted game"
    else
      flash[:error] = "Not allowed to delete game"
    end
    
    redirect_to user_path(@game.author)
  end

  # ------------------
  def played
    counter = @game.played + 1
    @game.update_attribute(:played, counter)
    render :nothing => true, :layout => false
  end

  def like
    counter = @game.likes + 1
    @game.update_attribute(:likes, counter)
    #cookies[:game] = "true"
  end

  def dislike
    counter = @game.dislikes + 1
    @game.update_attribute(:dislikes, counter)
    render :file => "app/views/games/like", :layout => false
  end

  def report    
    render :nothing => true, :layout => false
  end

  # ------------------
  def auto_search
    @games = Game.order(:title).where("title like ?", "%#{params[:term]}%")
    render json: @games.map(&:title)
  end

  private

  def push_new_game(game)
    Pusher['game_channel'].trigger('newgame', {
      :name => game.title,
      :game_id => game.id,
      :author => game.author.display_name,
      :author_id => game.author.id
    })
  end

  def find_game
    @game = Game.find(params[:id])
  end

end