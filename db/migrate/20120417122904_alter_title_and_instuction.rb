class AlterTitleAndInstuction < ActiveRecord::Migration
  Game.where(title = nil).each do |game|
    game.update_attribute(:title, game.author.display_name + "s game")
  end
  
  Game.where(instruction = nil).each do |game|
    game.update_attribute(:instruction, "click something")
  end
  
  Game.where(data = nil).each do |game|
    game.update_attribute(:data, "{}")
  end
  
  def up
    change_column :games, :title, :string, :null => false
    change_column :games, :instruction, :string, :null => false
    change_column :games, :data, :text, :null => false
  end

  def down
    change_column :games, :title, :string
    change_column :games, :instruction, :string
    change_column :games, :data, :text
  end
end
