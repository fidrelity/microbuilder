class StreamController < ApplicationController
  
  respond_to :js, :only => [:public_stream]

  def public_stream
    @messages = Stream.latest
    render :text => @messages.to_json
  end

end