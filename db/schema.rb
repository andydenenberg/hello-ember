# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130820183128) do

  create_table "histories", :force => true do |t|
    t.decimal  "cash",                :precision => 10, :scale => 2
    t.decimal  "stocks",              :precision => 10, :scale => 2
    t.integer  "stocks_count"
    t.decimal  "options",             :precision => 10, :scale => 2
    t.integer  "options_count"
    t.decimal  "total",               :precision => 10, :scale => 2
    t.datetime "snapshot_date"
    t.integer  "portfolio_id"
    t.datetime "created_at",                                         :null => false
    t.datetime "updated_at",                                         :null => false
    t.decimal  "daily_dividend",      :precision => 10, :scale => 2
    t.datetime "daily_dividend_date"
  end

  add_index "histories", ["portfolio_id"], :name => "index_histories_on_portfolio_id"

  create_table "portfolios", :force => true do |t|
    t.string   "name"
    t.integer  "user_id"
    t.integer  "portfolio_id"
    t.decimal  "cash",         :precision => 10, :scale => 2
    t.datetime "created_at",                                  :null => false
    t.datetime "updated_at",                                  :null => false
  end

  create_table "prices", :force => true do |t|
    t.string   "sec_type"
    t.string   "symbol"
    t.datetime "last_update"
    t.decimal  "change",              :precision => 10, :scale => 2
    t.decimal  "strike",              :precision => 10, :scale => 2
    t.string   "exp_date"
    t.decimal  "bid",                 :precision => 10, :scale => 2
    t.decimal  "ask",                 :precision => 10, :scale => 2
    t.decimal  "last_price",          :precision => 10, :scale => 2
    t.datetime "created_at",                                         :null => false
    t.datetime "updated_at",                                         :null => false
    t.decimal  "daily_dividend",      :precision => 10, :scale => 2
    t.datetime "daily_dividend_date"
  end

  create_table "stocks", :force => true do |t|
    t.string   "symbol"
    t.string   "name"
    t.integer  "portfolio_id"
    t.decimal  "quantity",        :precision => 10, :scale => 2
    t.decimal  "purchase_price",  :precision => 10, :scale => 2
    t.string   "purchase_date"
    t.decimal  "strike",          :precision => 10, :scale => 2
    t.string   "expiration_date"
    t.string   "stock_option"
    t.datetime "created_at",                                     :null => false
    t.datetime "updated_at",                                     :null => false
  end

  create_table "users", :force => true do |t|
    t.string   "email",                  :default => "", :null => false
    t.string   "encrypted_password",     :default => "", :null => false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "authentication_token"
    t.datetime "created_at",                             :null => false
    t.datetime "updated_at",                             :null => false
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

end
