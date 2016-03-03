window.VOC = window.VOC || {};

window.VOC = (function($, voc) {
  var changeTimer,
    changeInterval = 5000,
    lastSubmitted;

  voc.Url = voc.Url || "";

  /* Private Functions */
  function show_next_page(link, page) {
    var _this = link;
    var required_unanswered = false;
    var surveyContainer = $(_this).parents("form.voc-form");

    required_unanswered = check_for_unanswered_required(surveyContainer, page);

    if (!required_unanswered) {
      surveyContainer.find("#page_" + page).hide();
      var next_page = surveyContainer.find("#page_" + page + "_next_page")
        .val();

      /* Set the prev page on next page */
      set_prev_page(surveyContainer, page, next_page);

      surveyContainer.find("#page_" + next_page).show();

      var title = $(document)
        .prop("title");
      $(document)
        .prop("title", replace_page_number_in_title(title, next_page));

      /* Focus the first focusable on the limit */
      focusFirstElementIn(surveyContainer.find("#page_"+next_page));
    } else {
      alert(survey_required_fields_error);
    }

  }

  function focusFirstElementIn(obj) {
    var focusableElementsString = "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";
    focusableItems = obj.find("*")
      .filter(focusableElementsString).filter(':visible');
    focusableItems.get(0).focus();
  }

  function check_for_unanswered_required(surveyContainer, page) {
    required = false;
    surveyContainer.find("#page_" + page + " input[type=hidden].required_question")
      .each(function(index) {
        if ($(this)
          .val() == 'true') {
          question_number = $(this)
            .attr('id')
            .split('_')[1]; // q_{number}_required
          /* if the element is a radio button that is required then check to make sure one is checked */
          if (surveyContainer.find(".question_" + question_number + "_answer")
            .attr('type') == "radio" && surveyContainer.find(".question_" + question_number + "_answer:checked")
            .length == 0) {
            required = true;
          } else if (surveyContainer.find("select.question_" + question_number + "_answer")
            .length > 0 && surveyContainer.find("select.question_" + question_number + "_answer")
            .val() == "") {
            required = true;
          } else if (surveyContainer.find(".question_" + question_number + "_answer")
            .attr('type') == "checkbox" && surveyContainer.find(".question_" + question_number + "_answer")
            .length > 0 && surveyContainer.find(".question_" + question_number + "_answer:checked")
            .length == 0) {
            required = true;
          } else if (surveyContainer.find(".question_" + question_number + "_answer")
            .attr('type') == "text" && surveyContainer.find(".question_" + question_number + "_answer")
            .val() == "") {
            required = true;
          } else if (surveyContainer.find(".question_" + question_number + "_answer")
            .prop('tagName')
            .toLowerCase() == "textarea" && surveyContainer.find(".question_" + question_number + "_answer")
            .val() == "") {
            /* a textarea does not have a an attr('type') so use the prop('tagName') */
            required = true;
          }
        }
      });
    return required;
  }

  function replace_page_number_in_title(title, number) {
    return title.replace(/ - Page \d+ - /, " - Page " + number + " - ");
  }

  function show_prev_page(link, page) {
    var _this = link;
    var surveyContainer = $(_this).parents("form.voc-form");
    var prev_page = surveyContainer.find("#page_" + page + "_prev_page")
      .val();
    surveyContainer.find("#page_" + page)
      .hide();
    surveyContainer.find("#page_" + prev_page)
      .show();

    var title = $(document)
      .prop("title");
    $(document)
      .prop("title", replace_page_number_in_title(title, prev_page));

    focusFirstElementIn(surveyContainer.find("#page_" + prev_page));
  }

  function set_next_page(element, current_page, next_page) {
    var surveyContainer = $(element).parents("form.voc-form");
    surveyContainer.find("#page_" + current_page + "_next_page")
      .val(next_page);
    surveyContainer.find("#page_" + next_page + "_prev_page")
      .val(current_page);
  }

  function set_prev_page(surveyContainer, current_page, prev_page) {
    surveyContainer.find("#page_" + prev_page + "_prev_page")
      .val(current_page);
  }

  function validate_before_submit(button, page) {
    var _this = button;
    var surveyContainer = $(_this).parents("form.voc-form");
    if (!check_for_unanswered_required(surveyContainer, page)) {
      clearPartialTimeout();
      return true;
    } else {
      alert(survey_required_fields_error);
      return false;
    }

  }

  /* Publicly available functions through the VOC object */
  function onPageLoad() {
    lastSubmitted = new Date()
      .getTime() - changeInterval;

    // Add on change handlers
    $(".voc-form")
      .on("change", function(event) {
        timer_form($(this)
          .serialize());
      })

    function timer_form(form_data) {
      // if not submitted in the last 10 seconds, submit the survey
      clearPartialTimeout();
      changeTimer = setTimeout(post_form(form_data), changeInterval);
    }

    function clearPartialTimeout() {
      clearTimeout(changeTimer);
    }

    function post_form(form_data) {
      if ((new Date()
          .getTime() - lastSubmitted) > changeInterval) {
        lastSubmitted = new Date()
          .getTime();
        $.post(voc.Url + "/survey_responses/partial", form_data);
      }
    }
  }

  voc.show_next_page = show_next_page;
  voc.show_prev_page = show_prev_page;
  voc.set_next_page = set_next_page;
  voc.set_prev_page = set_prev_page;
  voc.onPageLoad = onPageLoad;
  voc.validate_before_submit = validate_before_submit;

  return voc;
})(jQuery, window.VOC);

jQuery(VOC.onPageLoad);
