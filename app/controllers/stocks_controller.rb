class StocksController < ApplicationController

  def index
    render json: Stock.all
  end
  
  def quote
    symbol = params[:symbol]
    
    price = MarketBeat.last_trade_real_time(symbol).to_f
    time = MarketBeat.last_trade_time_real_time(symbol)
    change = MarketBeat.change_real_time(symbol)
    render json: { 'symbol' => symbol, 'price' => price, 'time' => time, 'change' => change }  
  end
  
  def current_price
    puts Price.update_counter
    Price.inc_counter
#    puts status = Thread.list.find { |thread| thread[:name] == 'UpdateThread' }.inspect.split(' ')
#    puts "#{status[0][2..-1]} => Status: #{status[1][0..-2].capitalize}"
    
    stock = Stock.find(params[:id])
    resp = Price.price(stock.symbol)
    render json: { 'symbol' => stock.symbol, 'price' => resp[0], 'time' => resp[1], 'change' => resp[2] }
  end

  def show
    stock = Stock.find(params[:id])
    render json: stock
  end
  
  def update
    stock = Stock.find(params[:id])
    if update_stock(stock)
      render json: stock, status: :ok
    else
      render json: stock.errors, status: :unprocessable_entity
    end
  end

  def create
    stock = Stock.new
    if update_stock(stock)
      render json: stock, status: :created
    else
      render json: stock.errors, status: :unprocessable_entity
    end
  end
  
  def destroy
    stock = Stock.find(params[:id])
    stock.destroy
    render json: nil, status: :ok
  end
  

  private

    def permitted_params
      params.require(:stock).permit(:symbol, :quantity, :purchase_price, :portfolio_id, :id, :purchase_date )
    end

    def update_stock(stock)

      # Because updates to the stock and its associations should be atomic,
      # wrap them in a transaction.
      Stock.transaction do
        # Update the stock's own attributes first.
        stock.attributes = permitted_params
        stock.save!
      end

      # Important! Reload the stock to ensure that changes to its associations
      # will be serialized correctly.
      stock.reload

      return true
    rescue
      return false
    end

end
