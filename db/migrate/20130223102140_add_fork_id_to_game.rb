class AddForkIdToGame < ActiveRecord::Migration
  def change
  	add_column :games, :fork_id, :integer
  end
end
