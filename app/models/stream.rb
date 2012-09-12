class Stream
  
  class << self
    def create_message(type, user, object)
      current_message_id = message_id
      object_id_key = type == "graphic" ? "graphic_id" : "game_id"
      
      REDIS.multi do
        REDIS.hmset(current_message_id.to_i, 'type', type, 'user_id', (user.nil? ? nil : user.id), object_id_key, object.id)
        REDIS.lpush('stream', current_message_id)
        REDIS.lpush("stream_#{object.user.id}", current_message_id) unless type == "game"
        REDIS.lpush("stream_#{user.id}", current_message_id) if user
        REDIS.incr('message_id')
      end
    end
    
    def latest(max = 10)
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
  end
end