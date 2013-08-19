HelloEmber::Application.routes.draw do

  devise_for :users

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
      get 'refresh_daily_dividend'
      get 'repo_list'
      get 'update_prices'
      get 'stock_price'
      get 'option_price'
    end
  end
    
  resources :portfolios do
    collection do
      get 'graph_data'
    end
  end
  
  post 'auth', to: 'auth#create_session'
  match 'get_user' => 'auth#get_user'
  
end

