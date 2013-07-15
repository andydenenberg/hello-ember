class StockSerializer < ActiveModel::Serializer
  attributes :id, :symbol, :quantity, :purchase_price, :portfolio_id, :purchase_date, :stock_option, :strike, :expiration_date
            
  def created_date               
    "#{object.created_at.strftime("%m/%d/%Y")}"  # prepare for javascript
  end
  
end
