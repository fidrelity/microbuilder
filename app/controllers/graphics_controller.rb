class GraphicsController < ApplicationController
  respond_to :js, :only => [:create, :show, :public, :destroy]
  before_filter :authenticate_user!, :only => [:create, :destroy]
  
  def index
    @graphics = Graphic.all
  end

  def show
    @graphic = Graphic.find(params[:id])
    response = @graphic.to_response_hash(current_user) if (@graphic.user == current_user || @graphic.public)
    render :json => response
  end

  def create
    @graphic = current_user.graphics.create(params[:graphic])
    flash[:success] = "Your Graphic was created!"
  end
  
  def destroy
    @user = current_user
    graphic = @user.graphics.find(params[:id])
    flash[:success] = "Successfully deleted graphic" if graphic && graphic.destroy
    @graphics = @user.graphics.without_backgrounds.with_authorization(current_user).paginate(:page => params[:graphics], :per_page => 12)
    @backgrounds = @user.graphics.backgrounds.with_authorization(current_user).paginate(:page => params[:backgrounds], :per_page => 12)
    @games = @user.games.paginate(:page => params[:games], :per_page => 9)
  end
  
  def public
    begin
      response = {}
      per_page = !!params[:backgrounds] ? 10 : 14
      graphics = Graphic.filter(
        true,
        !!params[:backgrounds],
        params[:min_size].to_i,
        params[:max_size].to_i
      ).paginate(:page => params[:page], :per_page => per_page)
    rescue InvalidGraphicBoundaries => e
      render :json => e.message, :status => 400
      return
    end
    response['size'] = graphics.count
    response['graphics'] = graphics.map! { |graphic| graphic.to_response_hash(current_user) } 

    render :text => response.to_json, :status => 200
  end

  def search

    graphics = Graphic.search(params[:term])
    response = {}
    graphics.paginate(:page => params[:page], :per_page => 14)
    response['size'] = graphics.count
    response['graphics'] = graphics.map! { |graphic| graphic.to_response_hash(current_user) }
    
    render :text => response.to_json, :status => 200
  end

  def auto_complete
    graphics = get_like(params[:term], params[:background])
    render :text => graphics.map { |graphic| "#{graphic.name}" } # (by #{graphic.user.display_name})
  end
  
  def tunnel
    response.headers['Content-Type'] = 'image/png'
    response.headers["Access-Control-Allow-Origin"]= '*'
    img_data = HTTParty.get(params[:url]).body
    render :text => img_data
  end

  protected

    # Retuns all graphics with name like %term%
    def get_like(term, isBackground)
      isBackground = isBackground === "undefined" ? false : isBackground
      graphics = Graphic.order(:name).where("lower(name) like ? AND background = ?", "%#{term.downcase}%", isBackground)
    end      

end
