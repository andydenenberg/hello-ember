namespace :demo do
  desc "Create Stock"
    task :new_stock => :environment do
      Stock.create(:symbol => 'ATMI', :quantity => 250, :purchase_price => 9.95, :portfolio_id => Portfolio.first.id)
    end
    
    task :refresh_all  => :environment do
        require 'options'
        start = Time.now
        Options.refresh_all(true)
        puts "Repo refreshed at: #{Time.now} and took #{Time.now - start} seconds"
        
    end
  
end