Microbuilder::Application.routes.draw do

  root :to => 'pages#home'

  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }
  resources :users, :only => [:show]

  get '/editor', :to => 'pages#editor', :as => 'pages_editor'
end
