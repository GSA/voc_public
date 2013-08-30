# @author Communication Training Analysis Corporation <info@ctacorp.com>
#
# Manages the SurveyResponse lifecycle.
class SurveyResponsesController < ApplicationController

  # POST    /survey_responses(.:format)
  def create
    # The survey respondent doesn't care if the submit actually succeeded or not.  Delay the processing
    # of the response so the browser will return immediately
    SurveyResponse.delay.process_response params[:response], params[:survey_version_id]

    @survey_version = SurveyVersion.find(params[:survey_version_id])

    redirect_to thank_you_page_survey_path(@survey_version.survey), :stylesheet => params[:stylesheet]
  end
end
