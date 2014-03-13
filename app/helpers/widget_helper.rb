# @author Communication Training Analysis Corporation <info@ctacorp.com>
#
# View helpers for Javascript widget functionality.
module WidgetHelper
  def invitation_text
    text = @survey.invitation_text
    text ||= "Would you like to take a survey?<br/>"
  end

  def invitation_accept_button_text
    if @survey.invitation_accept_button_text.empty? 
      "Yes"
    else
      @survey.invitation_accept_button_text
    end
  end

  def invitation_reject_button_text
    if @survey.invitation_reject_button_text.empty?
      "No"
    else
      @survey.invitation_reject_button_text
    end
  end
end
