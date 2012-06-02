require 'test_helper'

class GamesControllerTest < ActionController::TestCase

  def setup
    @game = Factory(:game)
    @user = Factory(:user)
  end

  should "increase played by one" do
    put :played, :id => @game.id
    assert_equal 1, @game.reload.played
  end

  should "increase dislike by one" do
    xhr :put, :dislike, :id => @game.id
    assert_response 200
    assert_equal 1, @game.reload.dislikes
  end

  should "increase like only by 1 because of cookies" do
    xhr :put, :like, :id => @game.id
    assert_response 200
    xhr :put, :like, :id => @game.id
    assert_equal 1, @game.reload.likes
  end
end