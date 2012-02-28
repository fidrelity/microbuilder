class GraphicsController < ApplicationController
  respond_to :js, :only => :create
  def index
    @graphics = Graphic.all
  end

  def create
    p '**' * 10
    p current_user
    @graphic = current_user.graphics.create(params[:asset])
    
    render :nothing => true, :status => 200
  end
end
