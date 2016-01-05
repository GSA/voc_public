FactoryGirl.define do
  factory :survey do
    sequence(:name) {|n| "Default Survey #{n}"}
    description "Default Survey Description"
    association(:site)

    trait :site_survey do
      survey_type {
        SurveyType.where(id: SurveyType::SITE).first_or_create do |survey_type|
          survey_type.name = "Site"
        end
      }
    end

    trait :poll_survey do
      survey_type {
        SurveyType.where(id: SurveyType::POLL).first_or_create do |survey_type|
          survey_type.name = "Poll"
        end
      }
    end

    trait :page_survey do
      survey_type {
        SurveyType.where(id: SurveyType::PAGE).first_or_create do |survey_type|
          survey_type.name = "Page"
        end
      }
    end
  end
end
