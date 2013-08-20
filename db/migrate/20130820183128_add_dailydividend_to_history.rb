class AddDailydividendToHistory < ActiveRecord::Migration
  def change
    add_column :histories, :daily_dividend, :decimal, :precision => 10, :scale => 2
    add_column :histories, :daily_dividend_date, :datetime
  end
end
