class Stock < ActiveRecord::Base
  attr_accessible :purchase_price, :quantity, :symbol
  belongs_to :portfolio
end
