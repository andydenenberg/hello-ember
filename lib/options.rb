# namespace :cboe do
#  task :options => :environment do

module Options
  require 'csv'
  require 'open-uri'

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
  
  def self.latest_price(symbol, real_time)
    if real_time
      price = MarketBeat.last_trade_real_time(symbol.upcase).to_f
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
    return time, price, change   
  end

  def self.local_stock_price(symbol, real_time)    
    price = Price.where(:sec_type => 'Stock', :symbol => symbol.upcase )
    if price.empty? 
      latest = latest_price(symbol, real_time)
      latest.push check_dividend(symbol, (Time.now - 1.day).strftime("%m/%d/%Y") )['Dividends']
      Price.create( :sec_type => 'Stock', :symbol => symbol,
                    :last_price => latest[1], :last_update => latest[0],
                    :change => latest[2], :daily_dividend => latest[3] )
      return latest
    else
      price = Price.where(:sec_type => 'Stock', :symbol => symbol.upcase ).first
      return price.last_update.strftime("%H:%M%p %m/%d/%Y"), price.last_price, price.change, price.daily_dividend
    end
  end  

  def self.local_option_price(symbol, security_type, strike, expiration_date)
    option = Price.where( :sec_type => security_type, :symbol => symbol.upcase,
                          :strike => strike, :exp_date => expiration_date )
    if option.empty?
      latest = self.option_price(symbol, strike, expiration_date)
       new = Price.create( :sec_type => security_type, :symbol => symbol.upcase,
                           :strike => strike, :exp_date => expiration_date,
                           :last_update => latest['Time'], :bid => latest['Bid'],
                           :ask => latest['Ask'], :last_price => latest['Previous_Close'])
    option = [ new ]
    end
    price = option.first
    return price.last_update.strftime("%H:%M%p %m/%d/%Y"), price.bid, price.ask, price.last_price
  end  

  def self.valid_price?(price)
    price.to_s.match(/^[-+]?[0-9]*\.?[0-9]+$/)
  end
  
  def self.refresh_all(realtime)
    Price.all.each_with_index do |sec, index|
         refresh_price(sec.id,realtime)
#      puts "index: #{index} = #{sec.sec_type}: #{sec.symbol} #{sec.last_update}"
    end  
    return Price.all.count  
  end
    
  def self.refresh_price(security_id,real_time)
      security = Price.find(security_id)
      symbol = security.symbol
      if security.sec_type == 'Stock'
        update = latest_price(symbol, real_time)
         security.last_price = update[1]
         security.last_update = update[0]
         security.change = update[2]
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

  def self.daily_snapshot # store in History record in DB
    refresh_all(false) # not realtime
    Portfolio.all.each do |portfolio|
      hist = portfolio.histories.new
      stocks = portfolio.stocks.where(:stock_option => 'Stock')
        hist.stocks_count = stocks.count
        hist.stocks = stocks.reduce(0) { |sum, stock| sum + Price.find_by_symbol(stock.symbol).last_price * stock.quantity }
      options = portfolio.stocks.where('stock_option != ?', 'Stock' )
        hist.options_count = options.count
        hist.options = options.reduce(0) do |sum,option| 
          p = Price.where(:symbol => option.symbol, :sec_type => option.stock_option, :strike => option.strike, :exp_date => option.expiration_date ).first
          price = option.stock_option == 'Call Option' && option.quantity < 0 ? p.ask : p.bid 
          sum +  price * option.quantity * 100
        end
        hist.cash = portfolio.cash
        hist.total = hist.options + hist.stocks + hist.cash
        hist.snapshot_date = Time.now
        hist.save
    end
  end
  
  def self.db_daily_snapshot # retrieve for display in graph
    arr = [ ]
    Portfolio.all.each do |port|
      sub_arr = [ ]
      port.histories.each do |hist|
        sub_arr.push [ hist.created_at.strftime('%m-%d-%Y') + ' 05:00PM', hist.total.to_s ]
      end
      arr.push sub_arr
    end
#    colors = [ '#4bb2c5', "#c5b47f", "#EAA228", "#579575", "#839557", "#958c12" ] 
#  	names = portfolios.collect { |u| User.find(u.user_id).name }
  	
    return arr   # , colors, names    
  end
  
  def self.daily_totals(start_date='07/01/2013', days=27, portfolios = [ 1, 2 ])
    all_lines = [ ]
    portfolios.count.times { all_lines.push [] }
    total_line = [ ]
    date = start_date.split('/')
    start = Time.new(date[2].to_i,date[0].to_i,date[1].to_i,0,0,0)

    (0..days).each do |day|
      day_values = History.where(:snapshot_date => start + day.days)      
      total_day = day_values.collect { |h| h.total }.inject(0) { |sum,tot| sum + tot }.to_i      
      if total_day != 0  
        total_line.push [ (start+day.days).strftime('%m-%d-%Y') + ' 05:00PM', total_day  ]
      else
        total_line.push [ (start+day.days).strftime('%m-%d-%Y') + ' 05:00PM', 'null'  ]        
      end
      portfolios.each_with_index do |port, idx|
        port_value = day_values.select { |hist| hist.portfolio_id == port }
        if !port_value.empty? 
          all_lines[idx].push [ (start+day.days).strftime('%m-%d-%Y') + ' 05:00PM', port_value.first.total.to_i ]
        end
      end        
    end
    
    return [ total_line, all_lines ]
  end
  
  def self.fix_date
    History.all.each do |hist|
      dates = hist.snapshot_date.strftime('%Y,%m,%d').split(',').collect { |val| val.to_i }
      y = dates[0]
      m = dates[1]
      d = dates[2]
      hist.snapshot_date = Time.new(y,m,d)
      hist.save
    end
  end
  
#History.where(:snapshot_date => '2013/07/25 22:00:00').collect { |hist| hist.total }.inject(0) { |result, element| result + element }.to_s
  
  def self.hist_dump
    list = [ ]
    History.all.each do |hist|
      list.push "#{hist.portfolio.name}, #{hist.snapshot_date}, #{hist.cash}, #{hist.stocks_count}, #{hist.stocks}, #{hist.options_count}, #{hist.options}, #{hist.total}"
    end
    list.each { |item| puts item }
    return nil
  end
  
  def self.get_annual(symbol)
    start_date = Date.new(2013, 01, 01)
    end_date = Date.today
    total = 0
    divs = [ ]
    begin
       resp = self.check_dividend(symbol, start_date.strftime("%m/%d/%Y") )
       if resp['Date']
         total += resp['Dividends']
         divs.push [resp['Date'], resp['Dividends']]
       end   
       start_date += 1.days
    end while start_date < end_date
    return total, divs
  end
  
  def self.refresh_daily_dividend
      Price.all.each do |security|
        if security.sec_type == 'Stock'
          yesterday = (Time.now - 1.day).strftime("%m/%d/%Y")
          div = check_dividend(security.symbol, yesterday)
          security.daily_dividend = div['Dividends']
          puts div
         security.save
        end
      end
  end
  
  def self.check_dividend(symbol,date)
        comps = date.split('/')
        ds = "&a=#{(comps[0].to_i-1).to_s.rjust(2, '0')}&b=#{comps[1].rjust(2, '0')}&c=#{comps[2]}&d=#{(comps[0].to_i-1).to_s.rjust(2, '0')}&e=#{comps[1].rjust(2, '0')}&f=#{comps[2]}"
        url = "http://ichart.finance.yahoo.com/table.csv?s=#{symbol}#{ds}&g=v&ignore=.csv"
        puts url
        hp = { }
        begin            
          resp = CSV.parse(open(url).read)          
          if resp.length > 1 
              str = resp[1][0].split('-')
              hp['Date'] = str[1] + '/' + str[2] + '/' + str[0]
            resp[0][1..-1].each_with_index do |title, i|
              hp[title] = resp[1][i+1].to_f
            end
          end
        rescue => e
          hp['error'] = e.inspect
        end      
        
        return hp # hash with "Date", "Dividends"          
  end
  
end



