# @author Communication Training Analysis Corporation <info@ctacorp.com>
#
# View helpers for Javascript widget functionality.
module WidgetHelper
  def invitation_text
    if @survey.invitation_text.blank?
      render 'default_invite_text'
    else
      text = @survey.invitation_text
      accept_button = render partial: 'accept_button'
      reject_button = render partial: 'reject_button'
      text.gsub!('{{accept}}', accept_button)
      text.gsub!('{{reject}}', reject_button)
      text.html_safe
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

  def start_screen_button_text
    if @survey.start_screen_button_text.blank?
      "Start"
    else
      @survey.start_screen_button_text
    end
  end  
end
