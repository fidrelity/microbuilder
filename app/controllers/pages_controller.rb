class PagesController < ApplicationController

  def home
    @games = Game.all_latest(params[:order] || 'desc').paginate(:page => params[:page], :per_page => 8)

    if current_user
      @likes = current_user.games.sum(:likes)
      @plays = current_user.games.sum(:played)
    end
    @messages = Stream.latest
  end

  def imprint
  end
  
  def tour
  end

end
