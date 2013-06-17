class StocksController < ApplicationController

  def index
    render json: Stock.all
  end

end
