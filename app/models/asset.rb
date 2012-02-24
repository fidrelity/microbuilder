class Asset < ActiveRecord::Base
  belongs_to :user
  has_many :states
end