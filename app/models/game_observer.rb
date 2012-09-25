class GameObserver < ActiveRecord::Observer
  def after_commit(game)
    return unless game.send(:transaction_include_action?, :create)
    
    HTTParty.post(
      "https://graph.facebook.com/me/#{FACEBOOK_APP_NAME}:create",  
      :body =>"access_token=#{game.author_token}&game=#{Rails.application.routes.url_helpers.play_path(game)}"
    ) if game.author.facebook?
  end
end
