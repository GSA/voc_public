# @author Communication Training Analysis Corporation <info@ctacorp.com>
#
# Manages the SurveyResponse lifecycle.
class SurveyResponsesController < ApplicationController

  # POST    /survey_responses(.:format)
  def create
    # The survey respondent doesn't care if the submit actually succeeded or not.  Delay the processing
    # of the response so the browser will return immediately
    resque_args = params[:response], params[:survey_version_id]

    begin
      Resque.enqueue(SurveyResponseCreateJob, *resque_args)
    rescue
      Rails.logger.error("Error queueing Resque job: #{$!.to_s}")
      ResquedJob.create(class_name: "SurveyResponseCreateJob", job_arguments: resque_args )
    end

    @survey_version = SurveyVersion.find(params[:survey_version_id])

    redirect_to thank_you_page_survey_path(@survey_version.survey, params.slice(:stylesheet))
  end
end
