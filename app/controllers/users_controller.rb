class UsersController < ApplicationController
  respond_to :js, :only => [:graphics]
  before_filter :authenticate_user!, :only => [:graphics]
  
  def show
    @user = User.find(params[:id])
  end

  def graphics
    graphics = case params[:select]
      when "all" 
        current_user.graphics
      when "backgrounds"
        current_user.graphics.backgrounds
      else
        current_user.graphics.without_backgrounds        
    end
    
    response = graphics.collect do |graphic|
      graphic.to_response_hash
    end
    
    render :json => response, :status => 200
  end
end
