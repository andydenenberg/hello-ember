class Portfolio < ActiveRecord::Base
  attr_accessible :name, :user_id, :cash
  has_many :stocks, :dependent => :destroy
  has_many :histories, :dependent => :destroy
  
end
