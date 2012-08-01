class PagesController < ApplicationController

  def home
    @games = Game.all_latest.paginate(:page => params[:page], :per_page => 4)
  end

  def imprint
  end

end
