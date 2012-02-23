class AssetsController < ApplicationController
  def show
    @asset = Asset.find(params[:id])
  end
end
