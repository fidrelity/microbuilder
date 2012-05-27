# Opens github issue for any support/report/feedback from clients
# Url: https://github.com/playtin/Support/issues
class SupportController < ApplicationController
  respond_to :js, :only => [:feedback, :ticket, :report]

  def feedback
    create_issue "Feedback: #{params[:subject]}",  params[:body], "Feedback"
  end

  def report
    game_link = root_url + "play/#{params[:gid]}"
    body = params[:body] + "\n\n#{game_link}"
    create_issue "Report: #{params[:type]} [#{params[:gid]}]", body, "Report"
  end
  
  def ticket
    create_issue "Ticket: #{params[:subject]}", params[:body], "question"
  end

  # -------------------

  private

  def create_issue title, body, label
    return false if title.empty? || body.empty?
    Feedhub::set_user(:name => "playtin", :password => "platin3")
    Feedhub::set_repo(:account => "playtin", :name => "Support")
    Feedhub::open_issue(:title => title, :body => body, :label => label)
  end

end