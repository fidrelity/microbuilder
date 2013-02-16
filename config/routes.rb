Playtin::Application.routes.draw do
  root :to => 'pages#home'
  
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }
  
  resources :users, :only => [:show, :update] do
    collection do
      get '/current/graphics', :to => 'users#graphics'
      get '/current/graphics/:backgrounds', :to => 'users#graphics'
    end
  end
  
  resources :graphics, :only => [:show, :create, :destroy, :new] do    
    member do
      put 'publish'
      get 'games'
    end

    collection do
      get 'public', :to => 'graphics#public'
      get 'search'
      get 'auto_complete'
    end
  end

  resources :games, :only => [:create, :destroy] do
    member do
      put 'played'
      put 'like'
      put 'dislike'
      post '/comment', :to => 'gameComments#create'
    end

    get :autocomplete_game_title, :on => :collection    

    collection do       
      get 'auto_search'
      get 'search', :to => 'games#search', :as => 'search'      
    end
  end

  post 'support/report', :to => 'support#report'
  post 'support/report_graphic', :to => 'support#report_graphic'
  post 'support/feedback', :to => 'support#feedback'
  post 'support/ticket', :to => 'support#ticket'
    
  get '/imprint', :to => 'pages#imprint'
  get '/tour', :to => 'pages#tour'
  get '/tour_new', :to => 'pages#tour_new'
  get '/gallery(/:type)', :to => 'games#index', :as => 'gallery'
  get '/play/:id', :to => 'games#show', :as => 'play'
  get '/play/:id/embed', :to => 'games#embed'
  get '/build', :to => 'games#new'
  get '/s3', :to => 'graphics#tunnel'
end
