class CreateGamesGraphicsJoinTable < ActiveRecord::Migration
  def self.up
    create_table :games_graphics, :id => false do |t|
        t.references :game
        t.references :graphic
    end
    add_index :games_graphics, [:game_id, :graphic_id]
    add_index :games_graphics, [:graphic_id, :game_id]
  end

  def self.down
    drop_table :games_graphics
  end
end
