class PagesController < ApplicationController
  caches_page :imprint

  def home
    @games = Game.all_latest.limit(4)
  end

  def imprint
  end
end
