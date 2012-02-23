class CreateAssets < ActiveRecord::Migration
  def change
    create_table :assets do |t|

      t.timestamps
      t.string :title
      t.string :filename
      t.integer :statecount
      t.boolean :public
      t.boolean :background
      t.integer :sizex
      t.integer :sizey
    end
  end
end
