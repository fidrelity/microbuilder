Playtin::Application.routes.draw do
  root :to => 'pages#home'
  
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }
  
  resources :users, :only => [:show] do
    collection do
      get '/current/graphics', :to => 'users#graphics'
      get '/current/graphics/:select', :to => 'users#graphics'
    end
  end
  
  resources :graphics, :only => [:create, :destroy] do
    collection do
      get 'public', :to => 'graphics#public'
    end
  end

  resources :games, :only => [:create, :destroy] do
    member do
      put 'played'
      put 'like'
      put 'dislike'
      post '/comment', :to => 'gameComments#create'
    end
    
    collection do 
      get 'auto_search'
      get 'search', :to => 'games#search', :as => 'search'
      #get 'auto_search', :to => 'games#auto_search', :as => 'auto_search'
    end
  end

  post 'support/report', :to => 'support#report'
  post 'support/feedback', :to => 'support#feedback'    
  post 'support/ticket', :to => 'support#ticket'
  
  #get '/games/auto_search'
  #get '/games/autocomplete_game_title'
  get '/imprint', :to => 'pages#imprint'
  get '/gallery(/:type)', :to => 'games#index', :as => 'gallery'
  get '/play/:id', :to => 'games#show', :as => 'play'
  get '/play/:id/embed', :to => 'games#embed'
  get '/build', :to => 'games#new'
  get '/editor', :to => 'pages#editor', :as => 'pages_editor' #route for testing only
end
