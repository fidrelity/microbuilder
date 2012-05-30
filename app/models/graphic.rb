class Graphic < ActiveRecord::Base
  include PgSearch
  #include ::GraphicPreProcessor

  attr_accessor :image_data
  attr_accessible :name, :image_data, :image_file_name, :frame_count, :frame_width, :frame_height, :public, :background
  
  belongs_to :user
  has_and_belongs_to_many :games

  before_destroy :referenced?
  before_create :decode_base64_image
  
  has_attached_file :image, PAPERCLIP_OPTIONS
  
  pg_search_scope :search, :against => :name
  scope :all_public, where(:public => true)
  scope :backgrounds, where(:background => true)
  scope :without_backgrounds, where(:background => false)
  scope :between_size, lambda { |min, max|
    where(
      "frame_width >= ? AND frame_width <= ? AND frame_height >= ? AND frame_height <= ?", 
      min, max, min, max
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
    def decode_base64_image
      if image_data
        content_type = 'image/png'
        decoded_data = Base64.decode64(image_data.split(/data:image\/png;base64,/).last)
        
        data = StringIO.new(decoded_data)
        data.class.class_eval { attr_accessor :original_filename, :content_type }
        data.content_type = content_type
        data.original_filename = File.basename(self.name)

        self.image = data
      end
    end
  
    def self.filter(backgrounds, min = nil, max = nil)
      query = backgrounds ? self.backgrounds : self.without_backgrounds

      unless backgrounds
        if min && max && min < max
          return query.between_size(min, max)
        else
          raise InvalidGraphicBoundaries, "Boundaries invalid"
        end
      end
    end
    
    def referenced?
      self.games.none?
    end
end

class InvalidGraphicBoundaries < Exception
end