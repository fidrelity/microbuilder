class GraphicsController < ApplicationController
  respond_to :js, :only => [:create, :public, :destroy]
  before_filter :authenticate_user!, :only => [:create, :destroy]
  
  def index
    @graphics = Graphic.all
  end

  def new
  end

  def create
    @graphic = current_user.graphics.create(params[:graphic])
    flash[:success] = "Your Graphic was created!"
  end
  
  def destroy
    @graphic = Graphic.find(params[:id])
    @user = @graphic.user
    
    if current_user == @graphic.user
      @graphic.soft_delete
      flash[:success] = I18n.t('.graphics.destroy.success')
    end
  end
  
  def public
    begin
      graphics = Graphic.filter(
        !!params[:backgrounds],
        params[:min_size].to_i,
        params[:max_size].to_i
      )
    rescue InvalidGraphicBoundaries => e
      render :json => e.message, :status => 400
      return
    end
    
    response = graphics.map do |graphic|
        graphic.to_response_hash 
    end
    
    render :json => response, :status => 200
  end
end
