class AddCashToPortfolio < ActiveRecord::Migration
  def change
    add_column :portfolios, :cash, :decimal   
  end
end
