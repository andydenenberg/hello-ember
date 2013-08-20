class Price < ActiveRecord::Base
  attr_accessible :ask, :bid, :change, :exp_date, :last_update, :last_price, :price_time,
                  :sec_type, :strike, :symbol, :daily_dividend, :daily_dividend_date
end
