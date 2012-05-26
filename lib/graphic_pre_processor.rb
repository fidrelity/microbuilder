module GraphicPreProcessor 
  module ClassMethods
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
  end
end