require 'test_helper'

class GraphicsControllerTest < ActionController::TestCase

  def setup
    Factory(:graphic,  :frame_width => 199, :frame_height => 256)
    Factory(:graphic, :frame_width => 256, :frame_height => 256)
    Factory(:graphic, :frame_width => 200, :frame_height => 300)
    Factory(:graphic, :background => true, :frame_width => 200, :frame_height => 300)
  end

  should "return correct graphics" do
    response = xhr :get, :public, {:backgrounds => false, :min_size => "200", :max_size => "300"}
    response_objects = JSON.parse(response.body)
  
    assert_equal 2, response_objects.count
  end
  
  should "return error" do
    response = xhr :get, :public, {:backgrounds => false, :min_size => "2", :max_size => "1"}
    assert_equal "Boundaries invalid", response.body
  end
end