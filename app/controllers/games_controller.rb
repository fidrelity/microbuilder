class GamesController < ApplicationController
  respond_to :js, :only => [:create, :index, :update, :like, :dislike, :played]
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
    @user = @game.author
    if @game.destroy
      flash[:success] = "Successfully deleted game"
    else
      flash[:error] = "Not allowed to delete game"
    end
    @games = current_user.games.paginate(:page => params[:games_page], :per_page => 4)
  end

  # ------------------
  def played
    counter = @game.played + 1
    Game.transaction { @game.update_attribute(:played, counter) }
  end

  def like
    unless cookies["voted_game_#{@game.id}"]
      Game.transaction { @game.update_attribute(:likes, @game.likes + 1) }
      cookies["voted_game_#{@game.id}"] = true
    end
  end

  def dislike
    unless cookies["voted_game_#{@game.id}"]
      Game.transaction { @game.update_attribute(:dislikes, @game.dislikes + 1) }
      cookies["voted_game_#{@game.id}"] = true
    end
    render "like"
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