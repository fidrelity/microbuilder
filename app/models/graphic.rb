class Graphic < ActiveRecord::Base
  attr_accessor :image_data
  
  belongs_to :user
  has_and_belongs_to_many :games

  before_destroy :referenced?
  
  has_attached_file :image, PAPERCLIP_OPTIONS
  
  before_create :generate_file_name
  before_create :decode_base64_image
  
  scope :all_public, where(:public => true)
  scope :backgrounds, where(:background => true)
  scope :without_backgrounds, where(:background => false)
  
  # override paperclip method to fit custom url
  def image
    if Rails.env.production?
      "https://s3.amazonaws.com/mbgfx/app/public/graphics/#{id}/#{image_file_name}"
    else
      "/graphics/#{id}/#{image_file_name}"
    end
  end

  def to_response_hash
    user_name = user.display_name if user
    {
      :id => id, :name => image_file_name, :url => image, 
      :background => background, :user_name => user_name,
      :frame_count => frame_count, :frame_width => frame_width,
      :frame_height => frame_height
    }
  end
  
  protected  
    def decode_base64_image
      if image_data
        content_type = 'image/png'
        decoded_data = Base64.decode64(image_data.split(/data:image\/png;base64,/).last)
        
        data = StringIO.new(decoded_data)
        data.content_type = content_type
        data.original_filename = File.basename(self.image_file_name)

        self.image = data
      end
    end
    
    def generate_file_name
      self.image_file_name = Time.now.to_i.to_s + "_" + user.id.to_s + ".png" unless self.image_file_name
    end
    
    def referenced?
      self.games.none?
    end
end