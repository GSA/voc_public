//= require voc.fn

window.VOC = window.VOC || {};

(function(voc) {
  var changeTimer,
    changeInterval = 5000,
    lastSubmitted;

  voc.Url = voc.Url || "";

  /* Private Functions */
  function show_next_page(link, page) {
    var _this = link;
    var required_unanswered = false;
    var surveyContainer = VOC.fn.getParents(_this, ".voc-form")[0];

    required_unanswered = check_for_unanswered_required(surveyContainer, page);

    if (!required_unanswered) {
      var currentPage = surveyContainer.querySelector("#page_" + page);
      VOC.fn.removeClass(currentPage, "current_page");
      VOC.fn.addClass(currentPage, "hidden_page");

      var next_page_number = surveyContainer
        .querySelector("#page_" + page + "_next_page").value;

      /* Set the prev page on next page */
      set_prev_page(surveyContainer, page, next_page_number);

      var nextPage = surveyContainer.querySelector("#page_" + next_page_number);
      VOC.fn.removeClass(nextPage, "hidden_page");
      VOC.fn.addClass(nextPage, "current_page");

      document.title = replace_page_number_in_title(document.title, next_page_number);

      /* Focus the first focusable on the limit */
      focusFirstElementIn(nextPage);
    } else {
      alert(survey_required_fields_error);
    }

  }

  function focusFirstElementIn(obj) {
    var focusableElementsString = "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";
    focusableItems = obj.querySelectorAll(focusableElementsString);
    Array.prototype.filter.call(focusableItems, function(el) {
      return (el.offsetWidth > 0 || el.offsetHeight > 0 ||
          el.getClientRects().length > 0);
    });
  }

  function check_for_unanswered_required(surveyContainer, page) {
    var required = false;
    var elements = surveyContainer
      .querySelectorAll("#page_" + page + " input[type='hidden'].required_question");

    /* Loop through the required elements and make sure they have answers */
    Array.prototype.forEach.call(elements, function(el, index) {
        /* Check if the question requires an answer */
        if (el.value == 'true') {
          var question_number = el.id.split('_')[1];
          var question_answer = surveyContainer
            .querySelector(".question_" + question_number + "_answer");
          var question_answer_type = question_answer.type;

          switch(question_answer_type) {
            case "radio":
              var answers = surveyContainer.querySelectorAll(".question_" +
                  question_number + "_answer");
              var selected = Array.prototype.filter.call(answers, function(answer) {
                return answer.checked;
              });
              if(selected.length == 0) {
                required = true;
              }
              break;
            case "checkbox":
              var answers = surveyContainer.querySelectorAll(".question_" +
                  question_number + "_answer");
              var selected = Array.prototype.filter.call(answers, function(answer) {
                return answer.checked;
              });
              if(selected.length == 0) {
                required = true;
              }
              break;
            case "text":
              if(question_answer.value == "") {
                required = true;
              }
              break;
            default:
              var tagName = question_answer.tagName.toLowerCase();
              if(tagName == "select" || tagName == "textarea") {
                if(question_answer.value == "") {
                  required = true;
                }
              }
          };
        }
      });
    return required;
  }

  function replace_page_number_in_title(title, number) {
    return title.replace(/ - Page \d+ - /, " - Page " + number + " - ");
  }

  function show_prev_page(link, page) {
    var surveyContainer = VOC.fn.getParents(link, ".voc-form")[0];
    var prev_page = surveyContainer
      .querySelector("#page_" + page + "_prev_page")
      .value;
    var prevPageElem = surveyContainer.querySelector("#page_" + prev_page);
    var currentPage = surveyContainer.querySelector("#page_" + page);

    /* Hide the current page and show the target page */
    VOC.fn.removeClass(currentPage, "current_page");
    VOC.fn.addClass(currentPage, "hidden_page");
    VOC.fn.removeClass(prevPageElem, "hidden_page");
    VOC.fn.addClass(prevPageElem, "current_page");

    document.title = replace_page_number_in_title(document.title, prev_page);

    focusFirstElementIn(prevPageElem);
  }

  function set_next_page(element, current_page, next_page) {
    var surveyContainer = $(element).parents("form.voc-form");
    surveyContainer.find("#page_" + current_page + "_next_page")
      .val(next_page);
    surveyContainer.find("#page_" + next_page + "_prev_page")
      .val(current_page);
  }

  function set_prev_page(surveyContainer, current_page, prev_page) {
    surveyContainer.querySelector("#page_" + prev_page + "_prev_page")
      .value = current_page;
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

  function serializeForm(form) {
    var formData = Array.prototype.filter.call(form.elements, function(el) {
      return !(el.type in ['checkbox', 'radio'] || el.checked)
    })
    .filter(function(el) { return !!el.name; })
    .filter(function(el) { return !el.disabled; })
    .map(function(el) {
      return encodeURIComponent(el.name) + '=' + encodeURIComponent(el.value);
    }).join('&');

    return formData;
  }

  /* Publicly available functions through the VOC object */
  function onPageLoad() {
    lastSubmitted = new Date()
      .getTime() - changeInterval;

    // Add on change handlers
    document.querySelector(".voc-form").addEventListener("change", function(event) {
      timer_form(serializeForm(this));
    });

    function timer_form(form_data) {
      // if not submitted in the last 10 seconds, submit the survey
      clearPartialTimeout();
      changeTimer = setTimeout(post_form(form_data), changeInterval);
    }

    function clearPartialTimeout() {
      clearTimeout(changeTimer);
    }

    function post_form(form_data) {
      if ((new Date().getTime() - lastSubmitted) > changeInterval) {
        lastSubmitted = new Date().getTime();
        var url = voc.Url + "/survey_responses/partial";
        var request = new XMLHttpRequest();
        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send(form_data);
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
})(window.VOC);


/* bind the onPageLoad function to the DOMContentLoaded event */
(function() {
  function completed() {
    document.removeEventListener("DOMContentLoaded", completed);
    window.removeEventListener("load", completed);
    VOC.onPageLoad();
  }

  /* Handle the case where we don't execute this code until after the DOM has
   * finished loading.
   */
  if(document.readyState === "complete" ||
      (document.readyState !== "loading" && !document.documentElement.doScroll) ){
    window.setTimeout(VOC.onPageLoad);
  } else {
    document.addEventListener("DOMContentLoaded", completed);
    window.addEventListener("load", completed);
  }
})();

