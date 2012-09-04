class Stream
  
  class << self
    def create_message(type, user_id, game_id)
      current_message_id = message_id
      REDIS.multi do
        REDIS.hmset(current_message_id.to_i, 'type', type, 'user_id', user_id, 'game_id', game_id)
        REDIS.lpush('stream', current_message_id)
        REDIS.incr('message_id')
      end
    end
    
    def latest(max = 20)
      message_ids = REDIS.lrange('stream', 0, max)
      messages = []
      message_ids.each do |message_id|
        messages << REDIS.hgetall(message_id)
      end
      messages
    end

  private
    def message_id
      REDIS.get('message_id') || REDIS.set('message_id', 0) && REDIS.get('message_id')
    end
  end
end