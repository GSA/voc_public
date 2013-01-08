# @author Communication Training Analysis Corporation <info@ctacorp.com>
#
# View helpers for SurveyResponse functionality.
module SurveysHelper
  
  # For a given ChoiceQuestion with flow control at the ChoiceAnswer level,
  # generates the Javascript logic to enforce correct page switching.
  # 
  # @param [ChoiceQuestion] element the ChoiceQuestion instance
  # @return [String] the generated Javascript code
  def generate_next_page_on_change(element)
    q_content = element.assetable.question_content
    return "" unless q_content.flow_control
    
    q_answers = element.assetable.choice_answers
    
    change_function = q_answers.map {|answer| "if($(this).val() == \"#{answer.id}\"){$('#page_'+#{element.page.page_number}+'_next_page').val(\"#{answer.next_page_id.nil? ? (element.page.page_number + 1) : answer.page.page_number}\")}"}.join(';')
  end
  
  # Uses question properties to set onclick events for flow control and
  # jumping to the next page upon response.
  #
  # @param [ChoiceQuestion] element the ChoiceQuestion instance
  # @param [Page] page the Page instance
  # @param [ChoiceAnswer] answer the ChoiceAnswer instance
  # @return [String] the JS to attach to the HTML element's onclick attribute
  def generate_onclick(element, page, answer)
    onclick = ""
    if element.assetable.question_content.flow_control
      onclick += "set_next_page(#{page.page_number}, #{answer.page.try(:page_number) || (element.page.page_number + 1)});"
    end
    
    if element.assetable.auto_next_page
      onclick += "show_next_page(#{page.page_number});"
    end
    
    onclick
  end
end
