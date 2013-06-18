class Portfolio < ActiveRecord::Base
  attr_accessible :name, :user_id  
  has_many :stocks
end
