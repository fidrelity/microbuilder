class AddPreviewImageToGame < ActiveRecord::Migration
  def change
    change_table :games do |t|
      t.has_attached_file :preview_image
    end
  end
end
