# Opens github issue for any support/report/feedback from clients
# Url: https://github.com/playtin/Support/issues
class SupportController < ApplicationController

  def feedback
    @params = params[:feedback]
    create_issue  @params[:title],  @params[:body], "Feedback"
  end

  def report_game
    @params = params[:report]
    create_issue  "Report: Game [#{@params[:game_id]}]",  @params[:body], "Report"
  end
  
  def support_ticket
    @params = params[:support]
    create_issue  @params[:subject],  @params[:body], "Support"
  end

  # -------------------

  private

  def create_issue title, body, label
    return false if title.empty? || body.empty?
    client = Octokit::Client.new(:login => "playtin", :password => "platin3")
    client.create_issue("playtin/support", title, body, { :labels => [ label ]})
  end

end