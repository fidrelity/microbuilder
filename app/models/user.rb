class User < ActiveRecord::Base

  has_many :games
  has_many :graphics
  
  devise :database_authenticatable, :registerable, :omniauthable,
         :recoverable, :rememberable, :trackable, :validatable

  attr_accessible :email, :password, :password_confirmation, 
                  :remember_me, :first_name, :last_name, :facebook_id
  
  validates_length_of :first_name, :minimum => 2
  validates_length_of :last_name, :minimum => 2
  
  class << self
    def find_for_facebook_oauth(access_token, signed_in_resource=nil)
      data = access_token.extra.raw_info
      if user = User.where(:email => data.email).first
        user
      else # Create a user with a stub password.
        p '*' * 20
        p data
        User.create!(
          :email => data.email, :password => Devise.friendly_token[0,20],
          :first_name => data.first_name, :last_name => data.last_name, :facebook_id => data.id
        ) 
      end
    end 
  end
  
  def display_name
    self.first_name
  end

  def display_image
    facebook? ? facebook_image_url : gravatar_image_url
  end
  
  def facebook?
    !!facebook_id
  end
  
  def facebook_image_url
    "https://graph.facebook.com/#{facebook_id}/picture"
  end
  
  def gravatar_image_url
    "http://www.gravatar.com/avatar/#{gravatar_email_hash}?s=50"
  end
  
  private
    def gravatar_email_hash
      Digest::MD5.hexdigest(email)
    end
end
