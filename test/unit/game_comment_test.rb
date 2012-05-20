require 'test_helper'

class GameCommentTest < ActiveSupport::TestCase

  should "not be saved without body" do
    @no_body_comment = Factory.build(:game_comment, :comment => "")
    assert_equal false, @no_body_comment.save
  end

  should "not be saved without game id" do
    @no_gid_comment = Factory.build(:game_comment, :comment => "This it is", :game_id => "")
    assert_equal false, @no_gid_comment.save
  end

  should "be created" do
    @comment = Factory.build(:game_comment, :comment => "This it is", :game_id => "1")
    assert_equal true, @comment.save
  end 
end