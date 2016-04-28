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

    required_unanswered = VOC.fn.check_for_unanswered_required(surveyContainer, page);

    if (required_unanswered) {
      alert(survey_required_fields_error);
    } else {
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
      VOC.fn.focusFirstElementIn(nextPage);
    }

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

    VOC.fn.focusFirstElementIn(prevPageElem);
  }

  function set_next_page(element, current_page, next_page) {
    var surveyContainer = VOC.fn.getParents(element, ".voc-form")[0];
    surveyContainer.querySelector("#page_" + current_page + "_next_page")
      .value = next_page;
    surveyContainer.querySelector("#page_" + next_page + "_prev_page")
      .value = current_page;
  }

  function set_prev_page(surveyContainer, current_page, prev_page) {
    surveyContainer.querySelector("#page_" + prev_page + "_prev_page")
      .value = current_page;
  }

  function validate_before_submit(button, page) {
    var surveyContainer = VOC.fn.getParents(button, ".voc-form")[0];
    if (VOC.fn.check_for_unanswered_required(surveyContainer, page)) {
      alert(survey_required_fields_error);
      return false;
    } else {
      clearPartialTimeout();
      return true;
    }
  }

  /* Publicly available functions through the VOC object */
  function onPageLoad() {
    lastSubmitted = new Date()
      .getTime() - changeInterval;

    // Add on change handlers
    document.querySelector(".voc-form").addEventListener("change", function(event) {
      timer_form(VOC.fn.serializeForm(this));
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
