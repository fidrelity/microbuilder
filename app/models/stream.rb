class Stream
  
  class << self
    def create_message(type, user, object)
      current_message_id = message_id
      object_id_key = type == "graphic" ? "graphic_id" : "game_id"
      
      REDIS.multi do
        REDIS.hmset(
          current_message_id.to_i, 
          'type', type, 'user_id', (user.nil? ? nil : user.id), 
          object_id_key, object.id, 'date', DateTime.now.to_s
        )
        REDIS.expire(current_message_id, 21.days.seconds)
        REDIS.lpush('stream', current_message_id)
        REDIS.lpush("stream_#{object.user.id}", current_message_id) unless type == ("game" || "graphic")
        REDIS.lpush("stream_#{user.id}", current_message_id) if user && user != object.user
        REDIS.incr('message_id')
      end
      user_ids = [object.user.id]
      user_ids << user.id if user
      delete_obsolete_messages(user_ids)
    end
    
    def latest(max = 10)
      max = 20 if max > 20
      message_ids = REDIS.lrange('stream', 0, (max - 1))
      messages = []
      message_ids.each do |message_id| 
        message = REDIS.hgetall(message_id)
        messages << message unless message.empty?
      end
      messages
    end

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