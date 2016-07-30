class StocksController < ApplicationController
  before_filter :restrict_access, :except => ["repo_list"]
  # need to move to application controlller and except the auth.json
    
  def repo_list
    stocks = Price.where(:sec_type => 'Stock')
    @stocks = stocks.collect { |stock| [stock, stock.last_update] }
    @options = Price.where('sec_type != ?','Stock')
    @history = History.all
  end
  
  def index
    render json: Stock.all
  end
  
  def option_price
    render json: Options.option_price( params[:symbol],params[:strike],params[:expiration] )   # { 'resp' => strike + symbol + expiration }
  end
  
  def stock_price
    symbol = params[:symbol]    
    resp = Options.stock_price(symbol)
    render json: { 'symbol' => symbol, 'price' => resp[0], 'time' => resp[1], 'change' => resp[2] }
  end
  
  def refresh_daily_dividend
    date = params[:date] ||= (Time.now - 1.day).strftime("%m/%d/%Y")
    start = Time.now
    system "rake demo:refresh_daily_dividend RAILS_ENV=#{Rails.env} DATE=#{date} --trace >> #{Rails.root}/log/rake.log &"
#    Options.refresh_daily_dividend(date)
    duration = Time.now - start
    render json: { 'response' => "Dividends collected for #{date}", 'duration' => duration }
  end
  
  def update_prices
    start = Time.now
      system "rake demo:refresh_all RAILS_ENV=#{Rails.env} REALTIME=#{params[:real_time]} --trace >> #{Rails.root}/log/rake.log &"
#    real_time = params[:real_time] == 'true' ? true : false
#    update = Options.refresh_all(real_time)
    duration = Time.now - start
    render json: { 'duration' => duration, 'count' => Price.all.count }
  end
  
  def current_price
    security = Stock.find(params[:id])
    real_time = params[:real_time] == 'true' ? true : false
    
    if security.stock_option == 'Stock'
      resp = Options.local_stock_price(security.symbol,real_time)
      render json: {  :symbol => security.symbol, :price => resp[1],
                      :time => resp[0], :change => resp[2],
                      :daily_dividend => resp[3], :daily_dividend_date => resp[4].strftime("%m/%d/%y") }
    else
      resp = Options.local_option_price(security.symbol, security.stock_option, security.strike, security.expiration_date )
      render json: { 'symbol' => security.symbol, 'time' => resp[0], 'bid' => resp[1], 'ask' => resp[2], 'previous_close' => resp[3] }
    end
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
  
    def restrict_access
      @user= User.find_by_authentication_token(request.headers['token'])
      head :unauthorized unless !@user.nil?
    end
  
    def permitted_params
      params.require(:stock).permit(:symbol, :quantity, :purchase_price, :portfolio_id, :id, :purchase_date, :stock_option, :strike, :expiration_date )
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
