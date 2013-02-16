# Opens github issue for any support/report/feedback from clients
# Url: https://github.com/playtin/Support/issues
class SupportController < ApplicationController
  
  respond_to :js, :only => [:feedback, :report, :report_graphic, :ticket]

  def feedback
    issue_state = create_issue "Feedback: #{params[:subject]}", params[:body], "Feedback"
    @message_type = issue_state ? "success" : "error"
  end

  def report_game
    @game = Game.find(params[:gid])
    body = params[:body]

    unless cookies["reported_game_#{@game.id}"]
      Game.transaction do
        @game.reports += 1
        @game.visible = false if @game.reports > 4
        @game.save
      end
      cookies["reported_game_#{@game.id}"] = true
      issue_state = create_issue "Report: #{params[:type]} [#{@game.id}]", append_game_to_body( body, @game.id ), "Report"
      @message_type = issue_state ? "success" : "error"
    end
  end

  def report_graphic
    
    @graphic = Graphic.find(params[:gid])

    unless cookies["reported_graphic_#{@graphic.id}"]
      
      Graphic.transaction do
        @graphic.reports += 1
        @graphic.visible = false if @graphic.reports > 4
        @graphic.save
      end
      
      support = SupportController.new
      cookies["reported_graphic_#{@graphic.id}"] = true
      issue_state = create_issue "Report: Graphic [#{@graphic.id}]", "Graphic has been reported" , "Report"
      
      return @message_type = issue_state ? "success" : "error"
    end

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

    body

  end

  def append_game_to_body(body, game_id)
    
    game_link = root_url + "play/#{game_id}"
    body = body + "\n\nGame: #{game_link}" if !body.empty?

    body

  end

end