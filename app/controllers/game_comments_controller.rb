class GameCommentsController < ApplicationController
  respond_to :js, :only => [:create]
  
  def create
    @comment = GameComment.new(params[:game_comment])
    @comment.save    

    #render :json => {:data => @comment, :status => 200}
    #response, status = [add_comment(@comment), 200]
    #render :json => @comment, :status => 200
    
    #redirect_to play_path(params[:game_comment][:game_id])    
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