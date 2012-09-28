class AddVisibilityAndReportsToGame < ActiveRecord::Migration
  def change
    add_column :games, :visible, :boolean, :default => true
    add_column :games, :reports, :integer, :default => 0
  end
end
