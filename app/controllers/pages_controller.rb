class PagesController < ApplicationController
  def home
    @games = Game.all_latest.limit(4)
  end

  def editor
  end

  def imprint
  end
end
