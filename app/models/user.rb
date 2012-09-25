class User < ActiveRecord::Base

  has_many :games
  has_many :graphics
  has_many :game_comments
  
  devise :database_authenticatable, :registerable, :omniauthable,
         :recoverable, :rememberable, :trackable, :validatable

  attr_accessible :email, :password, :password_confirmation, :display_name,
                  :remember_me, :first_name, :last_name, :facebook_id
          
  before_create :generate_display_name                
  validates_length_of :first_name, :minimum => 2
  validates_length_of :last_name, :minimum => 2
  validates_length_of :display_name, :minimum => 2
  
  class << self
    def find_for_facebook_oauth(access_token, signed_in_resource=nil)
      data = access_token.extra.raw_info
      if user = User.where(:email => data.email).first
        user
      else # Create a user with a stub password.
        User.create!(
          :email => data.email, :password => Devise.friendly_token[0,20], :display_name => data.username,
          :first_name => data.first_name, :last_name => data.last_name, :facebook_id => data.id
        ) 
      end
    end 
  end
  
  def latest_stream(max = 20)
    message_ids = REDIS.lrange("stream_#{self.id}", 0, max)
    messages = []
    message_ids.each do |message_id| 
      message = REDIS.hgetall(message_id)
      messages << message unless message.empty?
    end
    messages
  end
  
  def push_message(message_id)
    REDIS.lpush('stream', message_id)
  end

  def display_image
    facebook? ? facebook_image_url : gravatar_image_url
  end
  
  def facebook?
    !!facebook_id
  end
  
  def facebook_image_url
    "https://graph.facebook.com/#{facebook_id}/picture?type=large"
  end
  
  def gravatar_image_url
    "http://www.gravatar.com/avatar/#{gravatar_email_hash}?s=180&d=monsterid"
  end
  
  private
    def generate_display_name
      self.display_name = display_name || first_name  
    end
  
    def gravatar_email_hash
      Digest::MD5.hexdigest(email)
    end
end
