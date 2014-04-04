CommentToolPublic::Application.routes.draw do
  get 'widget/widget'
  get 'widget/invitation'
  get 'scripts/gatc-survey', to: 'google_analytics#gatc_survey'

  resources :surveys, except: :destroy do
    member do
      get 'thank_you_page'
      get 'visit'
      get 'invitation'
      get 'invitation_accept'
    end
  end
  resources :survey_responses do
    collection do
      post '/' => "survey_responses#create"
      post 'partial' => "survey_responses#partial"
    end
  end

  root :to => 'surveys#index'
end
