Rails.application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }
  root to: 'welcome#index'

  resources :orders, only: [:index, :show] do
    member do
      get :checkout
    end
  end

  namespace :admin do
    root to: 'dashboard#index'

    resources :categories
    resources :products
    resources :orders
    resources :users
  end
end
