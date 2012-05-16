class GameCommentsController < ApplicationController
  respond_to :js, :only => [:create]
  before_filter :authenticate_user!, :only => [:create, :destroy]
  
  def create
    comment = GameComment.create(params[:game_comment])
    @comments = comment.game.game_comments
    @game = comment.game
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