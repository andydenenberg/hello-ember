class AddDividendToPrice < ActiveRecord::Migration
  def change
    add_column :prices, :daily_dividend, :decimal, :precision => 10, :scale => 2
  end

end
