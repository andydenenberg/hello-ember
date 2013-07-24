class Price < ActiveRecord::Base
  attr_accessible :ask, :bid, :change, :exp_date, :last_update, :last_price, :price_time,
                  :sec_type, :strike, :symbol
end
