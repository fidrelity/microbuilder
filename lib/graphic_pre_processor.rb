module GraphicPreProcessor
  def self.included(base)
    base.class_eval do
      before_create :decode_base64_image
    end
  end

  def decode_base64_image
    content_type = 'image/png'
    
    if self.class == Graphic
      decoded_data = Base64.decode64(self.image_data.split(/data:image\/png;base64,/).last)
      data = StringIO.new(decoded_data)
      data.class.class_eval { attr_accessor :original_filename, :content_type }
      data.content_type = content_type
      data.original_filename = File.basename(self.name)
      self.image = data
    else
      decoded_data = Base64.decode64(self.preview_image_data.split(/data:image\/png;base64,/).last)
      data = StringIO.new(decoded_data)
      data.class.class_eval { attr_accessor :original_filename, :content_type }
      data.content_type = content_type
      data.original_filename = File.basename("thumbnail")
      self.preview_image = data
    end
  end
end