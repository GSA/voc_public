CommentToolPublic::Application.routes.draw do
  get 'widget/widget'
  get 'widget/invitation'
  get 'scripts/gatc-survey', to: 'google_analytics#gatc_survey'

  resources :surveys, except: :destroy do
    member do
      get 'thank_you_page'
      get 'visit'
    end
  end
  resources :survey_responses, only: :create

  root :to => 'surveys#index'
end
