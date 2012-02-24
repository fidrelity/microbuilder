class AlterAsset < ActiveRecord::Migration
  def up
    remove_column :assets, :title
    remove_column :assets, :filename
    remove_column :assets, :statecount
    remove_column :assets, :background
    
    add_column :assets, :user_id, :integer
    add_column :assets, :name, :string, :null => false
  end

  def down
    add_column :assets, :title, :string
    add_column :assets, :filename, :string
    add_column :assets, :statecount, :string
    add_column :assets, :background, :boolean
    
    remove_column :assets, :name
    remove_column :assets, :user_id
  end
end
