class AssetsController < ApplicationController

  def index
    @assets = User.find(params[:user_id]).assets
  end
  
  def show
    @asset = Asset.find(params[:id])
  end
  
  def new
    @state = State.new
  end
  
  def create
    p '*#' * 20 + "   creating..."
    p params
    @asset = Asset.create(:user => current_user, :name => "dummy")
    @state = State.create(params[:state], :asset => @asset)
  end
end
