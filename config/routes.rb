CommentToolPublic::Application.routes.draw do
  get "widget/widget"

  resources :surveys, except: :destroy do
    member do
      get 'thank_you_page'
    end
  end
  resources :survey_responses, only: :create

  root :to => 'surveys#index'
end
