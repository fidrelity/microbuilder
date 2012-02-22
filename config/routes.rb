Microbuilder::Application.routes.draw do
  root :to => 'pages#home'
  get '/editor', :to => 'pages#editor', :as => 'pages_editor'
end
