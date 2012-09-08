module ApplicationHelper

  def get_user_dropdown_content current_user

    if current_user
      return render :partial => 'layouts/user_dropdown/user_logged_in'
    else
      return render :partial => 'layouts/user_dropdown/user_logged_out'
    end

  end


  def page_title

    # return raw('Play<span class="label label-warning titleSmall">tin</span>')
    # return raw('<div id="logo"></div>')
    return raw('<h1>Playtin</h1>')

  end

  def limit_string( str, limit = 10 )

    return str if str.length <= limit

    snip_idx = str.index(/\s/, limit)    

    str = str[0, snip_idx] + " ..." if snip_idx

    return str

  end

  # Renders stream-activity message
  def render_message(message, element_tag = "li")

    user = User.find_by_id(message['user_id'])
    game = Game.find_by_id(message['game_id'])
    type = message['type']

    return unless game

    username = get_stream_user(user, game)

    types = { 
              :game => " created ", 
              :comment => " commented on ", 
              :like => " liked ", 
              :dislike => " disliked " 
            }
    verb = types[type.to_sym]

    author_link = type != "game" ? " #{link_to(game.author.display_name, user_path(game.author))}'s " : ""
    game_link = "#{link_to(game.title, play_path(game))}"

    return "<#{element_tag}>" + username + verb + author_link + game_link + "</#{element_tag}>"
  end

  def get_stream_user(user, game)
    if user
      "<div class='avatar_stream'>#{link_to( image_tag(game.author.display_image, :class => "stream-image"), user_path(user) )}</div> #{link_to(user.display_name, user_path(user))}" 
    else
      "Anonymous"
    end
  end

end