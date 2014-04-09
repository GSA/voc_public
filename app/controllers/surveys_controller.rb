# @author Communication Training Analysis Corporation <info@ctacorp.com>
#
# Manages the Survey lifecycle.

class SurveysController < ApplicationController
  caches_action :show, :cache_path => Proc.new {|c|
    c.params.delete_if {|k,v| k.starts_with?('utm_')}
  }

  # GET /surveys/:id/thank_you_page(.:format)
  def thank_you_page
    get_survey_and_version

    respond_to do |format|
      if @survey.survey_type_id == SurveyType::POLL && @survey_version.choice_questions.any? {|q| q.display_results? }
        @results = PollResults.new(@survey_version)
        format.html do
          render 'surveys/poll_results', :layout => 'application',
                 locals: { survey: @survey, survey_version: @survey_version, results: @results }
        end
        format.json do
          html = render_to_string :template => 'surveys/poll_results.html.erb', :layout => false,
                                  locals: { survey: @survey, survey_version: @survey_version, results: @results }
          json = {:html => html}.to_json
          render :text => "#{params[:callback]}(#{json})", :content_type => "text/javascript"
        end
      else
        format.html do
          render 'surveys/thank_you', :layout => 'application',
                 locals: { survey: @survey, survey_version: @survey_version }
        end
        format.json do
            html = render_to_string :template => "surveys/thank_you.html.erb", :layout => false,
                                    :locals => { survey: @survey, survey_version: @survey_version }
            json = {:html => html}.to_json
            render :text => "#{params[:callback]}(#{json})", :content_type => "text/javascript", :layout => false
        end
      end
    end
  end

  # GET     /surveys(.:format)
  def index
    @surveys = Survey.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @surveys }
    end
  end

  # GET     /surveys/:id(.:format)
  def show
    get_survey_and_version
    #@survey_version = params[:version].blank? ? @survey.published_version : get_survey_version(@survey, params[:version])
    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @survey }
      format.json do
        html = render_to_string(:template => "surveys/show.html.erb")
        json = {:html => html}.to_json
        render :text => "#{params[:callback]}(#{json})", :content_type => "text/javascript"
      end
    end
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
    @survey_version.increment_temp_invitation_count
    render :nothing => true
  end

  def invitation_accept
    get_survey_and_version
    @survey_version.increment_temp_invitation_accepted_count
    render :nothing => true
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
end
