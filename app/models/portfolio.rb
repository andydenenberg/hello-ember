class Portfolio < ActiveRecord::Base
  attr_accessible :name, :user_id, :cash
  has_many :stocks
end
