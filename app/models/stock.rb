class Stock < ActiveRecord::Base
  attr_accessible :purchase_price, :quantity, :symbol, :name, :portfolio_id, :purchase_date, :strike, :expiration_date, :stock_option
  belongs_to :portfolio
end
