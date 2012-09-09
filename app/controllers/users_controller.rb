class UsersController < ApplicationController
  respond_to :json, :only => [:graphics, :show]
  before_filter :authenticate_user!, :only => [:graphics]
  
  def show
    @user = User.find(params[:id])

    graphics_to_show = Graphic.profile_filter(@user.id, current_user)

    @graphics = graphics_to_show[:graphics].paginate(:page => params[:graphics], :per_page => 12)
    @backgrounds = graphics_to_show[:backgrounds].paginate(:page => params[:backgrounds], :per_page => 12)
    
    @graphics_size = graphics_to_show[:graphics].size
    @backgrounds_size = graphics_to_show[:backgrounds].size

    @games = @user.games.paginate(:page => params[:games], :per_page => 6)
    @messages = @user.latest_stream
  end
  
  def update
    @user = User.find(params[:id])
    if current_user == @user
      if @user.update_attributes(params[:user])
        flash[:success] = "Successfully updated profile"
      else
        flash[:error] = "Not a valid username"
      end
    end
  end

  def graphics
    begin
      response = {}
      per_page = !!params[:backgrounds] ? 10 : 14
      graphics = current_user.graphics.filter(
        nil,
        !!params[:backgrounds],
        params[:min_size].to_i,
        params[:max_size].to_i
      )
      response['size'] = graphics.count
      graphics.paginate(:page=>params[:page],:per_page=>per_page)
    rescue InvalidGraphicBoundaries => e
      render :json => e.message, :status => 400
      return
    end
    
    response['graphics'] = graphics.map! do |graphic|
        graphic.to_response_hash(current_user)
    end

    render :json => response.to_json, :status => 200
  end
end
  