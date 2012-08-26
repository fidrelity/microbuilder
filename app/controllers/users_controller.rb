class UsersController < ApplicationController
  respond_to :json, :only => [:graphics, :show]
  before_filter :authenticate_user!, :only => [:graphics]
  
  def show
    @user = User.find(params[:id])
    if current_user == @user
      @graphics = @user.graphics.without_backgrounds
      @backgrounds = @user.graphics.backgrounds
    else
      @graphics = @user.graphics.with_public.without_backgrounds
      @backgrounds = @user.graphics.backgrounds.with_public
    end
    @graphics_size = @graphics.size
    @backgrounds_size = @backgrounds.size
    @graphics = @graphics.paginate(:page => params[:graphics], :per_page => 12)
    @backgrounds = @backgrounds.paginate(:page => params[:backgrounds], :per_page => 12)
    @games = @user.games.paginate(:page => params[:games], :per_page => 6)
  end

  def graphics
    begin
      graphics = current_user.graphics.filter(
        nil,
        !!params[:backgrounds],
        params[:min_size].to_i,
        params[:max_size].to_i
      ).paginate(:page=>params[:page],:per_page=>12)
    rescue InvalidGraphicBoundaries => e
      render :json => e.message, :status => 400
      return
    end
    
    response = graphics.map do |graphic|
        graphic.to_response_hash(current_user)
    end

    render :json => response.to_json, :status => 200
  end
end
  