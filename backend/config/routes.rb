Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  get '/csrf-token', to: 'application#csrf_token'
  get '/auth/spotify/callback', to: 'spotify#callback'
  

  namespace :api do
    namespace :v1 do
      post '/register', to: 'authentication#register'
      post '/login', to: 'authentication#login'
      get '/me/spotify_token', to: 'users#spotify_token'
      get '/me/album_summaries', to: 'users#album_summaries'
      resources :tiers, only: [:index]
      resources :albums, only: [:index, :show] do
        get 'songs', on: :member
        resources :rankings, only: [:index]
      end
      resources :rankings, only: [:create, :update, :destroy]
    end
  end

  # Defines the root path route ("/")
  # root "posts#index"
end
