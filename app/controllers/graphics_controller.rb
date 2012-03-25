class GraphicsController < ApplicationController
  respond_to :js, :only => [:create, :public]
  before_filter :authenticate_user!, :only => [:create, :destroy]
  
  def index
    @graphics = Graphic.all
  end

  def create
    @graphic = current_user.graphics.new(params[:graphic])
    response, status = @graphic.save ? [@graphic.to_response_hash, 200] : [@graphic.errors.to_json, 400]
    
    render :json => response, :status => status
  end
  
  def destroy
    @graphic = Graphic.find(params[:id])
    user = @graphic.user
    
    if current_user = @graphic.user
      @graphic.games.any? ? @graphic.update_attribute(:user, nil) : @graphic.destroy
      flash[:notice] = "Successfully deleted graphic"
    else
      flash[:error] = "Not allowed to delete graphic"
    end

    redirect_to user_path(user)
  end
  
  def public
    response = Graphic.all_public.collect do |graphic|
      graphic.to_response_hash
    end
    
    render :json => response, :status => 200
  end
end
