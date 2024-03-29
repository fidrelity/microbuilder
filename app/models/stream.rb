#
# Possible Types:
# => game, graphic, graphic_publish, like, dislike, comment
#

class Stream
  
  class << self
    
    def create_message(type, user, obj)
      current_message_id = message_id
      
      object_id_key = get_event_data_by_type(type)[:object_id]    
      
      REDIS.multi do
        REDIS.hmset(
          current_message_id.to_i, 
          'type', type, 'user_id', (user.nil? ? nil : user.id), 
          object_id_key, obj.id, 'date', DateTime.now.to_s
        )
        REDIS.expire(current_message_id, 21.days.seconds)
        REDIS.lpush('stream', current_message_id)
        REDIS.lpush("stream_#{obj.user.id}", current_message_id) unless type == ("game" || "graphic" || "graphic_publish")
        REDIS.lpush("stream_#{user.id}", current_message_id) if user && user != obj.user
        REDIS.incr('message_id')
      end
      user_ids = [obj.user.id]
      user_ids << user.id if user
      delete_obsolete_messages(user_ids)

      # Push to real-time stream
      to_pusher(type, user, obj) if Rails.env.production?
    end
   
    def latest(max = 10, current_user = nil)

      max = 20 if max > 20      
      message_ids = REDIS.lrange('stream', 0, (max - 1))      
      messages = []
      
      message_ids.each do |message_id| 
      
        message = REDIS.hgetall(message_id)      
        messages << buildMessageForStream(message, current_user) unless message.empty?
      
      end
      
      messages

    end

    # Builds stream activity message with all data
    def buildMessageForStream(message, current_user)

      type = message["type"]

      event = get_event_data_by_type(type)

      obj = get_stream_object(type, message[event[:object_id]])

      user = User.find_by_id(message['user_id'])

      return unless obj

      message = get_message_data(type, obj, user, current_user)

      common_data = {
        :type => type
      }

      return message.merge(common_data)

    end

    # Returns object (i.e game or graphic)
    def get_stream_object(type, object_id)      
    
      if type == "graphic" || type == "graphic_publish"
        return Graphic.find_by_id(object_id)
      else
        Game.find_by_id(object_id)
      end
      
    end

    # Push game to pusher
    def to_pusher(type, user, obj)

      channel_name = "stream_channel"

      event = get_event_data_by_type(type)

      data = get_message_data(type, obj, user)

      # Actual send
      Pusher[channel_name].trigger(event[:pusher_event], data)

    end

    # Returns data hash for message by type
    def get_message_data(type, obj, user = nil, current_user = nil)

      event = get_event_data_by_type(type)      

      authorName = get_author_name(obj, event[:pusher_event], current_user)

      data = case type

        when "game"
          # authorName's created gameTitle
          {        
            :authorName => authorName,
            :authorPath => "/users/#{obj.author.id}",
            :authorImage => obj.author.display_image,
            :gameTitle => obj.title,
            :gamePath => "/play/#{obj.id}",
            :gameImage => obj.preview_image.to_s

          }

        when "graphic"
          # authorName painted graphicTitle {type}
          image_type = obj.background ? "background" : "graphic"

          {
            :authorName => authorName,
            :authorPath => "/users/#{obj.user.id}",
            :authorImage => obj.user.display_image,
            :graphicTitle => obj.name,
            :graphicPath => obj.image.to_s,
            :imageType => image_type,
            :isBackground => obj.background
          }

        when "graphic_publish"
          # authorName painted graphicTitle {type}
          image_type = obj.background ? "background" : "graphic"

          {
            :authorName => authorName,
            :authorPath => "/users/#{obj.user.id}",
            :authorImage => obj.user.display_image,
            :graphicTitle => obj.name,
            :graphicPath => obj.image.to_s,
            :imageType => image_type,
            :isBackground => obj.background
          }


        else           
          # userName {verb} authorName's gameTitle
          userName = get_user_name(user, current_user)
          userPath = user.nil? ? "" : "/users/#{user.id}"
          userImage = user.nil? ? "" : user.display_image

          {
            :userName => userName,
            :userPath => userPath,
            :userImage => userImage,
            :authorName => authorName,
            :authorPath => "/users/#{obj.user.id}",            
            :gameTitle => obj.title,
            :gamePath => "/play/#{obj.id}",
            :gameImage => obj.preview_image.to_s,
            :actionType => event[:verb] # liked, disliked, commented on
          }

      end

      return data

    end

    # Returns data for stream message type
    def get_event_data_by_type(type)

      events = {
        
        "game" => {
          :object_id => "game_id",
          :pusher_event => "game_create",
          :verb => "created"          
        }, 

        "graphic" => {
          :object_id => "graphic_id",
          :pusher_event => "graphic_create",
          :verb => "painted"
        }, 

        "graphic_publish" => {
          :object_id => "graphic_id",
          :pusher_event => "graphic_publish",
          :verb => "published"
        }, 
        
        "like" => {
          :object_id => "game_id",
          :pusher_event => "game_action",
          :verb => "liked"
        }, 

        "dislike" => {
          :object_id => "game_id",
          :pusher_event => "game_action",
          :verb => "disliked"
        }, 

        "comment" => {
          :object_id => "game_id",
          :pusher_event => "game_action",
          :verb => "commented on"
        }

      }

      return events[type]
    end

    # Returns authors name (the one who created obj)    
    def get_author_name(obj, type, current_user)

      return obj.user.display_name if current_user.nil?

      if current_user == obj.user && type != "game_action"
        "You"
      elsif current_user == obj.user && type == "game_action"
        "your"
      else
        obj.user.display_name
      end

    end

    # Returns the name of the user who liked, disliked, commented on the obj    
    def get_user_name(user, current_user)

      if user.nil? 
        "Anonymous" 
      elsif current_user == user
        "You"
      else 
        user.display_name
      end

    end

    # -----------------------------------
    private

      def message_id
        REDIS.get('message_id') || REDIS.set('message_id', 0) && REDIS.get('message_id')
      end
      
      def delete_obsolete_messages(user_ids)
        user_ids.each do |user_id|
          REDIS.ltrim("stream_#{user_id}", 0, 19)
        end
          REDIS.ltrim("stream", 0, 49)
      end

  end

end