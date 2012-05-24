require 'test_helper'

class GameControllerTest < ActionDispatch::IntegrationTest
  include Capybara::DSL


  should "show games" do
    #Capybara.current_driver = :selenium
    
    @game = Factory(:game, :id => 1, :title => "test game", :user_id => 1, :played => 0, :dislikes => 0, :likes => 0)

    visit play_path(1)
    find_by_id('like').click
    find_by_id('like').has_content?('Like (#{Game.find(1).likes})')

    #Capybara.current_driver = :webkit
  end 

end
