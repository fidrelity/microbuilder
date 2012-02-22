Microbuilder::Application.routes.draw do

  devise_for :users, :controllers => { :omniauth_callbacks => "omniauth_callbacks" }
  root :to => 'pages#home'
  get '/editor', :to => 'pages#editor', :as => 'pages_editor'
end
