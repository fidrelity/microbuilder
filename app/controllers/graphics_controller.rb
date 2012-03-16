class GraphicsController < ApplicationController
  respond_to :js, :only => :create
  def index
    @graphics = Graphic.all
  end

  def create
    if current_user
      @graphic = current_user.graphics.new(params[:graphic])
      p '*' * 20
      if @graphic.save
        render :json => create_response(@graphic), :status => 200
      else
        render :json => @graphic.errors.to_json, :status => 400
      end
    else
      render :text => "No User supplied", :status => 400
    end
  end
  
  def destroy
    @graphic = Graphic.find(params[:id])
    @graphic.destroy if @graphic.user = current_user
  end
  
  private
    def create_response(graphic)
      user_name = graphic.user.display_name if graphic.user
      {:id => graphic.id, :name => graphic.image_file_name, :url => graphic.image, :user_name => user_name}
    end
end
