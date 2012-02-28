class AddBackgroundFlagToGraphics < ActiveRecord::Migration
  def change
    add_column :graphics, :background, :boolean, :default => false
  end
end
