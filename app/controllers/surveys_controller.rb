# @author Communication Training Analysis Corporation <info@ctacorp.com>
#
# Manages the Survey lifecycle.

class SurveysController < ApplicationController

  before_filter :set_as_cached

  # GET /surveys/:id/thank_you_page(.:format)
  def thank_you_page
    get_survey_and_version
    @results = PollResults.new(@survey_version)
    respond_to do |format|
      format.html do
        render 'surveys/thank_you', :layout => 'application',
          locals: { survey: @survey, survey_version: @survey_version }
      end
      format.json do
        html = render_to_string :template => "surveys/thank_you.html.erb",
          :layout => false,
          :locals => { survey: @survey, survey_version: @survey_version }
        json = {:html => html}.to_json
        render json: json
      end
    end
  end

  # GET     /surveys(.:format)
  def index
    if Rails.env != 'development'
      render nothing: true
    else

      @surveys = Survey.all

      respond_to do |format|
        format.html # index.html.erb
        format.xml  { render :xml => @surveys }
      end
    end
  end

  # GET     /surveys/:id(.:format)
  def show
    get_survey_and_version
    respond_to do |format|
      format.html # show.html.erb
      format.json do
        html = render_to_string(action: "show", layout: false, formats: [:html])
        render json: {html: html}, callback: params[:callback]
      end
    end
  end

  # GET      /surveys/:id/test_invitation
  def test_invitation
  end

  # GET     /surveys/:id/visit(.:format)
  def visit
    cookie_name = "survey_view_#{params[:id]}"
    unless cookies[cookie_name].present?
      get_survey_and_version
      cookies[cookie_name] = {:value => true, :expires => 1.day.from_now}
      @survey_version.increment_temp_visit_count
    end
    render :nothing => true
  end

  def invitation
    get_survey_and_version
    @test_invitation = params[:test_invitation].present?
    @survey_version.increment_temp_invitation_count unless @test_invitation
    render :nothing => true
  end

  def invitation_accept
    get_survey_and_version
    @test_invitation = params[:test_invitation].present?
    @survey_version.increment_temp_invitation_accepted_count unless @test_invitation
    render :nothing => true
  end

  def holding_page
    get_survey_and_version
    render :holding_page
  end

  private
  def get_survey_and_version
    @survey = Survey.find(params[:id])
    @survey_version = @survey.published_version
  end

  def get_survey_version(survey, version)
    major, minor = version.split('.')
    @survey_version = survey.survey_versions.where(:major => major, :minor => minor).first
  end

  def display_poll_results?
    @survey.survey_type_id == SurveyType::POLL &&
      @survey_version.choice_questions.any? {|q| q.display_results? }
  end

  def set_as_cached
    expires_in 60.minutes, :public => true
  end
end
