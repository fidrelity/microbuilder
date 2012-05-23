class AlterGameAddPlayed < ActiveRecord::Migration
  def change
    add_column :games, :played, :integer, :default => 0
  end
end
