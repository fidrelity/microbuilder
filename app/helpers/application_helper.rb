module ApplicationHelper

  def get_user_dropdown_content current_user

    if current_user
      return render :partial => 'layouts/user_dropdown/user_logged_in'
    else
      return render :partial => 'layouts/user_dropdown/user_logged_out'
    end

  end

end
