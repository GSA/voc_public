FactoryGirl.define do
  factory :survey_version do
    major 1
    minor 1
    association(:survey)

    trait :published do
      published true
      locked true
    end

    trait :unpublished do
      published false
      locked false
    end
  end
end
