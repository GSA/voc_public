# @author Communication Training Analysis Corporation <info@ctacorp.com>
#
# Manages the lifecycle of the Javascript widget.
class WidgetController < ApplicationController
  respond_to :js

  # Provides a customized (server-configured) copy of the
  # widget Javascript on demand.
  def widget
  end

  def invitation
    @survey = Survey.find(params[:survey_id])
    @test_invitation = params[:test_invitation].present?
  end
end
