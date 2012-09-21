class SurveyResponsesController < ApplicationController
  before_filter :cors_preflight_check
  after_filter :cors_set_access_control_headers

  # For all responses in this controller, return the CORS access control headers.

  def cors_set_access_control_headers
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
    headers['Access-Control-Max-Age'] = "1728000"
  end

  # If this is a preflight OPTIONS request, then short-circuit the
  # request, return only the necessary headers and return an empty
  # text/plain.

  def cors_preflight_check
    if request.method == :options
      headers['Access-Control-Allow-Origin'] = '*'
      headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
      headers['Access-Control-Allow-Headers'] = 'X-Requested-With, X-Prototype-Version'
      headers['Access-Control-Max-Age'] = '1728000'
      render :text => '', :content_type => 'text/plain'
    end
  end
  
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
