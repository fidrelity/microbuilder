class AlterGameDataToText < ActiveRecord::Migration
  def up
    change_column :games, :data, :text
  end

  def down
    change_column :games, :data, :string
  end
end
