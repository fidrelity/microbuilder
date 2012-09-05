module ApplicationHelper

  def get_user_dropdown_content current_user

    if current_user
      return render :partial => 'layouts/user_dropdown/user_logged_in'
    else
      return render :partial => 'layouts/user_dropdown/user_logged_out'
    end

  end


  def page_title

    return raw('Play<span class="label label-warning titleSmall">tin</span>')        

  end

  def limit_string( str, limit = 10 )

    return str if str.length <= limit

    snip_idx = str.index(/\s/, limit)    

    str = str[0, snip_idx] + " ..." if snip_idx

    return str

  end

  def render_message(message)
    user = User.find_by_id(message['user_id'])
    game = Game.find(message['game_id'])
    text = user ? "#{link_to(user.display_name, user_path(user))}" : "Anonymous"
    case message['type']
    when "game"
      text += " created #{link_to(game.title, play_path(game))}"
    when "comment"
      text += " commented on #{link_to(game.author.display_name, user_path(game.author))}'s #{link_to(game.title, play_path(game))}"
    when "like"
      text += " liked #{link_to(game.author.display_name, user_path(game.author))}'s #{link_to(game.title, play_path(game))}"
    when "dislike"
      text += " disliked #{link_to(game.author.display_name, user_path(game.author))}'s #{link_to(game.title, play_path(game))}"
    end
  end
end
