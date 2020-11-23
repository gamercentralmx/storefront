Rails.application.routes.draw do
  root to: 'welcome#index'
  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }

  localized do
    resources :orders, only: [:index, :show, :update] do
      member do
        get :confirm
        get :checkout
      end
    end

    resources :profile, only: [:index]

    resources :addresses, except: [:show]

    resources :payment_methods, except: [:show, :edit, :update] do
      member do
        get :installments
        put :make_default
        post :charge
      end
    end

    resources :payment_intents, only: [:index, :create] do
      member do
        put :confirm
      end
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
