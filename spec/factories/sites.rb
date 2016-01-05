FactoryGirl.define do
  factory :site do
    sequence(:name) {|n| "Test Site #{n}"}
    sequence(:url) {|n| "http://www.example-#{n}.com" }
    description "Default Description"
  end
end
