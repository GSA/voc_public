# @author Communication Training Analysis Corporation <info@ctacorp.com>
#
# Provides domain-specific Google Analytics code
# (currently limited to use on a single site)
class GoogleAnalyticsController < ApplicationController
  respond_to :js

  before_filter :set_as_cached

  # Provides a customized (server-configured) copy of the
  # Google Analytics code on demand.
  def gatc_survey
  end

  private

  def set_as_cached
    expires_in 60.minutes, :public => true
  end
end
