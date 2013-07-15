class AddStrikeExpirationToStock < ActiveRecord::Migration
  def change
    add_column :stocks, :strike, :decimal   
    add_column :stocks, :expiration_date, :string   
    add_column :stocks, :stock_option, :integer   
  end
end
