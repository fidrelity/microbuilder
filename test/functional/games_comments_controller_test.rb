require 'test_helper'

class GameCommentsControllerTest < ActionController::TestCase

  should "create game comment" do
    #controller.stub(:authenticate_user!).and_return true

    @game = Factory.build(:game, :title => "mygame", :user_id => 1, :played => 0)
    @game.save

    assert_difference('GameComment.count') do
      post :create, :post => { :comment => 'Some comment', :game_id => 1}
    end
  end

end