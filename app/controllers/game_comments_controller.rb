class GameCommentsController < ApplicationController
  #respond_to :js, :only => [:create, :index, :update]
  
  def create
    @comment = GameComment.new(params[:game_comment])
    @comment.save    

    redirect_to play_path(params[:game_comment][:game_id])

    #render :json => response, :status => status
  end
  
  def destroy
    @comment = GameComment.find(params[:id])
    if @comment.user == current_user
      @comment.destroy
      flash[:notice] = "Successfully deleted comment"
    end    
    #redirect_to user_path(@game.author)
  end
end