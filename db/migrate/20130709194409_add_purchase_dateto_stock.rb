class AddPurchaseDatetoStock < ActiveRecord::Migration
  def up
    add_column :stocks, :purchase_date, :string   
  end

  def down
  end
end
