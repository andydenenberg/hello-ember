# namespace :cboe do
#  task :options => :environment do

module Options

  def self.option_price(symbol,strike,date)
    require "net/http"
    require "uri"
    require 'rubygems'
    require 'mechanize'
    require 'json'
    require 'nokogiri'
    @agent = Mechanize.new 

    #YYDDm
    alpha = 'ABCDEFGHIJKL' # calls
    beta  = 'MNOPQRSTUVWX' # puts
    format_date = date[8..9] + date[3..4] + alpha[date[0..1].to_i - 1]

    strike = strike.to_s
    appendix = '-E'
    url = "http://www.cboe.com/DelayedQuote/SimpleQuote.aspx?ticker=#{symbol}#{format_date}#{strike}#{appendix}"
    puts url
    
    page = @agent.get(url)
    payload = page.body
      if !payload.include?('Symbol Not Found')
        doc = Nokogiri::HTML(payload)
        # Search the doc for all td elements in the delayedQuotes class
        price = doc.xpath('//td[@class="delayedQuotes"]/text()')
        # strip out the nokogiri stuff from the data
        data = price.map { |elem| "#{elem}" }  
        bid = "#{price[data.find_index('Bid')+1]}"
        ask = "#{price[data.find_index('Ask')+1]}"  
        previous_close = "#{price[data.find_index('Previous Close')+1]}"  
      
        return { 'Time' => Time.now.strftime("%I:%m%p CST"), 'Bid' => bid, 'Ask' => ask, 'Previous_Close' => previous_close }
      else
        return 'Symbol Not Found'
      end
  end
  
  # Repository of latest prices of stocks
  @@stocks = { }
  @@securities = [ ]
  @@update_counter = 0  
  def self.update_counter
    @@update_counter
  end
  
  def self.inc_counter
    if @@update_counter > 20
      @@update_counter = 0
      refresh_prices      
    else
      @@update_counter += 1
    end
  end

  def self.add_stock(security_type, symbol, price, time, change)
    @@stocks[symbol.upcase] = [ security_type, price, time, change ]
  end  

  def self.add_option(security_type, symbol, option_type, strike, expiration_date, bid, ask, previous_close, time)
    @@stocks[symbol.upcase + '_' + option_type + '_' + strike.to_s + '_' + expiration_date] = 
        [ security_type, bid, ask, previous_close, time, strike, expiration_date ]
  end  

  def self.add_security(security_type, symbol, time, price, change, strike, expiration_date, bid, ask, previous_close )
    @@securities.push [ security_type, symbol.upcase, time, price, change, strike, expiration_date, bid, ask, previous_close ]
  end  

  def self.local_stock_price(symbol)
    stock = [ ]
    @@securities.each do |security| 
      if (security[0] == 'Stock' and security[1] == symbol) 
        stock = security
      end
    end
    if stock.empty?
      price = MarketBeat.last_trade_real_time(symbol.upcase).to_f
      time = MarketBeat.last_trade_time_real_time(symbol.upcase)
      change = MarketBeat.change_real_time(symbol.upcase)
      add_security('Stock', symbol.upcase, time, price, change, nil,nil,nil,nil,nil)
      return time, price, change
    else
      return stock[2..-6]
    end
  end  

  def self.local_option_price(symbol, security_type, strike, expiration_date)
    option = [ ]
    @@securities.each do |security| 
      if (security[0] == security_type and security[1] == symbol and security[5] == strike and security[6] == expiration_date ) 
        option = security
      end
    end
    if option.empty?
      latest = self.option_price(symbol, strike, expiration_date)
      add_security('Call Option', symbol, latest['Time'], nil,nil, strike, expiration_date, latest['Bid'], latest['Ask'], latest['Previous_Close'] )
      return latest['Time'], latest['Bid'], latest['Ask'], latest['Previous_Close']
    else
      return option[2], option[7], option[8], option[9]
    end
  end  

  def self.valid_price?(price)
    price.to_s.match(/^[-+]?[0-9]*\.?[0-9]+$/)
  end

  def self.refresh_prices
    @@securities.each do |security|
      symbol = security[1]
      if security[0] == 'Stock'

        price = MarketBeat.last_trade_real_time(symbol.upcase).to_f
        if valid_price?(price)
          time = MarketBeat.last_trade_time_real_time(symbol.upcase)
          change = MarketBeat.change_real_time(symbol.upcase)
          
          security = [ 'Stock', symbol, time, price, change, nil, nil, nil, nil, nil ]
        end
      else
        strike = security[5]
        expiration_date = security[6]
        update = option_price(symbol, strike, expiration_date)
        
        security = ['Call Option', symbol, update['Time'], nil, nil, strike, expiration_date, update['Bid'], update['Ask'], update['Previous_Close'] ]
        
      end
    end
  end

  def self.list_all_securities
    @@securities.each do |stock|
      puts stock.inspect
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



