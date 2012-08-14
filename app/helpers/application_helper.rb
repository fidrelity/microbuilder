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

end
