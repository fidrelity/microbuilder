require 'test_helper'

class GameCommentsControllerTest < ActionController::TestCase

  include Devise::TestHelpers

  def setup
    @request.env["devise.mapping"] = Devise.mappings[:user]
    @user = Factory(:user)
    sign_in @user

    @game = Factory(:game, :title => "test game", :user_id => @user.id)
  end

  should "create game comment" do
=begin  
    assert_difference('GameComment.count') do
      p @game.id      
      xhr :post, :create, :game_comment => { :comment => 'Some comment', :game_id => @game.id }
    end
=end
  end

end