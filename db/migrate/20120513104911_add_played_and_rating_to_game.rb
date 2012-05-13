class AddPlayedAndRatingToGame < ActiveRecord::Migration
  def change
    add_column :games, :likes, :integer, :default => 0
    add_column :games, :dislikes, :integer, :default => 0
  end
end
