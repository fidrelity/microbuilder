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
    graphic = current_user.graphics.find(params[:id])
    flash[:success] = "Successfully deleted graphic" if graphic && graphic.destroy
    @graphics = current_user.graphics.paginate(:page => params[:graphics_page], :per_page => 4)
  end
  
  def public
    begin
      graphics = Graphic.filter(
        true,
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
    
    render :text => response.to_json, :status => 200
  end

  def search

    graphics = Graphic.order(:name).where("name like ? AND background = ?", "%#{params[:term]}%", params[:background])

    response = graphics.map do |graphic|
        graphic.to_response_hash(current_user)
    end
    
    render :text => response.to_json, :status => 200

  end

  def auto_complete
    isBackground = params[:background] === "undefined" ? false : params[:background]

    graphics = Graphic.order(:name).where("name like ? AND background = ?", "%#{params[:term]}%", isBackground)
    render :text => graphics.map(&:name)
  end
  
  def tunnel
    response.headers['Content-Type'] = 'image/png'
    response.headers["Access-Control-Allow-Origin"]= '*'
    img_data = HTTParty.get(params[:url]).body
    render :text => img_data
  end
end
