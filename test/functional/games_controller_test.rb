require 'test_helper'

class GamesControllerTest < ActionController::TestCase

  should "increase played by one" do
    @game = Factory.build(:game, :id => 1, :title => "mygame", :user_id => 1, :played => 0)
    @game.save
    put :played, :id => 1
    assert_response 200
    assert_equal 1, @game.reload.played
  end

  should "increase dislike by one" do
    @game = Factory.build(:game, :id => 1, :title => "mygame", :user_id => 1, :dislikes => 0)
    @game.save
    put :dislike, :id => 1
    assert_response 200
    assert_equal 1, @game.reload.dislikes
  end

  should "increase like by one" do
    @game = Factory.build(:game, :id => 1, :title => "mygame", :user_id => 1, :likes => 0)
    @game.save
    put :like, :id => 1
    put :like, :id => 1
    assert_equal 2, @game.reload.likes
  end

end