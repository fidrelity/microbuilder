class GraphicsController < ApplicationController
  respond_to :js, :only => [:create, :public]
  def index
    @graphics = Graphic.all
  end

  def create
    if current_user
      @graphic = current_user.graphics.new(params[:graphic])

      if @graphic.save
        response, status = @graphic.to_response_json, 200
      else
        response, status = @graphic.errors.to_json, 400
      end
    else
      response, status = "No User supplied", 400
    end
    
    render :json => response, :status => status
  end
  
  def destroy
    @graphic = Graphic.find(params[:id])
    @graphic.destroy if @graphic.user = current_user
  end
  
  def public
    render :json => Graphic.all_public.to_json
  end
end
