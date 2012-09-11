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

    user = User.find_by_id(message['user_id'])
    type = message['type']
    object = get_stream_object(message, type)

    return unless object

    case type

      when "game"    
        return render :partial => 'shared/streamtypes/game', :locals => { :user => user, :game => object}
      
      when "like"
        return render :partial => 'shared/streamtypes/game_action', :locals => { :user => user, :game => object, :verb => "liked", :author => object.author }

      when "dislike"
        return render :partial => 'shared/streamtypes/game_action', :locals => { :user => user, :game => object, :verb => "disliked", :author => object.author }

      when "comment"
        return render :partial => 'shared/streamtypes/game_action', :locals => { :user => user, :game => object, :verb => "commented on", :author => object.author }

      when "graphic"
        graphic_type = object.background ? "background" : "graphic"
        return render :partial => 'shared/streamtypes/graphic', :locals => { :user => user, :graphic => object, :graphic_type => graphic_type}
   
    end   

  end

  # Returns object like game or graphic
  def get_stream_object(message, type)
    return Graphic.find_by_id(message['graphic_id']) if type == "graphic"
    Game.find_by_id(message['game_id'])    
  end 

end