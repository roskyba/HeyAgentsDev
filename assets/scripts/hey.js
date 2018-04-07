$( window ).resize(function() {
    mobileSwap();
});

window.onload = function() {
  $(".homepage-hero input[type=text]").focus();
};

mobileSwap();

function mobileSwap(){
    if($('.hero').length){
        var bg = $('.hero').css('background-image');
        bg = bg.replace('url(','').replace(')','').replace(/\"/gi, "").replace('-mob','');
        if ($(window).width() < 768) {
            var res = bg.replace(/(.jpg)/g, '-mob.jpg');
        } else {
            var res = bg.replace(/(-mob.jpg)/g, '.jpg');
        }
        $('.hero').css('background-image', "url(" + res + ")");
    }
}

iphoneSticky();

function iphoneSticky(){
    if ($(window).width() > 768) {
        var controller = new ScrollMagic.Controller();

        var scene = new ScrollMagic.Scene({triggerElement: "#pin1", duration: 750, offset: 400})
                        .setPin("#pin1")
                        .addTo(controller);
    }
}

$('.step-bar a').click(activateSubHeading);

$(document).ready(function() {
	var pathname = window.location.pathname;
  $('.main-menu  li > a[href="'+pathname+'"]').parent().addClass('active');
})

//initialize tooltips
$('[data-toggle="tooltip"]').tooltip();
$('[data-toggle="popover"]').popover()

if ($("#contact").length) {
  $("#contact").validate({
    onkeyup: false,
    submitHandler: function(form) {
      var data = $(form).serialize();
      $.ajax({
        method: "POST",
        url: "https://hooks.zapier.com/hooks/catch/1271112/5b60s6/",
        data: data,
        success: function() {
          $("body").append('<div class="alert alert-success alert-dismissible"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Your message has been successfully sent. We\'ll be in touch.</div>');
          $('#contact')[0].reset();
        },
        error: function() {
          $("body").append('<div class="alert alert-danger alert-dismissible"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>We were unable to send your message. Please try again soon, or email us at <a href="mailto:support@heyagents.com.au">support@heyagents.com.au</a>.</div>');
        }
      });
    },
    errorClass: "has-warning",
    validClass: "has-success",
    highlight: function(element) {
       $(element).parent().addClass("has-warning");
   },
   unhighlight: function(element) {
      $(element).parent().removeClass("has-warning");
    }
  });
}

var suggestions; var typeahead;
function mapcallback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    suggestions = [];
    $.each(results, function() {
      suggestions.push(this);
    });
    typeahead.source = suggestions;
  }
}

  if ($("#agency_name").length) {
    typeahead = $('#agency_name').typeahead({
      hint: false,
      highlight: true,
      minLength: 1
    },
    {
      name: 'agencies',
      displayKey: 'name',
      source: function(query, process) {
        initializeMap(query);
        return process(suggestions);
      }
    });
    $('#agency_name').bind('typeahead:render', function(ev, suggestion) {
      $(".tt-dataset-agencies").append('<div class="tt-suggestion google-icon"><img style="height: 14px" src="/assets/images/google.png"></div>');
    });
    if ($("#agency_name").data("place")) {
      $('#agency_name').bind('typeahead:select', function(ev, suggestion) {
        $(".agency_name_update").html($(this).val());
        service.getDetails({
            placeId: suggestion.place_id
          }, function(place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              $("[name='office_address']").val(place.formatted_address);
            }
          });
      });
    }
  }

  if ($("#agency_portal_consent").length) {
    $("#agency_portal_consent").validate({
      onkeyup: false,
      rules: {
        contact_phone: {
          phone: true
        }
      },
      errorPlacement: function(error, element) {
        if (element.attr("type") == "checkbox") {
          error.insertAfter($(element).parent(".form-check-label"));
        } else {
          error.insertAfter(element);
        }
      },
      submitHandler: function(form) {
        var data = $(form).serialize();
        $.ajax({
          method: "POST",
          url: "https://hooks.zapier.com/hooks/catch/1271112/5hirqq/",
          data: data,
          success: function() {
            $("body").append('<div class="alert alert-success alert-dismissible"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Thanks! We\'ve received your request and will be in touch soon.</div>');
            $('#agency_portal_consent')[0].reset();
          },
          error: function() {
            $("body").append('<div class="alert alert-danger alert-dismissible"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>We were unable to submit your request. Please try again soon, or email us at <a href="mailto:support@heyagents.com.au">support@heyagents.com.au</a>.</div>');
          }
        });
      },
      errorClass: "has-warning",
      validClass: "has-success",
      highlight: function(element) {
         $(element).parent().addClass("has-warning");
     },
     unhighlight: function(element) {
        $(element).parent().removeClass("has-warning");
      }
    });
  }

  if ($("#portal_uploader").length) {
    var portals = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      prefetch: {
        url: '/assets/json/portals.json'
      }
    });

    $('#portal_uploader').typeahead({
      hint: false,
      highlight: true,
      minLength: 0
    },
    {
      name: 'agencies',
      source: portals
    });
  }
  var sydney = new google.maps.LatLng(-33.8688,151.2093);
  if ($(".address_autocomplete").length) {
    var input;
    var options = {
      center: sydney,
      location: sydney,
      componentRestrictions: {country: 'au'},
      type: ['address'],
      rankBy: google.maps.places.RankBy.DISTANCE
    };
    var autocomplete;
    makeAutocomplete()
  }

  function makeAutocomplete(){
    input = $(".address_autocomplete")[0];
    autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.addListener('place_changed', fillInAddress);
  }

  //Check address and show notification if invalid
  function checkAddress(inputName){
    if($('#street_number').val()!= ''){
      $(".notification").html("");
      $(inputName).prop('disabled', false);
      $("")
    } else {
      $(".notification").html("Please enter your full address, including your house number. This information won’t be shared with agents")
      $(inputName).prop('disabled', true);
    }
  }

  function fillInAddress() {
        // Get the place details from the autocomplete object.
        var place = autocomplete.getPlace();

        var componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        postal_code: 'short_name'
      };
      
      $('#street_number').val("");
        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
        for (var i = 0; i < place.address_components.length; i++) {
          var addressType = place.address_components[i].types[0];
          if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            if ($("#" + addressType)) {
              $("#" + addressType).val(val);
            }
          }
        }
        if($("#agentreview1 input[type=submit]").length){
          checkAddress("#agentreview1 input[type=submit]");
          if($('[name=domainAgentId]').val()==''){
            $("#agentreview1 input[type=submit]").prop("disabled", true);
          }
        }    
        if($(".signup").length){
          if($("[name=to-last-step]").length){
            checkAddress("[name=to-last-step]"); 
            $("[name=brief-agentexperience]").change();
          }
          if($("#sellersignup1 input[type=submit]").length){
            checkAddress("#sellersignup1 input[type=submit]");  
          } 

          marker.setVisible(false);

          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
          }
          marker.setIcon(/** @type {google.maps.Icon} */({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
          }));
          marker.setPosition(place.geometry.location);
          marker.setVisible(false);
        }
      }

// Step by step modular functions
function initStepForm(id, steps) {
  // if session has saved an exited form, restore values and return to that step
  if (sessionStorage.getItem(id + "step")) {
    for (var i = 0; i < sessionStorage.length; i++){
      var key = sessionStorage.key(i);
      if (key && $('[name="' + key + '"]').length) {
        if($('[name="' + key + '"]')[0].type == "radio") {
          $('[name="' + key + '"][value="' + sessionStorage.getItem(key) + '"]').prop("checked", true);
        } else if (key == "postcode" && $("#agentsignup2").length){
            //do nothing
        } else {
            $('[name="' + key + '"]').val(sessionStorage.getItem(key));
        }
      }
    }
    //setStep(sessionStorage.getItem(id + "step"));
  }

  // configure validator for each step
  for (var step = 1; step <= steps; step++) {
    initializeValidator(step);
  }

  function initializeValidator(step) {
    $("#" + id + step).validate({
      onkeyup: false,
      rules: {
        contactnumber: {
          phone: true
        }
      },
      errorPlacement: function(error, element) {
        if (element.attr("type") == "checkbox") {
          error.insertAfter($(element).parent(".form-check-label"));
        } else {
          error.insertAfter(element);
        }
      },
      submitHandler: function(form) {
        /* stores the submitted values in session storage in case form is
        accidentally exited */
        $(form).find("input, textarea").each(function() {
          $input = $(this)[0];
          if ($input.type != "submit") {
            if ($input.type == "radio" && $input.checked == false) {
              /* do nothing*/
            } else {
              sessionStorage.setItem($input.name, $input.value);
            }
          }
        });
        setStep(step + 1);
      }
    });
  }


  /* takes in the step that the form should update to and sets visibility
  accordingly */
  function setStep(newStep) {
      if (newStep <= steps) {
        //for review an agent
        if($("#review-page-header").length){
          $("#review-page-header").fadeOut(500, function() {
          $("#review-agent-header").fadeIn(500, function(){
            if(newStep==2){
              $(".first-bar").addClass("active");
            }
            if(newStep==3){
              $(".second-bar").addClass("active");
            }
            if(newStep==4){
              $(".third-bar").addClass("active");
            }
          });
        });
      }
      var oldStep;
      if (newStep === 1){
        oldStep = $(".step[data-step='" + (newStep) + "']")
      } else {
        oldStep = $(".step[data-step='" + (newStep-1) + "']")
      }
      oldStep.fadeOut(500, function() {
          scroll(0,0);
          //for agent signup
          if(($(".signupagent").length>0)&&newStep===3){
            $(".left").addClass("hidden");
            $(".right").addClass("offset-lg-3");
          }
          
          var $parent = $(".step[data-step='" + newStep + "']");
          $parent.fadeIn(500, function(){
            if($("#suburbs").length>0){
              map.setCenter(sydney);
            }
          });
          var progress = $parent.data("progress");
          $("#progress").width(progress + "%").attr("aria-valuenow", progress);

          //* if google maps */
          if ($("#map").length){
            setTimeout(function() {
              google.maps.event.trigger(map, 'resize');
            }, 300);
          }
          if($(".signup").length){
            buttonActivation(newStep);
          }
      });
    } else {
      var allFormData;
      for (var step = 1; step <= steps; step++) {
         allFormData = concatenateData(allFormData, $("#" + id + step));
      }
      eval($("#" + id + steps).data("submitfunction")+"(allFormData)");
    }
  }

  /* stores values as they change in session storage in case form is
  accidentally exited */
  $("input, textarea").change(function() {
    $input = $(this)[0];
    if ($input.type != "submit") {
      sessionStorage.setItem($input.name, $input.value);
    }
  });

  /* adds functionality to back buttons */
  $(".back").click(function() {
    backStep($(this).data("backstep"));
    return false;
  });

  function backStep(prevStep){
    $(".step[data-step='" + (prevStep+1) + "']").fadeOut(500, function() {
      //for agent signup
      if(($(".signupagent").length>0)&&prevStep===2){
        $(".left").removeClass("hidden");
        $(".right").removeClass("offset-lg-3");
      }
      setStep(prevStep);
    });
  }
}
if($(".address_autocomplete").length>0||$("#suburbs").length>0){
  /* GOOGLE MAPS REAL ESTATE AGENCY AUTOCOMPLETE */
  var map;
  var service;
    var sydney = new google.maps.LatLng(-24.8688,134.2093);

  function initializeMap(query) {
    var center, zoom;
    if ($(window).width() < 500) {
      zoom = 4;
    } else if ($(window).width() < 992) {
      zoom = 4;
    } else {
      zoom = 5;
    }
    map = new google.maps.Map($("#map")[0], {
        zoom: zoom,
        center: sydney,
        disableDefaultUI: true,
        zoomControl: false,
        scaleControl: false
    });
    if (query) {
        var request = {
          location: sydney,
          radius: '10000',
          type: ['real_estate_agency'],
          name: query
        };
        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, mapcallback);
      }

      map.setCenter(sydney);
  }

  if ($("#map").length) {
    initializeMap();
  }
}

function activateSubHeading() {
  $('.step-bar a').removeClass('active');
  $(this).addClass('active');
}

//Helper functions
function concatenateData(data, form) {
  var newData = $(form).serialize();
  if (data == undefined) {
    return newData;
  }
  return data + "&" + newData;
}

const url = "https://api-dev.heyagents.com.au/v2/";

/**
 * Builds the API call url
 * @param {string} endpoint The endpoint being called
 * @return {string} The url with token
 */
function apiurl(endpoint) {
  var token = localStorage.getItem("token");
  return url + endpoint + "?token=" + token;
}

if($("[name=contactnumber]").length>0){
  $.validator.addMethod("phone", function(value, element) {
    var val = value.replace(/\D/g,'');
    var tendigits = /^0[0-8]\d{8}$/g;
    var eldigits = /^[0-8]\d{11}$/g;
    var ninedigits = /^[0-8]\d{8}$/g;
    var codeArea =  /^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(\|-){0,1}[0-9]{2}(\|-){0,1}[0-9]{2}(\|-){0,1}[0-9]{1}(\|-){0,1}[0-9]{3}$/;
    var valid = false;
    if (tendigits.test(val) || ninedigits.test(val) || codeArea.test(val) || eldigits.test(val)) {
      valid = true;
    }
    return valid;
  }, "Please enter a valid Australian phone number.");
}

  var accordionHeader = $('.accordion__header'),
  accordionContent = $('.accordion__content'),
  accordionIcon = $('.accordion__header span');

  $(accordionHeader).click(function () {
    if ($(this).hasClass('is-active')){
      $(this).next(accordionContent).slideUp('slow');
      $(this).removeClass('is-active');
    } else {
      $(accordionHeader).not(this).next(accordionContent).slideUp('slow');
      $(accordionHeader).not(this).removeClass('is-active');
      $(this).next(accordionContent).slideDown('slow');
      $(this).addClass('is-active');
    }
  });