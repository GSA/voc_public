module SurveysHelper
  
  def generate_next_page_on_change(element)
    q_content = element.assetable.question_content
    return "" unless q_content.flow_control
    
    q_answers = element.assetable.choice_answers
    
    change_function = q_answers.map {|answer| "if($(this).val() == \"#{answer.id}\"){$('#page_'+#{element.page.page_number}+'_next_page').val(\"#{answer.next_page_id.nil? ? (element.page.page_number + 1) : answer.page.page_number}\")}"}.join(';')
    
#    
#    change_function = q_answers.inject do |memo, answer|
#      memo.concat("if($(this).val() == \"#{answer.id}\"){$('#page_'+#{element.page.number}+'_next_page').val(\"#{answer.next_page_id.nil? ? (element.page.number + 1) : answer.page.number}\")};")
#    end
  end
  
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
