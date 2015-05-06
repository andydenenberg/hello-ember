namespace :convert do

desc "Update Portfolios"
  task :update_holdings => :environment do
    require 'csv'

    base_dir = '/Users/andydenenberg/Desktop/Hellemb'
    files = Dir["#{base_dir}/*"]
    
# find the portfolios
# the histories are linked to the portfolio id's so don't delete Portfolios, just stocks
    portfolios = [ ]
    files.each do |file|
      portfolios.push( [ Portfolio.where(:name => File.basename(file).split('.').first).first, file ] )
    end
    
# for each portfolio
    portfolios.each do |portfolio, file|

# first find and delete old stocks
      stocks = portfolio.stocks
      puts "#{stocks.count} stocks found and deleted"
      stocks.delete_all
# then add the new stocks    
    stocks = CSV.read(file)  # Andy.CSV')
    stock_total = stocks[3..-3].inject(0) { |result, element| result + element[6].gsub('$','').gsub(',','').to_f }
    cash = stocks[-2][6].gsub('$','').gsub(',','').to_f
    puts "Stock Total: #{stock_total}"
    puts "Cash Total: #{cash}"

# update cash in portfolio
    portfolio.cash = cash
    portfolio.save
    
    stocks[3..-3].each do |s|
      symbol = s[0]
      stock_option = 'Stock'

      strike = nil
      expiration_date = nil
            
      if s[1][0..15].include?('CALL')
        stock_option = 'Call Option'
      elsif
      s[1][0..15].include?('PUT')
        stock_option = 'Put Option'
      end
      
      if stock_option != 'Stock'
#        BIDU 06/19/2015 210.00 C
         option = s[0].split(' ')
         strike = option[2].to_f
         symbol = option[0]
         expiration_date = option[1]
      end
      
      s = Stock.create!( :symbol => symbol,
                         :name => s[1][0..15],
                         :quantity => s[2].gsub(',','').to_f,
                         :purchase_price => 0,
                         :portfolio_id => portfolio.id,
                         :stock_option => stock_option,
                         :strike => strike,
                         :expiration_date => expiration_date,
                         :purchase_date => '12/31/2012' )
    end # stocks
  end # portfolios

  s = Stock.find_by_symbol('RDSA')
  s.symbol = 'RDS-A'
  s.save
  puts "########################"
  puts 'Added fix to change RDSA ---> RDS-A'
  puts "########################"

end # update_holdings

end # convert