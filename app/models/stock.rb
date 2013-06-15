class Stock < ActiveRecord::Base
  attr_accessible :purchase_price, :quantity, :symbol
end
