require "rails_helper"

RSpec.feature "View published survey list" do
  scenario "User should see a list of published surveys" do
    create :survey_version, :published, major: 1, minor: 1,
      survey: FactoryGirl.create(:survey, :site_survey, name: "Published")
    create :survey_version, :unpublished, major: 1, minor: 1,
      survey: FactoryGirl.create(:survey, :site_survey, name: "Unpublished")

    visit root_path

    expect(page).to have_content "Published"
    expect(page).to_not have_content "Unpublished"
  end
end
