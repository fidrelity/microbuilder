class PagesController < ApplicationController
  def home
    @games = Game.all_latest
  end

  def editor
  end
end
