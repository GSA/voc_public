class SurveyResponsesController < ApplicationController
  def index
    @survey_version_id = params[:survey_version_id].nil? ? nil : SurveyVersion.find(params[:survey_version_id])
    @survey_responses = SurveyResponse.where("survey_version_id = ?", @survey_version_id).where(:status_id => 4).order("created_at desc").page params[:page]
    
    respond_to do |format|
      format.html #
      format.js {render :partial => "survey_response_list", :locals => {:objects => @survey_responses, :version_id => @survey_version_id}}
    end
  end
  
  def create
    ## The client doesn't care if the submit actually succeeded or not.  Delay the processing
    ## of the response so the browser will return immediately
    SurveyResponse.delay.process_response params[:response], params[:survey_version_id]

    redirect_to :controller => 'surveys', :action => 'thank_you', :stylesheet => params[:stylesheet]
  end

end
