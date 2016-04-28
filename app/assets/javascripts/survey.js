//= require voc.fn

window.VOC = window.VOC || {};

(function(voc) {
  var changeTimer,
    changeInterval = 5000,
    lastSubmitted;

  voc.Url = voc.Url || "";

  /* Private Functions */
  function replace_page_number_in_title(title, number) {
    return title.replace(/ - Page \d+ - /, " - Page " + number + " - ");
  }

  function set_next_page(element, current_page, next_page) {
    var surveyContainer = VOC.fn.getParents(element, ".voc-form")[0];
    surveyContainer.querySelector("#page_" + current_page + "_next_page")
      .value = next_page;
    surveyContainer.querySelector("#page_" + next_page + "_prev_page")
      .value = current_page;
  }

  /* Publicly available functions through the VOC object */
  function onPageLoad() {
    var surveyContainer = document.querySelector(".voc-form");
    lastSubmitted = new Date()
      .getTime() - changeInterval;

    // Add on change handlers
    surveyContainer.addEventListener("change", function(event) {
      timer_form(VOC.fn.serializeForm(this));
    });

    /* Bind pagination links */
    VOC.fn.bindPaginationLinks(surveyContainer);

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

  voc.set_next_page = set_next_page;
  voc.onPageLoad = onPageLoad;
  voc.validate_before_submit = VOC.fn.validateBeforeSubmit;

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
