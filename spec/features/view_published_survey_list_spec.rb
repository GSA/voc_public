require "rails_helper"

RSpec.feature "View published survey list" do
  scenario "User should see a list of published surveys" do
    create :survey_version, :published, survey: FactoryGirl.create(:survey, name: "Published")
    create :survey_version, :unpublished, survey: FactoryGirl.create(:survey, name: "Unpublished")

    visit root_path

    expect(page).to have_content "Published"
    expect(page).to_not have_content "Unpublished"
  end
end
