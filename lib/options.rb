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
        datetime = "#{doc.xpath('//td[@class="delayedQuotes"]/text()')[0]}".strip.split('@')
        date = datetime.first.strip.split(',')
        year = date.last.strip
        month_day = date.first.split(' ')
        month = "%02d" % Date::ABBR_MONTHNAMES.index(month_day.first).to_s
        day = month_day.last        
        datetime = year + '/' + month + '/' + day + ' ' + datetime.last.strip.split(' ').first
        #<h3>Price Data Table</h3>
        # strip out the nokogiri stuff from the data
        data = price.map { |elem| "#{elem}" }  
        bid = "#{price[data.find_index('Bid')+1]}"
        ask = "#{price[data.find_index('Ask')+1]}"  
        previous_close = "#{price[data.find_index('Previous Close')+1]}"  
      
        return { 'Time' => datetime, 'Bid' => bid, 'Ask' => ask, 'Previous_Close' => previous_close }
      else
        return 'Symbol Not Found'
      end
  end
  

  def self.local_stock_price(symbol, real_time)    
    price = Price.where(:sec_type => 'Stock', :symbol => symbol.upcase )
    if price.empty? 
      if real_time
        puts price = MarketBeat.last_trade_real_time(symbol.upcase).to_f
        datetime = MarketBeat.last_trade_datetime_real_time(symbol).split(',')
        month_day = datetime.first.split(' ')
        month = "%02d" % Date::ABBR_MONTHNAMES.index(month_day.first)
        day = month_day.last
        format_date = Time.now.strftime('%Y') + '/' + month + '/' + day 
        time = format_date + ' ' + datetime.last.split(' ').first
        puts change = MarketBeat.change_real_time(symbol.upcase)
      else
        price = MarketBeat.last_trade(symbol.upcase).to_f
        time = Time.now.strftime("%Y/%m/%d ") + MarketBeat.last_trade_time('aapl')
        change = MarketBeat.change(symbol.upcase)
      end
      Price.create(:sec_type => 'Stock', :symbol => symbol, :last_price => price, :last_update => time, :change => change)
      return time, price, change
    else
      price = Price.where(:sec_type => 'Stock', :symbol => symbol.upcase ).first
      return price.last_update.strftime("%H:%M"), price.last_price, price.change
    end
  end  

  def self.local_option_price(symbol, security_type, strike, expiration_date)
    option = Price.where(:sec_type => security_type, :symbol => symbol.upcase, :strike => strike, :exp_date => expiration_date )
    if option.empty?
      latest = self.option_price(symbol, strike, expiration_date)
       new = Price.create(:sec_type => security_type, :symbol => symbol.upcase, :strike => strike, :exp_date => expiration_date,
                             :last_update => latest['Time'], :bid => latest['Bid'], :ask => latest['Ask'], :last_price => latest['Previous_Close'])
    option = [ new ]
    end
    price = option.first
    return price.last_update, price.bid, price.ask, price.last_price
  end  

  def self.valid_price?(price)
    price.to_s.match(/^[-+]?[0-9]*\.?[0-9]+$/)
  end
  
  def self.refresh_all(realtime)
    Price.all.each_with_index do |sec, index|
         after = refresh_price(sec.id,realtime)
      puts "index: #{index} = #{sec.sec_type}: #{sec.symbol} #{sec.last_update}"
    end  
    return Price.all.count  
  end
    
  def self.refresh_price(security_id,realtime)
      security = Price.find(security_id)
      symbol = security.symbol
      if security.sec_type == 'Stock'
          if realtime
            price = MarketBeat.last_trade_real_time(symbol).to_f
            datetime = MarketBeat.last_trade_datetime_real_time(symbol).split(',')
            month_day = datetime.first.split(' ')
            month = "%02d" % Date::ABBR_MONTHNAMES.index(month_day.first)
            day = month_day.last
            format_date = Time.now.strftime('%Y') + '/' + month + '/' + day 
            time = format_date + ' ' + datetime.last.split(' ').first
            change = MarketBeat.change_real_time(symbol.upcase)
          else
            price = MarketBeat.last_trade(symbol.upcase).to_f
            time = Time.now.strftime("%Y/%m/%d ") + MarketBeat.last_trade_time('aapl')
            change = MarketBeat.change(symbol.upcase)
          end
         security.last_price = price
         security.last_update = time
         security.change = change
         security.save
      else
        update = option_price(symbol, security.strike, security.exp_date)        
        security.last_update = update['Time']
        security.bid = update['Bid']
        security.ask = update['Ask']
        security.last_price = update['Previous_Close']
        security.save       
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



