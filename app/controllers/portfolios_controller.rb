class PortfoliosController < ApplicationController

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


    private

      def permitted_params
        params.require(:portfolio).permit(:name, :id, stocks: [:id, :symbol, :quantity, :purchase_price, :portfolio_id] )
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
