module ApplicationHelper

  def get_user_dropdown_content current_user
    if current_user
      return render :partial => 'layouts/user_dropdown/user_logged_in'
    else
      return render :partial => 'layouts/user_dropdown/user_logged_out'
    end
  end
  
  def head_line( first, second )
  
    return raw( "<h2 class='page-header'>" + first + "<span>" + second + "</span></h2>" )
  
  end
  
  def section_line( first, second )
  
    return raw( "<h2 class='section-header'>" + first + "<span>" + second + "</span></h2>" )
  
  end
  
  def button_line( first, second )
  
    return raw( first + "<span>" + second + "</span>" )
  
  end
  
  def add_icon( str, icon )
  
    return raw( "<i class='" + icon + "'></i>" + str )
  
  end

  def limit_string( str, limit = 10 )
    return str if str.length <= limit

    snip_idx = str.index(/\s/, limit)
    str = str[0, snip_idx] + " ..." if snip_idx

    if snip_idx == nil && str.length > limit * 2
      str = str[0, limit * 2] + " ..."
    end

    return str
  end

  # ---- Strean ----
  def render_message(message, element_tag = "li")

    user = User.find_by_id(message['user_id'])
    type = message['type']
    object = get_stream_object(message, type)
           
    return unless object    

    display_name = get_user_display_name(user) if user

    case type

      when "game"    
        return render :partial => 'shared/streamtypes/game', :locals => { :user => user, :game => object, :display_name => display_name}
      
      when "like"        
        return render :partial => 'shared/streamtypes/game_action', :locals => { :user => user, :game => object, :verb => "liked", :author => object.author, :display_name => display_name }

      when "dislike"        
        return render :partial => 'shared/streamtypes/game_action', :locals => { :user => user, :game => object, :verb => "disliked", :author => object.author, :display_name => display_name }

      when "comment"
        return render :partial => 'shared/streamtypes/game_action', :locals => { :user => user, :game => object, :verb => "commented on", :author => object.author, :display_name => display_name }

      when "graphic"
        graphic_type = object.background ? "background" : "graphic"
        return render :partial => 'shared/streamtypes/graphic', :locals => { :user => user, :graphic => object, :graphic_type => graphic_type, :display_name => display_name}

      when "graphic_publish"
        graphic_type = object.background ? "background" : "graphic"
        return render :partial => 'shared/streamtypes/graphic_publish', :locals => { :user => user, :graphic => object, :graphic_type => graphic_type, :display_name => display_name}
    end   

  end

  # Returns object like game or graphic
  def get_stream_object(message, type)
    
    if type == "graphic" || type == "graphic_publish"
      return Graphic.find_by_id(message['graphic_id']) 
    end

    Game.find_by_id(message['game_id'])
  end

  def get_user_display_name(user)

    if user_signed_in? && current_user == user
      return "You"
    else
      return user.display_name
    end

  end

  # Returns twitter bootstrap class for difficulty label
  def difficulty_class(difficulty)

    index = difficulty - 1
    #in_words = ["success", "warning", "important"]
    in_words = ["easy", "moderate", "hard"]

    return index > -1 ? in_words[ index ] : "moderate"

  end

end