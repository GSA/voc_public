//= require 'mobile-detect.min'

window.VOC = window.VOC || {};

window.VOC.set_next_page = function set_next_page(element, current_page, next_page) {
  var surveyContainer = VOC.fn.getParents(element, ".voc-form")[0];
  surveyContainer.querySelector("#page_" + current_page + "_next_page")
    .value = next_page;
  surveyContainer.querySelector("#page_" + next_page + "_prev_page")
    .value = current_page;
};

window.VOC.show_next_page = function(el, currentPageNumber) {
  var _surveyContainer = VOC.fn.getParents(el, ".voc-form")[0];
  var _currentPage = _surveyContainer.querySelector("#page_" + currentPageNumber);

  VOC.fn.showNextPage(_currentPage);

};

/* Shim for the matches function */
HTMLElement.prototype.matches = HTMLElement.prototype.matches ||
  HTMLElement.prototype.matchesSelector ||
  HTMLElement.prototype.webkitMatchesSelector ||
  HTMLElement.prototype.mozMatchesSelector ||
  HTMLElement.prototype.msMatchesSelector ||
  HTMLElement.prototype.oMatchesSelector;


window.VOC.fn = (function(){
  function survey_required_fields_error(surveyContainer) {
    return surveyContainer.querySelector(".required_fields_error").getAttribute("data-msg");
  }

  function set_prev_page(surveyContainer, current_page, prev_page) {
    surveyContainer.querySelector("#page_" + prev_page + "_prev_page")
      .value = current_page;
  }

  function isMobile(a) {
    var md = new MobileDetect(a);
    return md.mobile() != null;
  }

  return {
    getScript: function(url, scriptLoadHandler) {
      var script_tag = document.createElement('script');
      script_tag.setAttribute('type', 'text/javascript');
      script_tag.setAttribute('src', url);

      /* Wait for the script to load */
      //Other browsers
      if(script_tag.addEventListener) {
        script_tag.addEventListener("load", scriptLoadHandler, false);
      }
      // For Old versions of IE
      else if(script_tag.readyState) {
        script_tag.onreadystatechange = scriptLoadHandler;
      }

      // Try to find the head, otherwise default to the documentElement
      (document.getElementsByTagName("head")[0] || document.documentElement)
        .appendChild(script_tag);

    },
    validateBeforeSubmit: function(e) {
      var surveyContainer = e.target;
      var pageNumber = surveyContainer.querySelector(".current_page").id.split('_')[1];
      if (VOC.fn.check_for_unanswered_required(surveyContainer, pageNumber)) {
        alert(survey_required_fields_error(surveyContainer));
        return false;
      } else {
        return true;
      }
    },
    bindPaginationLinks: function(_surveyContainer) {
      /* Bind next page links */
      var _paginationLinks = _surveyContainer.querySelectorAll('a.surveyNav');
      for(var i=0; i < _paginationLinks.length; i++) {
        var link = _paginationLinks[i];
        VOC.fn.addEventListener(link, "click", function(e) {
          var _clickedLink = e.target;
          var _currentPage = _surveyContainer.getElementsByClassName("current_page")[0];

          if(VOC.fn.hasClass(_clickedLink.parentNode, "surveyNavNext")) {
            VOC.fn.showNextPage(_currentPage);
          } else if(VOC.fn.hasClass(_clickedLink.parentNode, "surveyNavPrev")) {
            VOC.fn.showPrevPage(_currentPage);
          }

          /* Stop the event from propagating */
          e.preventDefault();
          e.returnValue = false;
          return false;
        });
      }
    },
    showNextPage: function(_currentPage) {
      var _surveyContainer = VOC.fn.getParents(_currentPage, ".voc-form")[0];
      var _currentPageNumber = _currentPage.id.split('_')[1];
      /* Check for unanswered questions that require an answer */
      var anyUnanswered = VOC.fn.check_for_unanswered_required(_surveyContainer,
        _currentPageNumber);

      if(anyUnanswered) {
        alert(survey_required_fields_error(_surveyContainer));
      } else {
        var _nextPageNumber = _surveyContainer
          .querySelector('div.current_page input[name="next_page"]').value;
        var _nextPage = _surveyContainer.querySelector('#page_' + _nextPageNumber);

        /* Set the previous page number for flow control */
        set_prev_page(_surveyContainer, _currentPageNumber, _nextPageNumber);

        /* Hide the current page */
        VOC.fn.addClass(_currentPage, "hidden_page");
        VOC.fn.removeClass(_currentPage, "current_page");

        /* Show the next page */
        VOC.fn.addClass(_nextPage, "current_page");
        VOC.fn.removeClass(_nextPage, "hidden_page");

        /* Enable the submit button if it is on the page */
        var submitButton = _nextPage.querySelector("input[type='submit'][disabled]");
        if(submitButton) {
          submitButton.disabled = false;
        }

        /* Focus the first focusable element of the new page */
        VOC.fn.focusFirstElementIn(_nextPage);
      }
    },
    showPrevPage: function(_currentPage) {
      var _surveyContainer = VOC.fn.getParents(_currentPage, ".voc-form")[0];
      var _prevPageNumber = _surveyContainer
        .querySelector('div.current_page input[name="prev_page"]').value;
      var _prevPage = _surveyContainer.querySelector('#page_' + _prevPageNumber);

      /* Hide the current page */
      VOC.fn.addClass(_currentPage, "hidden_page");
      VOC.fn.removeClass(_currentPage, "current_page");

      /* Show the next page */
      VOC.fn.addClass(_prevPage, "current_page");
      VOC.fn.removeClass(_prevPage, "hidden_page");
      VOC.fn.focusFirstElementIn(_prevPage);
    },
    serializeForm: function(form) {
      var formData = Array.prototype.filter.call(form.elements, function(el) {
        return !(el.type in ['checkbox', 'radio'] || el.checked)
      })
      .filter(function(el) { return !!el.name; })
      .filter(function(el) { return !el.disabled; })
      .map(function(el) {
        return encodeURIComponent(el.name) + '=' + encodeURIComponent(el.value);
      }).join('&');

      return formData;
    },
    focusFirstElementIn: function(obj) {
      var focusableElementsString = "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";
      focusableItems = obj.querySelectorAll(focusableElementsString);
      focusableItems = [].filter.call(focusableItems, function(el) {
        var width = el.offsetWidth;
        var height = el.offsetHeight;

        return ((width > 0 || height > 0) ||
            (!((el.style && el.style.display) || window.getComputedStyle(el, 'display')) === "none"));
      });

      focusableItems[0].focus();
    },
    check_for_unanswered_required: function(surveyContainer, pageNumber) {
      var required = false;
      var elements = surveyContainer
        .querySelectorAll("#page_" + pageNumber +
          " input[type='hidden'].required_question");

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
    },
    get: function(url, successHandler) {
      var request = new XMLHttpRequest();
      if("withCredentials" in request) {
        request.open('GET', url, true);
      } else {
        request = new XDomainRequest();
        request.open('GET', url);
      }

      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          if(successHandler)
            successHandler(request.responseText);
        } else {
          // We reached our target server, but it returned an error
        }
      };

      request.onerror = function() {
        // There was a connection error of some sort
      };

      request.send();
    },
    getJSON: function(url, successHandler) {
      VOC.fn.get(url, function(responseText) {
       var data = JSON.parse(responseText);
       successHandler(data);
      });
    },
    getParents: function(elem, selector) {
        var parents = [];
        var firstChar;
        if (selector) {
            firstChar = selector.charAt(0);
        }

        // Get matches
        for (; elem && elem !== document; elem = elem.parentNode) {
            if (selector) {
                // If selector is a class
                if (firstChar === '.') {
                    if (elem.classList.contains(selector.substr(1))) {
                        parents.push(elem);
                    }
                }
                // If selector is an ID
                if (firstChar === '#') {
                    if (elem.id === selector.substr(1)) {
                        parents.push(elem);
                    }
                }
                // If selector is a data attribute
                if (firstChar === '[') {
                    if (elem.hasAttribute(selector.substr(1, selector.length - 1))) {
                        parents.push(elem);
                    }
                }
                // If selector is a tag
                if (elem.tagName.toLowerCase() === selector) {
                    parents.push(elem);
                }
            } else {
                parents.push(elem);
            }

        }

        // Return parents if any exist
        if (parents.length === 0) {
            return null;
        } else {
            return parents;
        }

    },
    removeClass: function(el, className) {
        if (el.classList)
            el.classList.remove(className);
        else
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    },
    addClass: function(el, className) {
      if(el.classList)
        el.classList.add(className);
      else
        el.className += " " + className;
    },
    on: function(el, selector, eventName, handler) {
      VOC.fn.addEventListener(el, eventName, function(e) {
        if(e.target.matches(selector))
          handler.call(e.target, e);
      });
    },
    addEventListener: function(el, eventName, handler) {
      if(el === undefined || el === null)
        return;
      if(el.addEventListener) {
        el.addEventListener(eventName, handler);
      } else {
        el.attachEvent('on' + eventName, function() {
          handler.call(el);
        });
      }
    },
    hasClass: function(el, className) {
      if(el.classList) {
        return el.classList.contains(className);
      } else {
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
      }
    },
    isMobile: isMobile
  };
})();
