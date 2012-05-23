require 'test_helper'

class GamesControllerTest < ActionController::TestCase

  def setup
    @game = Factory.build(:game, :id => 1, :title => "test game", :user_id => 1, :played => 0, :dislikes => 0, :likes => 0)
    @game.save
  end

  should "increase played by one" do
    put :played, :id => 1
    assert_equal 1, @game.reload.played
  end

  should "increase dislike by one" do
    xhr :put, :dislike, :id => 1
    assert_response 200
    assert_equal 1, @game.reload.dislikes
  end

  should "increase like by two" do    
    xhr :put, :like, :id => 1
    assert_response 200
    xhr :put, :like, :id => 1
    assert_equal 2, @game.reload.likes
  end

end