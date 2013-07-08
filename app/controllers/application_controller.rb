class ApplicationController < ActionController::Base
  protect_from_forgery

  class Price
    # Repository of latest prices of stocks
    
    @@stocks = { }
    @@update_counter = 0
    
    def self.list_all_stocks
      @@stocks.each do |stock|
        puts "#{stock[0]} => #{stock[1]}"
      end
      
    end

    def self.update_counter
      @@update_counter
    end
    
    def self.inc_counter
      if @@update_counter > 10
        @@update_counter = 0
        refresh_prices
        
        puts '@@stocks'
        self.list_all_stocks
        puts ' '
        
      else
        @@update_counter += 1
      end
    end

    def self.add(symbol,price,time,change)
      @@stocks[symbol.upcase] = [ price, time, change ]
    end  

    def self.price(symbol)
      if values = @@stocks[symbol.upcase]
        return values
      else
        price = MarketBeat.last_trade_real_time(symbol.upcase).to_f
        time = MarketBeat.last_trade_time_real_time(symbol.upcase)
        change = MarketBeat.change_real_time(symbol.upcase)
        self.add(symbol.upcase, price, time, change)
        return price, time, change
      end
    end  

    def self.update_price(symbol,price,time,change)
      valid_price?(price) ? ( @@stocks[symbol.upcase] = [price, time,change] ) : nil
    end

    def self.valid_price?(price)
      price.to_s.match(/^[-+]?[0-9]*\.?[0-9]+$/)
    end

    def self.refresh_prices
      @@stocks.each do |symbol,price,time,change|
        update_price(symbol, 
          MarketBeat.last_trade_real_time(symbol.upcase).to_f,
          MarketBeat.last_trade_time_real_time(symbol.upcase),
          MarketBeat.change_real_time(symbol.upcase)
          )
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
