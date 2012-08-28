class PagesController < ApplicationController

  def home
    @games = Game.all_latest.paginate(:page => params[:page], :per_page => 4)

    @likes = current_user.games.sum(:likes)
    @dislikes = current_user.games.sum(:dislikes)

  end

  def imprint
  end

end
