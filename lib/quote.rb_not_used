  
module Quote
  require 'csv'
  require 'open-uri'

    def self.distance_of_time_in_days(from_time, to_time = 0)
      from_time = from_time.to_time if from_time.respond_to?(:to_time)
      to_time = to_time.to_time if to_time.respond_to?(:to_time)
      from_time, to_time = to_time, from_time if from_time > to_time
      distance_in_days = (((to_time - from_time).abs) / 86400).round
    end
    
    def self.current_price(symbol)
      symbol.gsub!(/[^a-z-]/i, '') # remove any non alpha chars
#      self.get_quote(symbols)
      stock = Stock.find_by_symbol(symbol)
      if stock
      current_price = { }
      current_price['Symbol'] = stock.symbol
      current_price['Name'] = stock.name
      current_price['LastTrade'] = stock.last_price
      current_price['LastTradeTime'] = stock.last_price_date
      current_price['Change'] = stock.price_change
      return current_price
      else
        return nil
      end
      
    end
    
    def self.get_indexes
#      indexes = [ self.get_quote("%5EGSPC"), self.get_quote("%5EIXIC") ]
      indexes = self.get_quotes(["%5EGSPC", "%5EIXIC"])
    end
    
#   def self.get_quote(symbol)
#     if symbol.length == 0  # if blank stuff with dummy string
#       symbol = 'xyzxyz'
#     end
#     url = "http://download.finance.yahoo.com/d/quotes.csv?s=#{symbol},aapl,msft&f=snl1d1c1&e=.csv"
#     current_price = { }
#     begin
#       doc = open(url)
#     
#     got_data = doc.read
#     data = CSV.parse(got_data)[0]
#     ['Symbol', 'Name', 'LastTrade', 'LastTradeDate', 'Change' ].each_with_index { |title, i| current_price[title] = data[i] }
#     current_price['Error'] = nil
#     return current_price
#
#     rescue Timeout::Error
#       current_price['Error'] = "The request timed out...skipping."
#       return current_price
#     rescue => e
#       current_price['Error'] = "The request returned an error - #{e.inspect}."
#       return current_price
#     end      
#   end  

    def self.get_annual(symbol)
      start_date = Date.new(2013, 01, 01)
      end_date = Date.today
      total = 0
      begin
         resp = self.check_dividend(symbol, start_date.strftime("%m/%d/%Y") )
         if resp['Date']
           total += resp['Dividends']
           puts "#{resp.inspect}"
         end   
         start_date += 1.days      
      end while start_date < end_date
      puts total
    end

    def self.check_dividend(symbol,date)
          comps = date.split('/')
          ds = "&a=#{comps[0].to_i-1}&b=#{comps[1]}&c=#{comps[2]}&d=#{comps[0].to_i-1}&e=#{comps[1]}&f=#{comps[2]}"
          url = "http://ichart.finance.yahoo.com/table.csv?s=#{symbol}#{ds}&g=v&ignore=.csv"
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

    def self.get_quotes(symbols)
      list = ''
      symbols.each do |s|
        s.length == 0  ? symbol = 'xyzxyz' : symbol = s.strip  # if blank stuff with dummy string
        list += symbol + ','
      end
      list = list[0..-2] # delete last comma

      url = "http://download.finance.yahoo.com/d/quotes.csv?s=#{list}&f=snl1d1t1c1&e=.csv"
      sym_list = [ ]
      begin
        doc = open(url)     
        got_data = doc.read
        t = symbols.length
        t.times do |j|
          data = CSV.parse(got_data)[j-1]
          current_price = { }
          ['Symbol', 'Name', 'LastTrade', 'LastTradeDate', 'LastTradeTime', 'Change' ].each_with_index { |title, i| current_price[title] = data[i] }
          current_price['Error'] = nil
          sym_list.push current_price
        end
        return sym_list

      rescue Timeout::Error
        current_price['Error'] = "The request timed out...skipping."
        return current_price
      rescue => e
        current_price['Error'] = "The request returned an error - #{e.inspect}."
        return current_price
      end      
    end  

    def self.hist_price(symbol,date)  
      comps = date.split('/')
      ds = "&a=#{comps[0].to_i-1}&b=#{comps[1]}&c=#{comps[2]}&d=#{comps[0].to_i-1}&e=#{comps[1]}&f=#{comps[2]}"
      url = "http://ichart.yahoo.com/table.csv?s=#{symbol}#{ds}&g=d&ignore=.csv"
      puts url
  #    url = "http://ichart.yahoo.com/table.csv?s=ATMI&a=0&b=09&c=2013&d=0&e=09&f=2013&g=d&ignore=.csv"  
      # http://code.google.com/p/yahoo-finance-managed/wiki/csvHistQuotesDownload
      resp = CSV.parse(open(url).read)
      hp = { }
      str = resp[1][0].split('-')
      hp['Date'] = str[1] + '/' + str[2] + '/' + str[0]
      resp[0][1..-1].each_with_index do |title, i|
        hp[title] = resp[1][i+1].to_f
      end
      return hp # hash with "Date", "Open", "High", "Low", "Close", "Volume", "Adj Close"    
    end
    
    def self.update_last_price
      stocks = Stock.all
      list = stocks.collect { |s| s.symbol.downcase }
        result = self.get_quotes(list)
      stocks.each do |stock|
        update = result.select { |s| s['Symbol'].downcase == stock.symbol.downcase.strip }[0]
        stock.last_price = update['LastTrade'].to_f
        str = update['LastTradeDate']
        re = /(\d{1,2})\/(\d{1,2})\/(\d{4})/
        fields = str.match(re)        
        stock.last_price_date = Time.parse(fields[3] + '/' + fields[1] + '/' + fields[2] + ' ' + update['LastTradeTime']).getutc
        stock.price_change = update['Change'].to_f
        stock.save
      end
      return true
    end

    def self.import_csv(filename)
      lines = [ ]
        File.open(filename, 'r') do |f1|  
          while line = f1.gets # and i < 100
            lines.push line
          end  
        end   
        positions = [ ]
        fields = CSV.parse(lines[1])[0]
          lines[2..-1].each do |l|
            position = Hash.new
            line = CSV.parse(l)[0]
            fields.each_with_index do |field,i|      
              position[field] = line[i]
            end
          positions.push position
          end
        return positions
    end  
    
    def self.denmac(filename)
      lines = [ ]
        File.open(filename, 'r') do |f1|  
          while line = f1.gets # and i < 100
            lines.push line
          end  
        end   
        arr = [ ]
        lines.each_with_index do |l,i|
          p = l.split(',')
          i % 2 ? even = 'even' : even = 'odd'
          arr.push [ -p[0].to_i, p[1], p[2].to_f, i % 2 ]
        end
        andy = arr.select { |l| l[3] == 1 }
        lou = arr.select { |l| l[3] == 0 }
        total = andy.each_with_index do |a,i|
        puts a[0].to_s + ',' + lou[i][0].to_s + ',' + a[1] + ',' + a[2].to_s 
      end
        return nil
    end  
     
end

# Update Purchase price as of a date
# s.each { |stock| stock.purch_price = Quote.hist_price(stock.symbol,'12/31/2012')['Close'] ; stock.purch_date = '2012/12/31' ; stock.save }

#total = 0
#s.each { |stock| total += stock.quantity * Quote.hist_price(stock.symbol,'12/31/2012')['Close']   }

#  s – Symbol
#  n – Name
#  l – Last Trade (with time)
#  l1 – Last Trade (without time)
#  d1 – Last Trade Date
#  t1 – Last Trade Time
#  k3 – Last Trade Size
#  c – Change and Percent Change
#  c1 – Change
#  p2 – Change in Percent
#  t7 – Ticker Trend
#  v – Volume
#  a2 – Average Daily Volume
#  i – More Info
#  t6 – Trade Links
#  b – Bid
#  b6 – Bid Size
#  a – Ask
#  a5 – Ask Size
#  p – Previous Close
#  o – Open
#  m – Day’s Range
#  w – 52 Week Range
#  j5 – Change from 52 Week Low
#  j6 – Percent Change from 52 Week Low
#  k4 – Change from 52 Week High
#  k5 – Percent Change from 52 Week High
#  e – Earnings/Share
#  r – P/E Ratio
#  s7 – Short Ratio
#  r1 – Dividend Pay Date
#  q – Ex-Dividend Date
#  d – Dividend/Share
#  y – Dividend Yield
#  f6 – Float Shares
#  j1 – Market Capitalization
#  t8 – 1 Year Target Price
#  e7 – EPS Est. Current Year
#  e8 – EPS Est. Next Year
#  e9 – EPS Est. Next Quarter
#  r6 – Price/EPS Est. Current Year
#  r7 – Price/EPS Est. Next Year
#  r5 – PEG Ratio
#  b4 – Book Value
#  p6 – Price/Book
#  p5 – Price/Sales
#  j4 – EBITDA
#  m3 – 50 Day Moving Average
#  m7 – Change from 50 Day Moving Average
#  m8 – Percent Change from 50 Day Moving Average
#  m4 – 200 Day Moving Average
#  m5 – Change from 200 Day Moving Average
#  m6 – Percent Change from 200 Day Moving Average
#  s1 – Shares Owned
#  p1 – Price Paid
#  c3 – Commission
#  v1 – Holdings Value
#  w1 – Day’s Value Change
#  g1 – Holdings Gain Percent
#  g4 – Holdings Gain
#  d2 – Trade Date
#  g3 – Annualized Gain
#  l2 – High Limit
#  l3 – Low Limit
#  n4 – Notes
#  k1 – Last Trade (Real-time) with Time
#  b3 – Bid (Real-time)
#  b2 – Ask (Real-time)
#  k2 – Change Percent (Real-time)
#  c6 – Change (Real-time)
#  v7 – Holdings Value (Real-time)
#  w4 – Day’s Value Change (Real-time)
#  g5 – Holdings Gain Percent (Real-time)
#  g6 – Holdings Gain (Real-time)
#  m2 – Day’s Range (Real-time)
#  j3 – Market Cap (Real-time)
#  r2 – P/E (Real-time)
#  c8 – After Hours Change (Real-time)
#  i5 – Order Book (Real-time)
#  x – Stock Exchange


  
  
  
  
