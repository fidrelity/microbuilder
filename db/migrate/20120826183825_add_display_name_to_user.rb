class AddDisplayNameToUser < ActiveRecord::Migration
  def up
    add_column :users, :display_name, :string
    User.all.each do |user|
      user.display_name ||= user.first_name
      user.save
    end
  end
  
  def down
    remove_column :users, :display_name
  end
end
