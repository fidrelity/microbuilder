class Game < ActiveRecord::Base
  include PgSearch
  include ::GraphicPreProcessor
  
  belongs_to :author, :class_name => 'User', :foreign_key => 'user_id'
  has_and_belongs_to_many :graphics
  has_many :game_comments, :dependent => :destroy
  has_attached_file :preview_image, PAPERCLIP_THUMB_OPTIONS
  
  before_destroy :destroy_unreferenced_graphics
  before_create :check_graphics
  
  validate :win_condition_in_data
  validates_presence_of :title, :instruction, :data
  
  scope :all_by_played, order("played DESC")
  scope :all_latest, order("created_at DESC")
  pg_search_scope :search, :against => [:title, :instruction]
  
  attr_accessor :preview_image_file_name, :preview_image_data
  attr_accessible :title, :instruction, :data, :preview_image, :preview_image_data, :preview_image_file_name
  
  class << self
    # SQL from http://evanmiller.org/how-not-to-sort-by-average-rating.html
    def all_by_rating
      query = <<-eos
        SELECT *, ((likes + 1.9208) / (likes + dislikes) 
          - 1.96 * SQRT((likes * dislikes) / (likes + dislikes) + 0.9604) 
          / (likes + dislikes)) / (1 + 3.8416 / (likes + dislikes)) 
        AS rating FROM games WHERE likes + dislikes > 0 
        ORDER BY rating DESC;
      eos
      find_by_sql(query);
    end
  end
  
  def create_graphics_association(graphic_ids)
    return unless graphic_ids
    
    graphic_ids.each do |id|
      graphics << Graphic.find(id)
    end
  end

  # rating algorithm from http://evanmiller.org/how-not-to-sort-by-average-rating.html
  def rating
    total = (likes + dislikes)
    z = 1.96
    return 0 if total == 0
    
    phat = 1.0 * likes/total
    (phat + z*z/(2*total) - z * Math.sqrt((phat*(1-phat)+z*z/(4*total))/total))/(1+z*z/total)
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
    
    def win_condition_in_data
      win_regex = /\"type\":\"win\"/
      unless data.match(win_regex)
        errors[:data] << "Missing Win-Condition"  
      end
    end
    
    def check_graphics
      graphics.each do |graphic|
        return false unless graphic.public || graphic.user == self.author
      end
    end
end