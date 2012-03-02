class AddDefaultsAndRemoveNameFromGraphic < ActiveRecord::Migration
  def change
    remove_column :graphics, :name
    change_column :graphics, :public, :boolean, :default => false
  end
end
