class AddDividenddateToPrice < ActiveRecord::Migration
  def change
    add_column :prices, :daily_dividend_date, :datetime
  end
end
