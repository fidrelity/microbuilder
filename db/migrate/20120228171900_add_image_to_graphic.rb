class AddImageToGraphic < ActiveRecord::Migration
  def change
    change_table :graphics do |t|
      t.has_attached_file :image
    end
  end
end
