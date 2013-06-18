class PortfoliosController < ApplicationController

  def index
    render json: Portfolio.all
  end

end
