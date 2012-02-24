class CreateState < ActiveRecord::Migration
  def change
    create_table :states do |t|
      t.string :name
      t.integer :speed
      t.integer :frame_count
      t.integer :asset_id
      t.has_attached_file :image
      t.timestamps
    end
  end
end
