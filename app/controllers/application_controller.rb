class ApplicationController < ActionController::Base
  protect_from_forgery

  class Price
    # Repository of latest prices of stocks
    @@stocks = { }
    @@update_counter = 0

    def self.update_counter
      @@update_counter
    end
    
    def self.inc_counter
      if @@update_counter > 10
        @@update_counter = 0
        refresh_prices
      else
        @@update_counter += 1
      end
    end

    def self.add(symbol,price)
      @@stocks[symbol.upcase] = price
    end  

    def self.price(symbol)
      puts symbol
      if price = @@stocks[symbol.upcase]
        puts "found: #{price}"
        return price
      else
        price = MarketBeat.last_trade_real_time(symbol.upcase).to_f
        self.add(symbol.upcase, price)
        puts "not found: #{price}"
        
        return price
      end
    end  

    def self.update_price(symbol,price)
      valid_price?(price) ? ( @@stocks[symbol.upcase] = price ) : nil
    end

    def self.valid_price?(price)
      price.to_s.match(/^[-+]?[0-9]*\.?[0-9]+$/)
    end

    def self.refresh_prices
      @@stocks.each do |symbol,price|
        update_price(symbol, MarketBeat.last_trade_real_time(symbol).to_f )
      end
    end

    def self.update_all(interval) # infinite loop run in a new thread
       loop {
         refresh_prices
         @@update_counter += 1
    
         (1..10).each { puts 'updating' }
         
         sleep(interval)
        }
    end

  end
    
end
