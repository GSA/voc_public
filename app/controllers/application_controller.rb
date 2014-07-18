# @author Communication Training Analysis Corporation <info@ctacorp.com>
#
# Base Controller class; provides support for
# {http://en.wikipedia.org/wiki/Cross-origin_resource_sharing cross-origin resource sharing (CORS)}.
class ApplicationController < ActionController::Base

  before_filter :cors_set_shared_headers
  before_filter :cors_preflight_check
  after_filter :cors_set_access_control_headers

  # For all responses in this controller, return the CORS access control headers.
  # At this point, the shared headers have already been set
  def cors_set_access_control_headers
    Rails.logger.info "Allowing request from #{request.env['HTTP_ORIGIN']}"
    headers['Access-Control-Allow-Headers'] = 'Pragma, Cache-Control'
  end

  # If this is a preflight OPTIONS request, then short-circuit the
  # request, return only the necessary headers and return an empty
  # text/plain.
  def cors_preflight_check
    if request.method == :options
      headers['Access-Control-Allow-Headers'] = 'X-Requested-With, X-Prototype-Version, Pragma'
      render :text => '', :content_type => 'text/plain'
    end
  end

  private

  # Working in the context of a survey, reach through to site url for origin
  # This is not going to work if we ever key off anything other than a
  # survey id in the future
  def cors_set_shared_headers
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
    headers['Access-Control-Max-Age'] = '108000'
  end
end
