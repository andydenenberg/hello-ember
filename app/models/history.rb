class History < ActiveRecord::Base
  belongs_to :portfolio
  attr_accessible :cash, :options, :options_count, :stocks, :stocks_count, :total, :snapshot_date, :portfolio_id
  belongs_to :portfolio
end
