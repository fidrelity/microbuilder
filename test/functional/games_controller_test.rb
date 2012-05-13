require 'test_helper'

class GamesControllerTest < ActionController::TestCase
  #test "should get home" do
  #  get :home
  #  assert_response :success
  #end

  should "increase played by one" do
    @game = Factory.build(:game, :id => 1, :title => "mygame", :user_id => 1, :played => 0)
    @game.save
    put :played, :id => 1
    assert_response 200
    assert_equal 1, @game.reload.played
  end

end
