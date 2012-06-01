require 'test_helper'

class UsersControllerTest < ActionController::TestCase
  include Devise::TestHelpers
  
  def setup
    @user = Factory(:user)
    Factory(:graphic, :background => false, :user => @user)
    Factory(:graphic, :background => true, :user => @user)
  end

  should "return backgrounds of user" do
    sign_in @user
    response = xhr :get, :graphics, {:backgrounds => "backgrounds"}
    response_objects = JSON.parse(response.body)
  
    assert_equal 1, response_objects.count
  end
end