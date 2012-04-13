class AddNameToGraphic < ActiveRecord::Migration
  def change
    add_column :graphics, :name, :string
  end
end
