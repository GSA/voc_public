window.VOC = window.VOC || {};
window.VOC.fn = {
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
    Array.prototype.filter.call(focusableItems, function(el) {
      return (el.offsetWidth > 0 || el.offsetHeight > 0 ||
          el.getClientRects().length > 0);
    });
  },
  check_for_unanswered_required: function(surveyContainer, page) {
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
  },
  getJSON: function(url, successHandler) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var data = JSON.parse(request.responseText);
        successHandler(data);
      } else {
        // We reached our target server, but it returned an error
      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
    };

    request.send();

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
  }

};
