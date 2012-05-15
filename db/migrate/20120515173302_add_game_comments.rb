class AddGameComments < ActiveRecord::Migration
  def change
    create_table :game_comments do |t|
      t.string :comment
      t.integer :game_id
      t.integer :user_id
      t.timestamps
    end
  end
end
