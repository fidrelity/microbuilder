require 'test_helper'

class GamesControllerTest < ActionController::TestCase

  should "increase played by one" do
    @game = Factory.build(:game, :id => 1, :title => "mygame", :user_id => 1, :played => 0)
    @game.save
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

  should "increase like by one" do
    @game = Factory.build(:game, :id => 1, :title => "mygame", :user_id => 1, :likes => 0)
    @game.save
    assert_difference(@game.reload.likes.to_s, 2) do      
      xhr :put, :like, :id => 1
      xhr :put, :like, :id => 1
      #xhr :like, :put => {:id => 1}
    end    
  end

end