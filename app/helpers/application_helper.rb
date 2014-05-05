# @author Communication Training Analysis Corporation <info@ctacorp.com>
#
# View helper repository for helpers used across functional areas of the application.
module ApplicationHelper
  def language_attribute
    if @survey.present? && @survey.locale.present?
      @survey.locale
    else
      "en"
    end
  end
end
