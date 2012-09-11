module ApplicationHelper

  def get_user_dropdown_content current_user
    if current_user
      return render :partial => 'layouts/user_dropdown/user_logged_in'
    else
      return render :partial => 'layouts/user_dropdown/user_logged_out'
    end
  end

  def page_title
    return raw('<h1>Playtin</h1>')
  end

  def limit_string( str, limit = 10 )
    return str if str.length <= limit
    snip_idx = str.index(/\s/, limit)    
    str = str[0, snip_idx] + " ..." if snip_idx

    return str
  end

  # ---- Strean ----
  def render_message(message, element_tag = "li")
    username = get_stream_user(message['user_id'])
    type = message['type']
    object = get_stream_object(message, type)

    return unless object

    objects_link = get_object_link(object, type)
    authors_link = get_objects_author(object, type)

    types = {
              :game => " created ", 
              :comment => " commented on ", 
              :like => " liked ", 
              :dislike => " disliked ",
              :graphic => " created "
            }
    verb = types[type.to_sym]

    return "<#{element_tag}>" + username + verb + authors_link + objects_link + "</#{element_tag}>"

  end

  # Helps to render correct user for stream
  def get_stream_user(user_id)
    user = User.find_by_id(user_id)    

    if user
      "<div class='avatar_stream'>#{link_to( image_tag(user.display_image, :class => "stream-image"), user_path(user) )}</div> #{link_to(user.display_name, user_path(user))}" 
    else
      "Anonymous"
    end
  end

  # Get Object (like game or graphic)
  def get_stream_object(message, type)
    type == "graphic" ? Graphic.find_by_id(message['graphic_id']) : Game.find_by_id(message['game_id'])    
  end

  # Get author of the object
  def get_objects_author(object, type)
    (type == "game" || type == "graphic") ? "" : " #{link_to(object.author.display_name, user_path(object.author))}'s "
  end

  # Get link of object
  def get_object_link(object, type)
    type == "graphic" ? "the graphic #{link_to(object.name, object.image.to_s)}" : "the game #{link_to(object.title, play_path(object))}"
  end

end