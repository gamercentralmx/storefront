Rails.application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }
  root to: 'welcome#index'

  resources :orders, only: [:index, :show, :update] do
    member do
      get :confirm
      get :checkout
    end
  end

  resources :payment_methods, only: [:index, :create] do
    member do
      get :installments
      put :make_default
      post :charge
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
