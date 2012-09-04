class GameCommentsController < ApplicationController
  respond_to :js, :only => [:create]
  before_filter :authenticate_user!, :only => [:create, :destroy]
  
  def create
    comment = current_user.game_comments.create(params[:game_comment])
    @game = comment.game
    flash[:success] = "Your comment was created!"
    Stream.create_message("comment", comment.user.id, @game.id)
    @comments = @game.game_comments
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