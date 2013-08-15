# @author Communication Training Analysis Corporation <info@ctacorp.com>
#
# Provides domain-specific Google Analytics code
# (currently limited to use on a single site)
class GoogleAnalyticsController < ApplicationController
  respond_to :js

  # Provides a customized (server-configured) copy of the
  # Google Analytics code on demand.
  def gatc_survey
  end
end
