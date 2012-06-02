class GameObserver < ActiveRecord::Observer

  def after_create(game)
    p '*' * 30
    p 'in observer. token: #{session[:facebook_token]}'
    
    HTTParty.post(
      "https://graph.facebook.com/me/#{FACEBOOK_APP_NAME}:create",  
      :body =>"access_token=#{session[:facebook_token]}&game=#{play_url(game)}"
    ) if game.author.facebook?
  end
end
