class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.string :title
      t.string :instruction
      t.string :data
      t.integer :user_id

      t.timestamps
    end
  end
end
