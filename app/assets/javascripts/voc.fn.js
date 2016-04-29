window.VOC = window.VOC || {};

window.VOC.set_next_page = function set_next_page(element, current_page, next_page) {
  var surveyContainer = VOC.fn.getParents(element, ".voc-form")[0];
  surveyContainer.querySelector("#page_" + current_page + "_next_page")
    .value = next_page;
  surveyContainer.querySelector("#page_" + next_page + "_prev_page")
    .value = current_page;
};

window.VOC.show_next_page = function(el, currentPageNumber) {
  var _surveyContainer = VOC.fn.getParents(".voc-form")[0];
  var _currentPage = _surveyContainer.querySelector("page_" + currentPageNumber);

  VOC.fn.showNextPage(_currentPage);

};

window.VOC.fn = (function(){
  function survey_required_fields_error(surveyContainer) {
    return surveyContainer.querySelector(".required_fields_error").getAttribute("data-msg");
  }

  function set_prev_page(surveyContainer, current_page, prev_page) {
    surveyContainer.querySelector("#page_" + prev_page + "_prev_page")
      .value = current_page;
  }

  function isMobile(a) {
    return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
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
