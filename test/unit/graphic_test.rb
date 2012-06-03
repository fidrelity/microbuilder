require 'test_helper'

class GraphicTest < ActiveSupport::TestCase
  
  should "have valid factory" do
    assert Factory.build(:graphic).valid?
  end

  should "select correct graphics" do
    @user = Factory(:user)
    @graphic = Factory(:graphic, :frame_width => 32, :frame_height => 255)
    @user.graphics << @graphic
    @user.graphics << Factory(:graphic)
    @a = Factory(:graphic, :background => true)
    @user.graphics << @a
    @user.graphics << Factory(:graphic, :public => true)
    
    assert_equal [@a], @user.graphics.filter(false, true, 0, 256)
  end
end