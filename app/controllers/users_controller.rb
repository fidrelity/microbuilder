class UsersController < ApplicationController
  respond_to :js, :only => [:graphics, :show]
  before_filter :authenticate_user!, :only => [:graphics]
  
  def show
    @user = User.find(params[:id])
    @graphics = @user.graphics.paginate(:page => params[:graphics_page], :per_page => 4)
    @games = @user.games.paginate(:page => params[:games_page], :per_page => 3)
  end

  def graphics
    begin
      graphics = current_user.graphics.filter(
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

    render :json => response.to_json, :status => 200
  end
end
  