FactoryGirl.define do

  factory :user, :aliases => [:author]  do
    first_name  { Forgery(:name).first_name }
    last_name   { Forgery(:name).last_name }
    email       { Forgery(:internet).email_address }
    password    "124abcd"
  end
  
  factory :facebook_user, :parent => :user do
    facebook_id "01051909"
  end
  
  factory :graphic do
    association   :user
    frame_width   64
    frame_height  64
    frame_count   1
  end
  
  factory :game do
    association   :author, :factory => :user
    title         "Game X"
    instruction   "press X"
    data          "{}"
  end
end