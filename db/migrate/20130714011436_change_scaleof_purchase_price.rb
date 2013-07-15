class ChangeScaleofPurchasePrice < ActiveRecord::Migration
  def up
    change_column :stocks, :purchase_price, :decimal, :precision => 10, :scale => 2
  end

  def down
  end
end
