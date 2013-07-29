namespace :family do
  
desc 'Build the Databases'
task :setup => ["db:drop", "db:create", "db:migrate"]
desc 'Create Data'
task :create_db => ['create_K', 'create_HP', 'create_ETrade', 'create_SLAT1', 'create_SLAT2', 'create_AndR', 'create_DHC', 'create_MSA', 'create_RN', 'create_R']

desc "Create 1st History"
task :create_hist => :environment do
                   
hist = [
[2, 0.00, 2205.23, 1, 0.00, 0, 2205.23],
[1,	0.00, 17880.06, 1, 0.00, 0, 17880.06], 
[3, 8300.53, 52781.00, 4, 24095.00, 2, 85176.53], 
[8, 84190.60, 1797337.74, 19, 0.00, 0, 1881528.34 ],
[5, 75805.24, 2494797.38, 57, 0.00, 0, 2570602.62 ],
[7, 453616.31, 2271440.64, 7, 48205.00, 6, 2773261.95 ],
[6, 1386455.77, 1471933.23, 39, 43620.00, 5, 2902009.00 ],
[4, 140063.22, 5630185.92, 52, 0.00, 0, 5770249.14 ],
[9, 368741.00, 0, 0, 0, 0, 368741.00] ]

# Totals:	$2,148,431.67 	$13,738,561.20 	$115,920.00 	$16,002,912.87

hist.each do |record|
s = History.create!( :cash => record[1],
                   :portfolio_id => record[0],
                   :stocks => record[2],
                   :stocks_count => record[3],
                   :options => record[4],
                   :options_count => record[5],
                   :total => record[6],
                   :snapshot_date => '2013-07-25 17:00:00 -0500' )
                 end
end

desc "Setup R"
task :create_R => :environment do
    stocks = [ ['COP', 400] ]
    portfolio = Portfolio.create!( :name => 'R', :user_id => 1, :cash => 99595.79 )
    stocks.each do |sec|
      s = Stock.create!( :symbol => sec[0],
                         :name => '',
                         :quantity => sec[1],
                         :purchase_price => 58.81,
                         :portfolio_id => portfolio.id,
                         :stock_option => 'Stock',
                         :purchase_date => '2013/03/13' )
    end
end

desc "Setup RiverNorth"
task :create_RN => :environment do
    portfolio = Portfolio.create!( :name => 'River North', :user_id => 1, :cash => 368741.00 )
end

desc "Setup K"
task :create_K => :environment do
    stocks = [ ['K',268.55] ]
    portfolio = Portfolio.create!( :name => 'K', :user_id => 1, :cash => 0 )
    stocks.each do |sec|
      s = Stock.create!( :symbol => sec[0],
                         :name => '',
                         :quantity => sec[1],
                         :purchase_price => 0,
                         :portfolio_id => portfolio.id,
                         :stock_option => 'Stock',
                         :purchase_date => '12/31/2002' )
    end
end

desc "Setup HP"
task :create_HP => :environment do
    stocks = [ ['HPQ',84.978] ]
    portfolio = Portfolio.create!( :name => 'HP', :user_id => 1, :cash => 0 )
    stocks.each do |sec|
      s = Stock.create!( :symbol => sec[0],
                         :name => '',
                         :quantity => sec[1],
                         :purchase_price => 0,
                         :portfolio_id => portfolio.id,
                         :stock_option => 'Stock',
                         :purchase_date => '12/31/2002' )
    end
end


desc "Setup SLAT1"
task :create_SLAT1 => :environment do

  stocks = [
    ['ATMI',2200.00],
    ['ACE',1674.00],
    ['A',555.00],
    ['APD',900.00,],
    ['AAPL',20.00],
    ['AMAT',552.00],
    ['ADSK',1900.00],
    ['BASFY',810.00],
    ['BHP',900.00],
    ['CVS',1800.00],
    ['CCL',900.00],
    ['CTL',1012.00],
    ['CSCO',22000.00],
    ['KO',3735.00],
    ['COP',1620.00],
    ['DE',200.00],
    ['DIS',1200.00],
    ['DOW',450.00],
    ['DFT',2400.00],
    ['ETN',1080.00],
    ['XOM',1710.00],
    ['FTR',13.00],
    ['GD',1188.00],
    ['GEF',800.00],
    ['HPQ',1800.00],
    ['HRL',800.00],
    ['INTC',6400.00],
    ['VTA',3500.00],
    ['LQD',940.00],
    ['GSG',100.00],
    ['EFA',9050.00],
    ['ITUB',440.00],
    ['K',400.00],
    ['MCD',1970.00],
    ['MDT',1100.00],
    ['MSFT',17080.00],
    ['MON',900.00],
    ['NKE',2700.00],
    ['PH',300.00],
    ['PEP',891.00],
    ['PFE',2982.00],
    ['PM',900.00],
    ['PGF',21800.00],
    ['PG',780.00],
    ['JNK',1000.00],
    ['SU',2160.00],
    ['SYT',900.00],
    ['UPS',810.00],
    ['UTX',1476.00],
    ['VZ',1496.00],
    ['V',450.00],
    ['WAG',4800.00]
  ]
portfolio = Portfolio.create!( :name => 'SLAT1', :user_id => 1, :cash => 140063.22 )

stocks.each do |sec|
  s = Stock.create!( :symbol => sec[0],
                     :name => '',
                     :quantity => sec[1],
                     :purchase_price => 0,
                     :portfolio_id => portfolio.id,
                     :stock_option => 'Stock',
                     :purchase_date => '12/31/2012' )
end

end
  
desc "Setup SLAT2"
task :create_SLAT2 => :environment do

  stocks = [
    ['MMM',180.00],
    ['T',900.00],
    ['MO',1440.00],
    ['ACO',270.00],
    ['AAPL',800.00],
    ['ADM',1044.00],
    ['BMO',360.00],
    ['BA',180.00],
    ['BWA',630.00],
    ['BG',450.00],
    ['CSX',540.00],
    ['COF',360.00],
    ['CAT',180.00],
    ['CNP',2700.00],
    ['CTL',900.00],
    ['CVX',270.00],
    ['CSCO',6250.00],
    ['CMCSA',630.00],
    ['CNX',900.00],
    ['COV',900.00],
    ['CMI',360.00],
    ['DEO',450.00],
    ['DIS',900.00],
    ['DOW',720.00],
    ['DFT',1080.00],
    ['EGP',450.00],
    ['FLS',405.00],
    ['GE',2250.00],
    ['GS',450.00],
    ['HIG',360.00],
    ['HON',450.00],
    ['HUM',270.00],
    ['INTC',1800.00],
    ['EWA',900.00],
    ['EWH',1800.00],
    ['EWT',1350.00],
    ['JNJ',720.00],
    ['JPM',810.00],
    ['KMB',630.00],
    ['KMP',270.00],
    ['LDR',450.00],
    ['MNK',112.00],
    ['MRK',1170.00],
    ['NVS',360.00],
    ['ORCL',900.00],
    ['PH',360.00],
    ['PAYX',4266.00],
    ['PSX',720.00],
    ['PX',450.00],
    ['QCOM',270.00],
    ['RIO',684.00],
    ['JNK',900.00],
    ['SBUX',360.00],
    ['TOT',180.00],
    ['UIL',630.00],
    ['VALE',2700.00],
    ['VMW',135.00]
  ]
  
  portfolio = Portfolio.create!( :name => 'SLAT2', :user_id => 1, :cash => 75805.24 )

  stocks.each do |sec|
    s = Stock.create!( :symbol => sec[0],
                       :name => '',
                       :quantity => sec[1],
                       :purchase_price => 0,
                       :portfolio_id => portfolio.id,
                       :stock_option => 'Stock',
                       :purchase_date => '12/31/2012' )
  end


end  

desc "Setup A&R"
task :create_AndR => :environment do
  stocks = [
    [ 'NLY', 'ANNALY REIT',           1000, 12.03,  '07/16/2013'],
    [ 'AFL', 'AFLAC INC',             700,  49.36,  '12/31/2012'],
    [ 'T', 'AT&T INC NEW',            2000, 36.66,  '12/31/2012'],
    [ 'ABB', 'ABB LTD ADR',           1000, 22.05,  '12/31/2012'],
    [ 'ABBV', 'ABBVIE INC',           500,  41.32,  '12/31/2012'],
    [ 'ACN', 'ACCENTURE PLC',         300,  70.28,  '12/31/2012'],
    [ 'ADDYY', 'ADIDAS AG ADR',       400,  50.22,  '12/31/2012'],
    [ 'BA', 'BOEING CO',              200,  100.64, '12/31/2012'],
    [ 'CAT','CATERPILLAR INC',        300,  84.92,  '12/31/2012'],
    [ 'CVX','CHEVRON CORPORATION',    250,  118.45, '12/31/2012'],
    [ 'KO','COCA COLA COMPANY',       1000, 42.56,  '12/31/2012'],
    [ 'COP','CONOCOPHILLIPS',         750,  57.66,  '12/31/2012'],
    [ 'DTEGY','DEUTSCHE TELEKOM ADR', 3500, 11.63,  '12/31/2012'],
    [ 'DISH','DISH NETWORK CORP',     500,  37.02,  '12/31/2012'],
    ['EBAY','EBAY INC',               300,  53.13,  '12/31/2012'],
    ['EBAY','EBAY INC',               200,  53.45,  '07/18/2013'],
    ['EMR','EMERSON ELECTRIC CO',     400,  56.26,  '12/31/2012'],
    ['ETR','ENTERGY CORP NEW',        400,  70.17,  '12/31/2012'],
    ['XOM','EXXON MOBIL CORPORATION', 750,  88.40,  '12/31/2012'],
    ['GE','GENERAL ELECTRIC COMPANY', 3000, 22.76,  '12/31/2012'],
    ['GBDC','GOLUB CAPITAL BDC INC',  1000, 16.88,  '12/31/2012'],
    ['GOODX','GOODHAVEN FD',          1486.99,26.95,'12/31/2012'],
    ['HON','HONEYWELL INTERNATIONAL', 600,  72.44,  '12/31/2012'],
    ['INTC','INTEL CORP',             4000, 21.61,  '12/31/2012'],
    ['EWH','ISHARES MSCI HK ETF',     2000, 19.27,  '12/31/2012'],
    ['KMP','KINDER MORGAN ENERGY LP', 300,  90.98,  '12/31/2012'],
    ['MCD','MC DONALDS CORP',         200,  99.89,  '12/31/2012'],
    ['MSFT','MICROSOFT CORP',         1000,  32.01,  '07/18/2013'],
    ['QLD','PROSHARES ULTRA QQQ',     1000, 58.73,  '12/31/2012'],
    ['QCOM','QUALCOMM INC',           600,  62.36,  '12/31/2012'],
    ['SPY','SPDR S&P 500 ETF',        600,  161.85, '12/31/2012'],
    ['USB','US BANCORP DEL NEW',      1000, 33.66,  '12/31/2012'],
    ['UNH','UNITEDHEALTH GROUP INC',  400,  67.52,  '12/31/2012'],
    ['VGK','VANGUARD FTSE EUROPE ETF',700,  50.11,  '12/31/2012'],
    ['VWAHX','VANGUARD HIGH YIELD TAX EXEMPT',4438.26,11.34,'12/31/2012'],
    ['VZ','VERIZON COMMUNICATIONS',   750,  49.62,  '12/31/2012'],
    ['WMT','WAL-MART STORES INC',     300,  78.63,  '12/31/2012'],
    ['WFC','WELLS FARGO & CO NEW',    1000, 34.91,  '12/31/2012'],
    ['DXJ','WISDOMTREE JPN HDGD EQTY',500,  38.90,  '12/31/2012']]

options = [
  [ 'ATMI', 'ATMI',       -20,  25,     '12/21/2013',   3.30,   '07/18/2013'],
  [ 'ATMI', 'ATMI',       -25,  25,     '12/21/2013',   2.29,   '12/21/2012'],
  [ 'AAPL', 'Apple Inc',  5,    395.00, '01/18/2014',   44.48,  '12/31/2012'],
  [ 'AAPL', 'Apple Inc',  6,    480.00, '01/18/2014',   37.48,  '12/31/2012'],
  [ 'QQQ',  'QQQ',        30,   70.00,  '01/18/2014',   4.13,   '12/31/2012']]

  portfolio = Portfolio.create!( :name => 'A&R', :user_id => 1, :cash => 1386455.77 )

  stocks.each do |sec|
    s = Stock.create!( :symbol => sec[0],
                       :name => sec[1],
                       :quantity => sec[2],
                       :purchase_price => sec[3],
                       :portfolio_id => portfolio.id,
                       :stock_option => 'Stock',
                       :purchase_date => sec[4] )
  end
  
  options.each do |sec|
    s = Stock.create!( :symbol => sec[0],
                       :name => sec[1],
                       :quantity => sec[2],
                       :purchase_price => sec[5],
                       :portfolio_id => portfolio.id,
                       :stock_option => 'Call Option',
                       :purchase_date => sec[6],
                       :strike => sec[3],
                       :expiration_date => sec[4] )
  end
end

desc "Setup DHC"
task :create_DHC => :environment do

stocks = [
  ['APD','AIR PROD & CHEMICALS INC',  300.00,   87.72,    '12/31/2012'],
  ['AMGN','AMGEN INCORPORATED',        4880.00, 31.88,    '12/31/2012'],
  ['AAPL','APPLE INC',                 640.00,  175.50,   '12/31/2012'],
  ['SNP','CHINA PETE & CHEM ADR',     1807.00,  15.88,    '12/31/2012'],
  ['LQD','ISHARES CORPORATE BOND ETF',10350.00, 91.60,    '12/31/2012'],
  ['QLD','PROSHARES ULTRA QQQ',       1000.00,  66.68,    '12/31/2012'],
  ['SI','SIEMENS AG ADR',             300.00,   107.68,   '12/31/2012']
  ]

options =  [
  ['MDRX','ALLSCRIPTS HLTHCR',    20, 10.00,  '01/18/2014',   '12/31/2012'],
  ['FCX', 'FREEPORT MCMORAN',     20, 34.00,  '01/18/2014',  '12/31/2012'],
  ['GOOG', 'GOOGLE INC',          1,  655.00, '01/18/2014',   '12/31/2012'],
  ['HPQ', 'HEWLETT PACKARD',      5,  10.00,  '01/18/2014',    '12/31/2012'],
  ['AMGN','AMGEN INC',            3,  105.00, '01/17/2015',   '12/31/2012'],
  ['GOOG','GOOGLE CORP',          2,  975.00, '01/18/2014',   '07/18/2013'],
  ]

     portfolio = Portfolio.create!( :name => 'DHC', :user_id => 1, :cash => 453616.31 )

     stocks.each do |sec|
       s = Stock.create!( :symbol => sec[0],
                          :name => sec[1],
                          :quantity => sec[2],
                          :purchase_price => sec[3],
                          :portfolio_id => portfolio.id,
                          :stock_option => 'Stock',
                          :purchase_date => sec[4] )
     end
     options.each do |sec|
       s = Stock.create!( :symbol => sec[0],
                          :name => sec[1],
                          :quantity => sec[2],
                          :purchase_price => sec[5],
                          :portfolio_id => portfolio.id,
                          :stock_option => 'Call Option',
                          :purchase_date => sec[6],
                          :strike => sec[3],
                          :expiration_date => sec[4] )
   end
end

desc "Setup ETrade"
task :create_ETrade => :environment do

  stocks = [
   [ 'CTL','CENTURYLINK INC',                 150,    32.20,  '02/14/2013' ],
   [ 'LO','LORILLARD INC',                    150,    44.0,   '05/22/2013' ],
   [ 'PGF','POWERSHARES FINANCIAL PREFERRED', 1500,   15.74,  '12/03/2009' ],
   [ 'QLD','PROSHARES ULTRA QQQ',             200,    39.91,  '03/16/2011' ]]
   
   options = [
   [ 'AAPL', 'Apple Inc',     3, 480, '01/18/2014', 30.77, '01/24/2013'],
   [ 'GOOG', 'Google, Inc.',  1, 685, '01/18/2014', 90.00, '10/18/2012'] ]

   portfolio = Portfolio.create!( :name => 'ETrade', :user_id => 1, :cash => 8300.53 )

   stocks.each do |sec|
     s = Stock.create!( :symbol => sec[0],
                        :name => sec[1],
                        :quantity => sec[2],
                        :purchase_price => sec[3],
                        :portfolio_id => portfolio.id,
                        :stock_option => 'Stock',
                        :purchase_date => sec[4] )
   end
   options.each do |sec|
     s = Stock.create!( :symbol => sec[0],
                        :name => sec[1],
                        :quantity => sec[2],
                        :purchase_price => sec[5],
                        :portfolio_id => portfolio.id,
                        :stock_option => 'Call Option',
                        :purchase_date => sec[6],
                        :strike => sec[3],
                        :expiration_date => sec[4] )
   end
end

desc "Setup MSA"
task :create_MSA => :environment do

  csv = [
   [ 'AAPL','APPLE INC',              120,    179.08, '01/08/2008' ],
   [ 'ATMI','ATMI INC COM',           26190,  2.22,   '01/01/1980' ],
   [ 'CSCO','CISCO SYSTEMS INC',      13300,  1.02,   '01/01/1980' ],
   [ 'CSCO','CISCO SYSTEMS INC',      800,    32,     '01/01/1998' ],
   [ 'CVS','CVS CAREMARK CORP',       690,    27.10,  '01/11/2006' ],
   [ 'GS','GOLDMAN SACHS GROUP INC',  80,     116.20, '10/15/2008' ],
   [ 'MCD','MCDONALDS CORP COM',      260,    32.15,  '11/02/2005' ],
   [ 'MO','ALTRIA GROUP INC',         300,    14.76,  '04/19/2005' ],
   [ 'MSFT','MICROSOFT CORP',         7153,   2.28,   '01/01/1990' ],
   [ 'NKE','NIKE INC CL B COM STK',   500,    30.43,  '10/09/2007' ],
   [ 'PFE','PFIZER INC',              290,    17.52,  '10/17/2009' ],
   [ 'PM','PHILIP MORRIS INTL',       340,    33.90,  '04/19/2005' ],
   [ 'SIAL','SIGMA-ALDRICH CORP',     200,    30.35,  '04/11/2005' ],
   [ 'STT','STATE STREET CORP COM',   377,    81.62,  '02/25/2008' ],
   [ 'SYK','STRYKER CORP COM',        2130,   1.77,   '01/05/1980' ],
   [ 'UTX','UNITED TECHNOLOGIES CORP',400,    50.01,  '04/28/2005' ],
   [ 'WAG','WALGREEN CO COM',         840,    1.92,   '01/05/1980' ],
   [ 'XOM','EXXON MOBIL CORP',        500,    60.09,  '04/19/2005' ],
   [ 'ZBRA','ZEBRA TECHNOLOGIES CORP',750,    4.06,   '01/23/1980 ']]

   portfolio = Portfolio.create!( :name => 'MSA', :user_id => 1, :cash => 84190.60 )

   csv.each do |sec|
     s = Stock.create!( :symbol => sec[0],
                        :name => sec[1],
                        :quantity => sec[2],
                        :purchase_price => sec[3],
                        :portfolio_id => portfolio.id,
                        :stock_option => 'Stock',
                        :purchase_date => sec[4] )
   end
end

  
end




   
   
   
   
   
