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

    if @survey_version.survey.survey_type_id == SurveyType::POLL && @survey_version.choice_questions.any? {|q| q.display_results? }
      @results = PollResults.new(@survey_version)
      render 'surveys/poll_results', :stylesheet => params[:stylesheet], :layout => 'application'
    else
      if @survey_version.present? && @survey_version.thank_you_page.present?
        render :text => @survey_version.thank_you_page, :stylesheet => params[:stylesheet], :layout => 'application'
      else
        redirect_to :controller => 'surveys', :action => 'thank_you', :stylesheet => params[:stylesheet]
      end
    end
  end
end
