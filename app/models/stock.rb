class Stock < ActiveRecord::Base
  attr_accessible :purchase_price, :quantity, :symbol, :portfolio_id
  belongs_to :portfolio
end
