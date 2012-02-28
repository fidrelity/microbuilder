class RenameAssetsToGraphics < ActiveRecord::Migration
  def change
    rename_table :assets, :graphics
    rename_column :graphics, :sizex, :frame_width
    rename_column :graphics, :sizey, :frame_height
    add_column :graphics, :frame_count, :integer
    drop_table :states
  end 
end
