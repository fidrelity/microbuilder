class UsersController < ApplicationController
  respond_to :json, :only => [:graphics, :show]
  before_filter :authenticate_user!, :only => [:graphics]
  
  def show
    @user = User.find(params[:id])
    @graphics = @user.graphics.without_backgrounds.with_authorization(current_user).paginate(:page => params[:graphics], :per_page => 12)
    @backgrounds = @user.graphics.backgrounds.with_authorization(current_user).paginate(:page => params[:backgrounds], :per_page => 12)
    @games = @user.games.paginate(:page => params[:games], :per_page => 9)
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
      ).paginate(:page => params[:page], :per_page=> per_page)
    rescue InvalidGraphicBoundaries => e
      render :json => e.message, :status => 400
      return
    end
    response['size'] = graphics.count
    response['graphics'] = graphics.map! { |graphic| graphic.to_response_hash(current_user) }

    render :json => response.to_json, :status => 200
  end
end
  