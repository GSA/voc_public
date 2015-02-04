# @author Communication Training Analysis Corporation <info@ctacorp.com>
#
# View helpers for Javascript widget functionality.
module WidgetHelper
  def invitation_text
    if @survey.invitation_text.blank?
      "Would you like to take a survey?<br/>"
    else
      @survey.invitation_text
    end
  end

  def invitation_accept_button_text
    if @survey.invitation_accept_button_text.blank? 
      "Yes"
    else
      @survey.invitation_accept_button_text
    end
  end

  def invitation_reject_button_text
    if @survey.invitation_reject_button_text.blank?
      "No"
    else
      @survey.invitation_reject_button_text
    end
  end
end
