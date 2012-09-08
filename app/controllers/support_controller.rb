# Opens github issue for any support/report/feedback from clients
# Url: https://github.com/playtin/Support/issues
class SupportController < ApplicationController
  
  respond_to :js, :only => [:feedback, :ticket, :report]

  def feedback
    issue_state = create_issue "Feedback: #{params[:subject]}", params[:body], "Feedback"
    @message_type = issue_state ? "success" : "error"
  end

  def report
    game_link = root_url + "play/#{params[:gid]}"
    
    body = params[:body] + "\n\n#{game_link}" if params[:body]

    issue_state = create_issue "Report: #{params[:type]} [#{params[:gid]}]", body, "Report"
    @message_type = issue_state ? "success" : "error"
  end
  
  def ticket
    create_issue "Ticket: #{params[:subject]}", params[:body], "question"
  end

  # -------------------

  private

  def create_issue title, body, label = "question"
    return false if title.empty? || body.empty?
    Feedhub::open_issue(:title => title, :body => append_user_to_body( body ), :label => label)
    true
  end

  def append_user_to_body(body)

    if user_signed_in?
      user_link = root_url + "users/#{current_user.id}"
      body = body + "\n\nFrom: #{current_user.display_name}\n#{user_link}" if !body.empty?
    end

    return body

  end

end