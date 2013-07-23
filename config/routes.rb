HelloEmber::Application.routes.draw do

  root :to => 'application#home'
  match 'index' => 'application#index'
  match 'reference' => 'application#reference'
  match 'home' => 'application#home'
  
#  match "/*path" => "application#index"
#  match 'stocks' => "stocks#index"
#  match 'portfolios' => "portfolios#index"
  
  resources :stocks do
    member do
      get 'current_price'
    end
    
    collection do
      get 'update_prices'
      get 'stock_price'
      get 'option_price'
    end
  end
    
  resources :portfolios
  
  post 'auth', to: 'auth#create_session'
  
end

