Microbuilder::Application.routes.draw do
  root :to => 'pages#home'
  
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }
  
  resources :users, :only => [:show]
  resources :graphics, :only => [:create, :destroy] do
    collection do
      get 'public', :to => 'graphics#public'
    end
  end
  resources :games, :only => [:create]
  
  get '/gallery', :to => 'games#index'
  get '/play/:id', :to => 'games#show', :as => 'play'
  get '/play/:id/embed', :to => 'games#embed'
  get '/build', :to => 'games#new'
  get '/editor', :to => 'pages#editor', :as => 'pages_editor' #route for testing only
end
