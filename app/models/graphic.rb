class Graphic < ActiveRecord::Base
  belongs_to :user
  has_attached_file :image, :url => "/:class/:id/:basename" + ".png"
  
  before_save :decode_base64_image
  after_create :transliterate_file_name

  attr_accessor :image_data

  # override paperclip method to fit custom url
  def image
    "graphics/#{id}/#{image_file_name}"
  end
  
  protected
    def decode_base64_image
      if image_data
        content_type = 'image/png'
        decoded_data = Base64.decode64(image_data.split(/data:image\/png;base64,/).last)
        filename = self.user.display_name + "_" + Time.now.to_i.to_s + ".png"
        
        data = StringIO.new(decoded_data)
        data.content_type = content_type
        data.original_filename = File.basename(filename)

        self.image = data
      end
    end
    
    def transliterate_file_name
      self.image_file_name = "/system/images/#{self.id}/original/#{self.user.display_name}_#{Time.now.to_i.to_s}.png"
    end
end