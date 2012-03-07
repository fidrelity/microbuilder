class GraphicsController < ApplicationController
  respond_to :js, :only => :create
  def index
    @graphics = Graphic.all
  end

  def create
    @graphic = current_user.graphics.create(params[:graphic])
    
    render :nothing => true, :status => 200
  end
  
  def destroy
    @graphic = Graphic.find(params[:id])
    @graphic.destroy if @graphic.user = current_user
  end
end
