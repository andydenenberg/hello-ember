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

    strike = strike.to_i.to_s
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
      
        return { 'Time' => Time.now.strftime("%I:%M%p CST"), 'Bid' => bid, 'Ask' => ask, 'Previous_Close' => previous_close }
      else
        return 'Symbol Not Found'
      end
  end
  
  # Repository of latest prices of stocks
#  @@stocks = { }

  @@securities = [ ]
  def self.securities
    @@securities
  end
  
  @@update_counter = 0  
  def self.update_counter
    @@update_counter
  end
  
  def self.add_security(security_type, symbol, time, price, change, strike, expiration_date, bid, ask, previous_close )
    @@securities.push [ security_type, symbol.upcase, time, price, change, strike, expiration_date, bid, ask, previous_close ]
  end  

  def self.local_stock_price(symbol, realtime)    
    stock = @@securities.select { |sec| sec[0] == 'Stock' && sec[1] == symbol.upcase }
    if stock.empty? # not found in @@securities array, need to add new
      if realtime
        price = MarketBeat.last_trade_real_time(symbol.upcase).to_f
        time = MarketBeat.last_trade_time_real_time(symbol.upcase)
        change = MarketBeat.change_real_time(symbol.upcase)
      else
        price = MarketBeat.last_trade(symbol.upcase).to_f
        time = MarketBeat.last_trade_time(symbol.upcase)
        change = MarketBeat.change(symbol.upcase)
      end
      add_security('Stock', symbol.upcase, time, price, change, nil,nil,nil,nil,nil)
      return time, price, change
    else
      return @@securities.select { |sec| sec[0] == 'Stock' && sec[1] == symbol.upcase }.first[2..-6]
    end
  end  

  def self.local_option_price(symbol, security_type, strike, expiration_date)
    option = @@securities.select { |sec| sec[0] == security_type and sec[1] == symbol.upcase and sec[5] == strike and sec[6] == expiration_date }
    if option.empty?
      latest = self.option_price(symbol, strike, expiration_date)
      add_security('Call Option', symbol, latest['Time'], nil,nil, strike, expiration_date, latest['Bid'], latest['Ask'], latest['Previous_Close'] )
    end
    option = @@securities.select { |sec| sec[0] == security_type and sec[1] == symbol.upcase and sec[5] == strike and sec[6] == expiration_date }.first
    return option[2], option[7], option[8], option[9]
  end  

  def self.valid_price?(price)
    price.to_s.match(/^[-+]?[0-9]*\.?[0-9]+$/)
  end
  
  def self.refresh_all(realtime)
    @@securities.each_with_index do |sec, index|
         after = refresh_price(index,realtime)
         puts index
    end  
    return @@securities.count  
  end
    
  def self.refresh_price(security_id,realtime)
      security = @@securities[security_id]
      symbol = security[1]
      if security[0] == 'Stock'
        if realtime
          price = MarketBeat.last_trade_real_time(symbol.upcase).to_f
          time = MarketBeat.last_trade_time_real_time(symbol.upcase)
          change = MarketBeat.change_real_time(symbol.upcase)
        else
          price = MarketBeat.last_trade(symbol.upcase).to_f
          time = MarketBeat.last_trade_time(symbol.upcase)
          change = MarketBeat.change(symbol.upcase)
        end
        @@securities[security_id] = [ 'Stock', symbol, time, price, change, nil, nil, nil, nil, nil ]
      else
        strike = security[5]
        expiration_date = security[6]
        update = option_price(symbol, strike, expiration_date)        
        @@securities[security_id] = ['Call Option', symbol, update['Time'], nil, nil, strike, expiration_date, update['Bid'], update['Ask'], update['Previous_Close'] ]        
      end
      return @@securities[security_id]
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



