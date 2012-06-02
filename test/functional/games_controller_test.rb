require 'test_helper'

class GamesControllerTest < ActionController::TestCase

  def setup
    @game = Factory(:game)
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

  should "increase like only once because of cookies" do
    xhr :put, :like, :id => @game.id
    assert_response 200
    xhr :put, :like, :id => @game.id
    assert_equal 1, @game.reload.likes
  end

  should "update games correctly" do
    
  end
end