class AddVersionToGame < ActiveRecord::Migration
  def change
    add_column :games, :version, :integer, :default => 2
    Game.all.each { |game| game.update_attribute(:version, 2) }
  end
end
