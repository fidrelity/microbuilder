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

ActiveRecord::Schema.define(:version => 20120530104934) do

  create_table "game_comments", :force => true do |t|
    t.string   "comment"
    t.integer  "game_id"
    t.integer  "user_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "games", :force => true do |t|
    t.string   "title",                                     :null => false
    t.string   "instruction",                               :null => false
    t.text     "data",                                      :null => false
    t.integer  "user_id"
    t.datetime "created_at",                                :null => false
    t.datetime "updated_at",                                :null => false
    t.integer  "likes",                      :default => 0
    t.integer  "dislikes",                   :default => 0
    t.integer  "played",                     :default => 0
    t.string   "preview_image_file_name"
    t.string   "preview_image_content_type"
    t.integer  "preview_image_file_size"
    t.datetime "preview_image_updated_at"
  end

  create_table "games_graphics", :id => false, :force => true do |t|
    t.integer "game_id"
    t.integer "graphic_id"
  end

  add_index "games_graphics", ["game_id", "graphic_id"], :name => "index_games_graphics_on_game_id_and_graphic_id"
  add_index "games_graphics", ["graphic_id", "game_id"], :name => "index_games_graphics_on_graphic_id_and_game_id"

  create_table "graphics", :force => true do |t|
    t.datetime "created_at",                            :null => false
    t.datetime "updated_at",                            :null => false
    t.boolean  "public",             :default => false
    t.integer  "frame_width"
    t.integer  "frame_height"
    t.integer  "user_id"
    t.integer  "frame_count"
    t.boolean  "background",         :default => false
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
    t.string   "name"
  end

  create_table "pg_search_documents", :force => true do |t|
    t.text     "content"
    t.integer  "searchable_id"
    t.string   "searchable_type"
    t.datetime "created_at",      :null => false
    t.datetime "updated_at",      :null => false
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
    t.string   "first_name",                             :null => false
    t.string   "last_name",                              :null => false
    t.datetime "created_at",                             :null => false
    t.datetime "updated_at",                             :null => false
    t.string   "facebook_id"
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

end
