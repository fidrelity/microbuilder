class Game < ActiveRecord::Base
  belongs_to :author, :class_name => 'User', :foreign_key => 'user_id'
  has_and_belongs_to_many :graphics
  
  before_destroy :destroy_unreferenced_graphics
  before_create :check_win_condition
  before_create :check_graphics
  
  validates_presence_of :title, :instruction, :data
  
  def create_graphics_association(graphic_ids)
    return unless graphic_ids
    
    graphic_ids.each do |id|
      graphics << Graphic.find(id)
    end
  end
  
  private
    def destroy_unreferenced_graphics
      graphics.each do |graphic|
        graphic.games.delete(self)
        unless graphic.user
          graphic.destroy
        end
      end
    end
    
    def check_win_condition
      win_regex = /\"type\":\"win\"/
      data.match(win_regex)
    end
    
    def check_graphics
      graphics.each do |graphic|
        return false unless graphic.public || graphic.user == self.author
      end
    end
end