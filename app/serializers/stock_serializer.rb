class StockSerializer < ActiveModel::Serializer
  attributes :id, :symbol, :quantity, :purchase_price, :portfolio_id
end
