class PagesController < ApplicationController
  caches_page :imprint

  def home
    @games = Game.all_latest.paginate(:page => params[:page], :per_page => 4)
  end

  def imprint
  end

end
