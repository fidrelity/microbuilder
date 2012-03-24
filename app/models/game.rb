class Game < ActiveRecord::Base
  belongs_to :author, :class_name => 'User', :foreign_key => 'user_id'
  has_and_belongs_to_many :graphics
  
  before_destroy :destroy_unreferenced_graphics
  
  private
    def destroy_unreferenced_graphics
      graphics.each do |graphic|
        graphic.games.delete(self)
        unless graphic.user
          graphic.destroy
        end
      end
    end
end