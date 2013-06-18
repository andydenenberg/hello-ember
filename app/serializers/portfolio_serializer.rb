class PortfolioSerializer < ActiveModel::Serializer
  attributes :id, :name 
  has_many :stocks, embed: :objects
end
