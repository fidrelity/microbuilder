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

end
