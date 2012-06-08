class AddWonToGame < ActiveRecord::Migration
  def change
    add_column :games, :won, :integer, :default => 0
  end
end
