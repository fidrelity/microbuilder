class AddReportAttributesForGraphic < ActiveRecord::Migration
  def up
  	add_column :graphics, :visible, :boolean, :default => true
    add_column :graphics, :reports, :integer, :default => 0
  end

  def down
  end
end
