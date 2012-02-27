class AssetsController < ApplicationController

  def index
    @assets = User.find(params[:user_id]).assets
  end
  
  def show
    @asset = Asset.find(params[:id])
  end
  
  def new
    @asset = Asset.new
    @state = State.new
  end
  
  def create
    p '*#' * 20 + "   creating..."
    p params[:asset][:states].count
    @asset = Asset.create(params[:asset], :user => current_user)
    #@state = @asset.states.create(params[:asset][:state])
  end
end
