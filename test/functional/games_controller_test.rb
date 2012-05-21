require 'test_helper'

class GamesControllerTest < ActionController::TestCase

  should "increase played by one" do
    @game = Factory.build(:game, :id => 1, :title => "mygame", :user_id => 1, :played => 0)
    @game.save
    
    #assert_difference(@game.played.to_s, 1) do
    #  put :played, :id => 1
    #end

    put :played, :id => 1
    assert_equal 1, @game.reload.played
  end

  should "increase dislike by one" do
    @game = Factory.build(:game, :id => 1, :title => "mygame", :user_id => 1, :dislikes => 0)
    @game.save
    
    xhr :put, :dislike, :id => 1
    assert_response 200
    assert_equal 1, @game.reload.dislikes
  end

  should "increase like by two" do
    @game = Factory.build(:game, :id => 1, :title => "mygame", :user_id => 1, :likes => 0)
    @game.save

    xhr :put, :like, :id => 1
    assert_response 200
    xhr :put, :like, :id => 1
    assert_equal 2, @game.reload.likes
  end

end