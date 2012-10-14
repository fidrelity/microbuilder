class StreamController < ApplicationController
  
  respond_to :js, :only => [:public_stream]

  def public_stream
    @messages = Stream.latest(15, current_user)
        
    render :text => @messages.to_json
  end

end