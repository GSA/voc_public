window.VOC = window.VOC || {};

window.VOC = (function($, voc) {
  var page_url,
    changeTimer,
    changeInterval = 5000,
    lastSubmitted;

  voc.Url = voc.Url || "";

  /* Private Functions */
  function show_next_page(page) {
    var required_unanswered = false;
    required_unanswered = check_for_unanswered_required(page);

    if (!required_unanswered) {
      $("#page_" + page)
        .hide();
      var next_page = $("#page_" + page + "_next_page")
        .val();

      /* Set the prev page on next page */
      set_prev_page(page, next_page);

      $("#page_" + next_page)
        .show();
      window.location.hash = "PAGE_" + next_page;

      var title = $(document)
        .prop("title");
      $(document)
        .prop("title", replace_page_number_in_title(title, next_page));
    } else {
      alert(survey_required_fields_error);
    }
  }

  function check_for_unanswered_required(page) {
    required = false;
    $("#page_" + page + " input[type=hidden].required_question")
      .each(function(index) {
        if ($(this)
          .val() == 'true') {
          question_number = $(this)
            .attr('id')
            .split('_')[1]; // q_{number}_required
          /* if the element is a radio button that is required then check to make sure one is checked */
          if ($(".question_" + question_number + "_answer")
            .attr('type') == "radio" && $(".question_" + question_number + "_answer:checked")
            .length == 0) {
            required = true;
          } else if ($("select.question_" + question_number + "_answer")
            .length > 0 && $("select.question_" + question_number + "_answer")
            .val() == "") {
            required = true;
          } else if ($(".question_" + question_number + "_answer")
            .attr('type') == "checkbox" && $(".question_" + question_number + "_answer")
            .length > 0 && $(".question_" + question_number + "_answer:checked")
            .length == 0) {
            required = true;
          } else if ($(".question_" + question_number + "_answer")
            .attr('type') == "text" && $(".question_" + question_number + "_answer")
            .val() == "") {
            required = true;
          } else if ($(".question_" + question_number + "_answer")
            .prop('tagName')
            .toLowerCase() == "textarea" && $(".question_" + question_number + "_answer")
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

  function show_prev_page(page) {
    var prev_page = $("#page_" + page + "_prev_page")
      .val();
    $("#page_" + page)
      .hide();
    $("#page_" + prev_page)
      .show();
    window.location.hash = "PAGE_" + (prev_page || 1);

    var title = $(document)
      .prop("title");
    $(document)
      .prop("title", replace_page_number_in_title(title, prev_page));
  }

  function set_next_page(current_page, next_page) {
    $("#page_" + current_page + "_next_page")
      .val(next_page);
    $("#page_" + next_page + "_prev_page")
      .val(current_page);
  }

  function set_prev_page(current_page, prev_page) {
    $("#page_" + prev_page + "_prev_page")
      .val(current_page);
  }

  function validate_before_submit(page) {
    if (!check_for_unanswered_required(page)) {
      clearPartialTimeout();
      return true;
    } else {
      alert(survey_required_fields_error);
      return false;
    }

  }

  /* Publicly available functions through the VOC object */
  function onPageLoad() {
    page_url = $("#response_page_url");
    if (page_url.val() == "" && parent) {
      page_url.val(parent.document.location.origin + parent.document.location.pathname);
    }

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
