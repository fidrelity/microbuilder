class AddTagsToGame < ActiveRecord::Migration
  def change
    add_column :games, :tags, :text
  end
end
