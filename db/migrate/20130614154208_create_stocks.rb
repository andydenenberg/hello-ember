class CreateStocks < ActiveRecord::Migration
  def change
    create_table :stocks do |t|
      t.string :symbol
      t.decimal :quantity
      t.decimal :purchase_price

      t.timestamps
    end
  end
end
