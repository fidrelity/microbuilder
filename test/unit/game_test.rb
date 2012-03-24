require 'test_helper'

class GameTest < ActiveSupport::TestCase

  should "have valid factory" do
    assert Factory.build(:graphic).valid?
    assert Factory.build(:game).valid?
  end

  should "delete game and unreferenced graphics" do
    @graphic_with_user = Factory(:graphic)
    @graphic_without_user = Factory(:graphic)
    @graphic_without_user.update_attribute(:user, nil)
    @game = Factory(:game)
    @game.graphics << @graphic_with_user
    @game.graphics << @graphic_without_user

    assert_equal [@graphic_with_user, @graphic_without_user], Graphic.all
    @game.destroy
    assert_equal [@graphic_with_user], Graphic.all
  end
end


