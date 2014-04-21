# @author Communication Training Analysis Corporation <info@ctacorp.com>
#
# View helpers for Javascript widget functionality.
module WidgetHelper
  def invitation_text
    if @survey.invitation_text.blank?
      render 'default_invite_text'
    else
      text = @survey.invitation_text
      text.gsub!('{{accept}}', invitation_accept_button_text)
      text.gsub!('{{reject}}', invitation_reject_button_text)
      text.html_safe
    end
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
