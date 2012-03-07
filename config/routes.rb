Microbuilder::Application.routes.draw do
  root :to => 'pages#home'
  
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }
  
  resources :users, :only => [:show]
  resources :graphics, :only => [:create]
  resources :games, :only => [:index, :show, :new, :create], :paths => {
    :index => 'gallery',
    :show => 'play',
    :new => 'build'
  }
  
  get '/editor', :to => 'pages#editor', :as => 'pages_editor' #route for testing only
end
