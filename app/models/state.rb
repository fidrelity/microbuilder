class State < ActiveRecord::Base
  belongs_to :asset
  
  has_attached_file :image, :styles => { :medium => "300x300>", :thumb => "100x100>" }
end