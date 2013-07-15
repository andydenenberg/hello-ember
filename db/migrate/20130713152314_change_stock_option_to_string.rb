class ChangeStockOptionToString < ActiveRecord::Migration
  def up
    change_column :stocks, :stock_option, :string
  end

  def down
  end
end
