class UsersController < ApplicationController
  respond_to :js, :only => [:graphics, :show]
  before_filter :authenticate_user!, :only => [:graphics]
  
  def show
    @user = User.find(params[:id])
  end

  def graphics
    response, status = current_user.graphics.filter(
      params[:select], 
      params[:min_size].to_i, 
      params[:max_size].to_i
    )
    render :json => response, :status => status
  end
end
