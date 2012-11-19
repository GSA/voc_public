CommentToolPublic::Application.routes.draw do
  get "widget/widget"

  resources :surveys, except: :destroy do
    collection do
      get 'thank_you'
    end
    member do
      get 'thank_you_page'
    end
  end
  resources :survey_responses, only: :create

  match '/surveys/thank_you' => "surveys#thank_you", :via => [:options]
  root :to => 'surveys#index'
end
