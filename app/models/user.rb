class User < ActiveRecord::Base

  has_many :assets
  
  devise :database_authenticatable, :registerable, :omniauthable,
         :recoverable, :rememberable, :trackable, :validatable

  attr_accessible :email, :password, :password_confirmation, :remember_me, :first_name, :last_name
  
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
          :first_name => data.first_name, :last_name => data.last_name
        ) 
      end
    end 
  end
  
  
end
