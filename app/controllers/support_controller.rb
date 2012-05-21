# Opens github issue for any support/report/feedback from clients
# Url: https://github.com/playtin/Support/issues
class SupportController < ApplicationController
  respond_to :js, :only => [:feedback, :ticket]

  def feedback
    create_issue "Feedback: #{params[:subject]}",  params[:body], "Feedback"
  end

  def report_game
    create_issue "Report: #{params[:type]} [#{params[:gid]}]", params[:body], "Report"
  end
  
  def ticket
    create_issue "Ticket: #{params[:subject]}", params[:body], "question"
  end

  # -------------------

  private

  def create_issue title, body, label
    return false if title.empty? || body.empty?
    client = Octokit::Client.new(:login => "playtin", :password => "platin3")
    client.create_issue("playtin/support", title, body, { :labels => [ label ]})
  end

end