class Graphic < ActiveRecord::Base
  attr_accessor :image_data
  
  belongs_to :user
  has_and_belongs_to_many :games

  if Rails.env.production?
    has_attached_file :image, 
      :url => "/:class/:id/:basename" + ".png",
      :storage => :s3,
      :bucket => 'mbgfx',
      :s3_credentials => {
      :access_key_id => ENV['S3_KEY'],
      :secret_access_key => ENV['S3_SECRET']
    }
  else
    has_attached_file :image, :url => "/:class/:id/:basename" + ".png"
  end
  
  before_save :generate_file_name
  before_save :decode_base64_image
  before_destroy :referenced?
  
  scope :all_public, where(:public => true)
  
  # override paperclip method to fit custom url
  def image
    "/graphics/#{id}/#{image_file_name}"
  end

  def to_response_json
    user_name = user.display_name if user
    {:id => id, :name => image_file_name, :url => image, :user_name => user_name}
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
      errors.add(:base, "Graphic still referenced") if games.any?
  
      errors.blank? #return false, to not destroy the element, otherwise, it will delete.
    end
end