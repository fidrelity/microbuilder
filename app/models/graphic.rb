class Graphic < ActiveRecord::Base
  belongs_to :user
  before_save :decode_base64_image

  attr_accessor :image_data, :image_file_name

  has_attached_file :image, :styles => { :medium => "300x300>", :thumb => "100x100>" }

  protected
    def decode_base64_image
      if image_data
        content_type = 'image/png'
        decoded_data = Base64.decode64(image_data.split(/data:image\/png;base64,/).last)
        filename = self.user.display_name + "_" + Time.now.to_i
        
        data = StringIO.new(decoded_data)
        data.content_type = content_type
        data.original_filename = File.basename(filename)

        self.image = data
      end
    end
end