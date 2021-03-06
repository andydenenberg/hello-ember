class PortfoliosController < ApplicationController
  
  before_filter :restrict_access, :except => ["graph_data", "grats"]
  # need to move to application controlller and except the auth.json
  
  def grats
    quants = [ 46043, 17140, 11105, 11956, 20928, ] 
	   # [ 80431, 31000, 18133, 20000, 28778 ]
    symbols = ['csco','crm','msft','intc','amat']
    costs = [ 1076070.00, 1108836.00, 406866.00, 283692.00, 233090.00 ]
	   # [ 2104879.27, 2168140.00, 796038.70, 554400.00, 458721.32]
    @cash = 235782 # 155000
    @latest = [ ]
        prices = Options.stock_price(symbols)
        @total = 0
        prices.each do |s|
          symbol = s['Symbol']
          index = symbols.index(symbol)
          value = quants[index] * s['LastTrade'].to_d
          profit = (quants[index] * s['LastTrade'].to_d) - costs[index]
          change = (quants[index] * s['Change'].to_d)
          @total += profit   
          @latest.push [ symbol.upcase, quants[index], change, profit, s['LastTrade'] ]
        end
  end
  
  def graph_data
    gd = Options.daily_totals('07/22/2013', days=2000, portfolios = Portfolio.all.collect { |port| port.id } )
    total = gd
    render text: total.inspect
  end
  
  def index
    render json: Portfolio.all
  end
  
  def show
    portfolio = Portfolio.find(params[:id])
    render json: portfolio
  end
  
  def update
    portfolio = Portfolio.find(params[:id])
    if update_portfolio(portfolio)
      render json: portfolio, status: :ok
    else
      render json: portfolio.errors, status: :unprocessable_entity
    end
  end

  def create
    portfolio = Portfolio.new
    if update_portfolio(portfolio)
      render json: portfolio, status: :created
    else
      render json: portfolio.errors, status: :unprocessable_entity
    end
  end
  
  def destroy
    portfolio = Portfolio.find(params[:id])
    portfolio.stocks.each { |stock| stock.delete }
    portfolio.destroy
    render json: nil, status: :ok
  end

  private

  def restrict_access
    @user= User.find_by_authentication_token(request.headers['token'])
    head :unauthorized unless !@user.nil?
  end
  
  def permitted_params
    params.require(:portfolio).permit(:name, :cash, :id, stocks: [:id, :symbol, :quantity, :purchase_price, :portfolio_id, :purchase_date, :stock_option, :strike, :expiration_date ] )
  end

    def update_portfolio(portfolio)
      portfolio_params = permitted_params
      
      stocks_param = portfolio_params.extract!(:stocks)
      stocks_param = stocks_param[:stocks]
      stocks_param ||= []
      
      # Because updates to the contact and its associations should be atomic,
      # wrap them in a transaction.
      Portfolio.transaction do
        # Update the contact's own attributes first.
        portfolio.attributes = portfolio_params
        portfolio.save!

          # Update the portfolio's stocks, creating/destroying as appropriate.
          specified_stocks = []
          stocks_param.each do |stock_params|
            if stock_params[:id]
              st = portfolio.stocks.find(stock_params[:id])
              st.update_attributes(stock_params)
            else
              st = portfolio.stocks.create(stock_params)
            end
            specified_stocks << st
          end
          portfolio.stocks.each do |st|
            st.destroy unless specified_stocks.include?(st)
          end
      end

      # Important! Reload the portfolio to ensure that changes to its associations
      # will be serialized correctly.
      portfolio.reload

      return true
    rescue
      return false
    end

end
