class Asset < ActiveRecord::Base
  belongs_to :user
  has_many :states

  #accepts_nested_attributes_for :states
end