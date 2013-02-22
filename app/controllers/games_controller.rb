 class GamesController < ApplicationController

  respond_to :js, :only => [:create, :index, :update, :like, :dislike, :played]
  before_filter :authenticate_user!, :only => [:create, :destroy]
  before_filter :find_game, :only => [:embed, :destroy, :like, :dislike, :played]  
  
  def index
    params[:order] ||= "desc"
    @games = case params[:type]
      when "rating"
        Game.all_by_rating(params[:page], params[:order], 12)
      when "played"
        Game.all_by_played(params[:order]).paginate(:page => params[:page], :per_page => 12)
      when "difficulty"
        Game.all_by_difficulty(params[:page], params[:order], 12)
      else
        Game.all_latest(params[:order]).paginate(:page => params[:page], :per_page => 12)
      end
  end
  
  def show
    @game = Game.unscoped.find(params[:id])
    @graphic_co_authors = @game.graphics_co_authors

    render :reported unless @game.visible
    @comments = @game.game_comments
  end

  def new
    @game_data = "null"
    @fork_id = "null"
    
    # Forking the game
    if params[:id]
      @game = Game.unscoped.find(params[:id])
      @game_data = @game.data
      @fork_id = @game.id
      
      if current_user
        flash[:info] = "You can now create a new version of #{@game.author.display_name}'s #{@game.title}"
      end
    
    end       
  end
  
  def embed
    render :file => "app/views/games/embed", :layout => false
  end
  
  def create
    @games = Game.all_latest("desc").paginate(:page => params[:page], :per_page => 4)
    @game = current_user.games.new(params[:game])
    @game.create_graphics_association(params[:graphic_ids])
    @game.author_token = session[:facebook_token]

    if @game.save
      response, status = [play_url(@game), 200]
      Stream.create_message("game", @game.author, @game)
    else
      response, status = [I18n.t(".games.create.error"), 400]
    end

    render :json => response, :status => status
  end
  
  def search

    if params[:term].empty?
      @games = Game.all_latest("desc").paginate(:page => params[:page], :per_page => 12)
    else
      @games = Game.search(params[:term]).paginate(:page => params[:page], :per_page => 12)  
    end

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
    
    redirect_to user_path(@game.author)
  end

  # ------------------
  def played
    Game.transaction do
      @game.played += 1
      @game.won += 1 if params[:win] == "true"
      @game.save
    end
  end

  def like
    rate_game(:likes, @game.likes + 1, 'like')
    render "like"
  end

  def dislike
    rate_game(:dislikes, @game.dislikes + 1, 'dislike')
    render "like"
  end

  def auto_search
    term = params[:term].downcase
    games = Game.order(:title).where("lower(title) like ?", "%#{term}%")    
    render :text => games.map(&:title)
  end

  private

  def rate_game(attribute, counter, message_type)
    unless cookies["voted_game_#{@game.id}"]
      Game.transaction { @game.update_attribute(attribute, counter) }
      cookies["voted_game_#{@game.id}"] = true
      Stream.create_message(message_type, current_user, @game)
    end
  end

  def find_game
    @game = Game.find_by_id(params[:id])
  end
end