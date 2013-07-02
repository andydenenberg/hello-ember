class PortfolioSerializer < ActiveModel::Serializer
  attributes :id, :name, :cash
  has_many :stocks, embed: :objects
end
