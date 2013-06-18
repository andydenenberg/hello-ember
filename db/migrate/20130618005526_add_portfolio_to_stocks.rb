class AddPortfolioToStocks < ActiveRecord::Migration
  def change
    add_column :stocks, :portfolio_id, :integer
  end
end
