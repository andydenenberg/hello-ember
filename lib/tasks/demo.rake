namespace :demo do
  desc "Create Stock"
    task :new_stock => :environment do
      Stock.create(:symbol => 'ATMI', :quantity => 250, :purchase_price => 9.95, :portfolio_id => Portfolio.first.id)
    end
    
    task :refresh_all  => :environment do
        rt = ENV["REALTIME"]
        realtime = rt == 'true' ? true : false
        require 'options'
        start = Time.now
        Options.refresh_all(realtime)
        puts "Repo refreshed at: #{Time.now} and took #{Time.now - start} seconds using realtime: #{realtime}"        
    end

    task :daily_snapshot  => :environment do
        require 'options'
        Options.daily_snapshot
    end
    
    task :refresh_daily_dividend => :environment do
        date = ENV["DATE"]
        require 'options'
        Options.refresh_daily_dividend(date)
    end
  
end