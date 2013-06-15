class StockController < ApplicationController

def index
  @stocks = Stock.all
  respond_to do |format|
    format.html
    format.json { render json: @stocks }
  end
end

end
