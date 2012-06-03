class Graphic < ActiveRecord::Base
  include PgSearch
  include ::GraphicPreProcessor

  attr_accessor :image_data
  attr_accessible :name, :image_data, :image_file_name, :frame_count, :frame_width, :frame_height, :public, :background
  
  belongs_to :user
  has_and_belongs_to_many :games

  before_destroy :referenced?
  
  has_attached_file :image, PAPERCLIP_OPTIONS
  
  default_scope :order => 'created_at DESC'
  pg_search_scope :search, :against => :name
  scope :with_public, where(:public => true)
  scope :with_private, where(:public => false)
  scope :backgrounds, where(:background => true)
  scope :without_backgrounds, where(:background => false)
  
  #das größere von width und height soll between min/max sein
  
  scope :between_size, lambda { |min, max|
    where(
      "(frame_width >= ? OR frame_height >= ?) AND frame_width  <= ? AND frame_height <= ?",
      min, min, max, max
    )
  }

  def to_response_hash
    user_name = user.display_name if user
    {
      :id => id, :name => image_file_name, :url => image.to_s, 
      :background => background, :user_name => user_name,
      :frame_count => frame_count, :frame_width => frame_width,
      :frame_height => frame_height
    }
  end
  
  def soft_delete
    games.any? ? update_attribute(:user, nil) : destroy
  end
  
  protected
    def self.filter(_public, _backgrounds, min = nil, max = nil)
      query = _backgrounds ? backgrounds : without_backgrounds

      case _public
      when true 
       query.with_public   
      when
        query.with_private
      end

      unless _backgrounds
        if min && max && min < max
          query = query.between_size(min, max)
        else
          raise InvalidGraphicBoundaries, "Boundaries invalid"
        end
      end
      query
    end
    
    def referenced?
      self.games.none?
    end
end

class InvalidGraphicBoundaries < Exception
end