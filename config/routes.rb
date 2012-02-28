Microbuilder::Application.routes.draw do
  root :to => 'pages#home'
  
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }

  resources :users, :only => [:show] do
    resources :graphics, :controller => 'user/assets'#, :only => [:index]
  end
  resources :graphics, :only => [:create]
  
  get '/editor', :to => 'pages#editor', :as => 'pages_editor'
end
