# @author Communication Training Analysis Corporation <info@ctacorp.com>
#
# Manages the SurveyResponse lifecycle.
class SurveyResponsesController < ApplicationController

  # POST    /survey_responses(.:format)
  def create
    # save the raw @submission, then queue a survey response job
    raw_submission(true)

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

    redirect_to thank_you_page_survey_path(@survey_version.survey, params.slice(:stylesheet).reject {|k, v| v.blank?})
  end


  def partial
    raw_submission
    respond_to do |format|
      format.all {render :nothing => true, :status => 200, :content_type => 'text/html'}
    end
  end


  private

  def raw_submission(submitted = false)
    if cookies["comment_tool_#{params[:survey_id]}_#{params[:survey_version_id]}"] == nil
      cookies["comment_tool_#{params[:survey_id]}_#{params[:survey_version_id]}"] = {
        :value => SecureRandom.uuid, :expires => 1.hour.from_now }
    end
    @submission = RawSubmission.find_or_create_by_uuid_key(cookies["comment_tool_#{params[:survey_id]}_#{params[:survey_version_id]}"])
    @submission.survey_id = params[:survey_id].to_i
    @submission.survey_version_id = params[:survey_version_id].to_i
    @submission.post = params.to_hash
    @submission.submitted = submitted
    @submission.save
  end
end
