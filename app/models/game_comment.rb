class GameComment < ActiveRecord::Base
  belongs_to :game, :class_name => 'Game', :foreign_key => 'game_id'
  belongs_to :user, :class_name => 'User', :foreign_key => 'user_id'

  validates_presence_of :comment, :game_id
  default_scope :order => 'created_at DESC'
  
  attr_accessible :comment, :game_id
end