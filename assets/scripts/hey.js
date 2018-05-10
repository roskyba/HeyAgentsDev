$( window ).resize(function() {
    mobileSwap();
});

window.addEventListener("load", function() {
  $(".homepage-hero input[type=text]").focus();
});

mobileSwap();


var useSuburbs = true;
var suburb;
var codes = ""; 
var layer, layerb;
if (useSuburbs) {
  var suburbs = new Bloodhound({
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.SSC_NAME_2016);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: {
      url: '/assets/json/suburbs.json'
    }
  });
  $('.homepage-hero .suburbs').on('beforeItemAdd', function(event) {
    event.cancel = true;
  });
  $('.suburbs').on('itemAdded', function (event) {
    $('.homepage-hero .tt-input').val($('.homepage-hero .badge').text());
    $('.homepage-hero .badge').hide();
    $("input[name=postcodes]").val($("input[name=postcodes]").val() + event.item["POA_CODE_2016"] + ",");
  });
} else {
  var postcodes = new Bloodhound({
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: {
      url: '/assets/json/postcodes.json'
    }
  });
  $('.suburbs').tagsinput({
    maxTags: 1,
    typeaheadjs: [{
      hint: true
    },
    {
      name: 'suburbs',
      displayKey: 'name',
      valueKey: 'postcode',
      source: postcodes
    }]
  });
}
var fusionId, fusionIds, fusionQuery;

function queryFT(codes, fusionId) {
  var queryText = encodeURIComponent("SELECT 'geometry' FROM " + fusionId + " WHERE '" + fusionQuery + "' IN (" + codes + ")");
  var query = new google.visualization.Query('https://www.google.com/fusiontables/gvizdata?tq=' + queryText);
  query.send(function (response) {
    if (!response) {
      alert('no response');
      return;
    } else if (response.isError()) {
      console.log('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
      return;
    } else {
      table = response.getDataTable();
      numRows = table.getNumberOfRows();
      var bounds = new google.maps.LatLngBounds();
      for (i = 0; i < numRows; i++) {
        var kml = $.parseXML(response.getDataTable().getValue(i, 0));
        var coord = kml.getElementsByTagName("coordinates")[0].childNodes[0].nodeValue.split(" ");
        for (j in coord) {
          var p = coord[j].split(",");
          var point = new google.maps.LatLng(
            parseFloat(p[1]),
            parseFloat(p[0]));
          bounds.extend(point);
        }
      }
      if (numRows > 0) {
        map.fitBounds(bounds);
        outlineSuburbs(codes, fusionId);
      }
    }
  });
}


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

var selectedSuburb;
$('.suburb-btn').on("click", function() {
  selectedSuburb = $('.homepage-hero .tt-input').val();
  localStorage.setItem('suburb', selectedSuburb);
  }
)
$('#provider-json').on("keyup", function() {
  $('.suburb-btn').prop('disabled', false);
});
$(document).ready(function() {
  var inputVal;
	var pathname = window.location.pathname;
  $('.main-menu  li > a[href="'+pathname+'"]').parent().addClass('active');
  $('.main-menu button').click(function() {
    $('.main-menu .dropdown-menu').toggleClass('expanded');
  });
  $('#sellersignup10 .twitter-typeahead input').removeClass('loader');
  $('#sellersignup10 .twitter-typeahead input').focusout(function() {
      $(this).removeClass('loader');
   });
   $('#sellersignup10 .twitter-typeahead input').on("change paste keyup", function() {
    inputVal = $('#sellersignup10 .twitter-typeahead input').val();
    if (inputVal.length >=3 ) {
       $('#sellersignup10 .twitter-typeahead input').addClass('loader');
    }
  });
  var regexRule = /^0(4)\d{8}$/
  var phoneErrorMsg = $('.phone-info');

  $('[type=tel]').on("change paste keyup", function() {
    if($(this).val().match(regexRule)) {
      phoneErrorMsg.addClass('hidden');
    } else {
      phoneErrorMsg.removeClass('hidden');
    }
  });
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
  var sydney = new google.maps.LatLng(-33.8688,151.2093),
      lat, 
      lng,
      placeSuburb;
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


          marker.setVisible(false);
          
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(16);
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
        placeSuburb = place.vicinity;
        lat = place.geometry.location.lat();
        lng = place.geometry.location.lng();
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

  var useSuburbs = true;
var codes = ""; var layer, layerb;
if (useSuburbs) {
  var suburbs = new Bloodhound({
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.SSC_NAME_2016);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: {
      url: '/assets/json/suburbs.json'
    }
  });
  $('.suburbs').tagsinput({
    maxTags: 1,
    itemValue: 'SSC_NAME_2016',
    itemText: 'SSC_NAME_2016',
    typeaheadjs: [{
      hint: true
    },
    {
      name: 'suburbs',
      displayKey: 'SSC_NAME_2016',
      source: suburbs
    }],
    freeInput: false
  });
  $('.suburbs').on('itemAdded', function (event) {
    $('.homepage-hero .tt-input').val($('.homepage-hero .badge').text());
    $('.homepage-hero .selected-tags').hide();
    $("input[name=postcodes]").val($("input[name=postcodes]").val() + event.item["POA_CODE_2016"] + ",");
  });
  $('.suburbs').on('itemRemoved', function (event) {
    $("input[name=postcodes]").val($("input[name=postcodes]").val().replace(event.item["POA_CODE_2016"] + ",", ""));
  });
} else {
  var postcodes = new Bloodhound({
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: {
      url: '/assets/json/postcodes.json'
    }
  });
  $('.suburbs').tagsinput({
    maxTags: 1,
    typeaheadjs: [{
      hint: true
    },
    {
      name: 'suburbs',
      displayKey: 'name',
      valueKey: 'postcode',
      source: postcodes
    }],
    freeInput: false
  });
}
$("#agentsignup2").find(".tt-input").on('keydown', function (event) {
  if (event.keyCode == 13 || event.keyCode == 44) {
    event.preventDefault();
    var selectables = $(this).siblings(".tt-menu").find(".tt-selectable");
    if (selectables.length > 0) {
      $(selectables[0]).trigger('click');
    }
  }
});

var fusionId, fusionIds, fusionQuery;
if (useSuburbs) {
  fusionIds = ["1dKGkM-jACPSSBAbbTirsNysgYQ558gJrp9aY1w-c", "124KUBlnpvXE2vClPnKjpKOC14qE6U8ZhFyAB1gzF"];
  fusionQuery = "SSC_NAME16";
} else {
  fusionId = '1HsbuTttcp2zhLOcTzFIe_5lJLyBlkjhEDAEEqm0';
  fusionQuery = "POSTCODE";
}
$(".suburbs").change(function () {
  codes = "";
  if (useSuburbs) {
    var suburbs = $(".suburbs").val().split(",");
    for (suburb in suburbs) {
      codes += "'" + suburbs[suburb] + "'";
      if (suburb != suburbs.length - 1) {
        codes += ","
      }
    }
    for (x in fusionIds) {
      queryFT(codes, fusionIds[x]);
    }
  } else {
    var pcarray = $(".suburbs").tagsinput("items");
    for (item in pcarray) {
      codes += pcarray[item];
      if (item != pcarray.length - 1) {
        codes += ","
      }
    }
  }
});
function queryFT(codes, fusionId) {
  var queryText = encodeURIComponent("SELECT 'geometry' FROM " + fusionId + " WHERE '" + fusionQuery + "' IN (" + codes + ")");
  var query = new google.visualization.Query('https://www.google.com/fusiontables/gvizdata?tq=' + queryText);
  query.send(function (response) {
    if (!response) {
      alert('no response');
      return;
    } else if (response.isError()) {
      console.log('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
      return;
    } else {
      table = response.getDataTable();
      numRows = table.getNumberOfRows();
      var bounds = new google.maps.LatLngBounds();
      for (i = 0; i < numRows; i++) {
        var kml = $.parseXML(response.getDataTable().getValue(i, 0));
        var coord = kml.getElementsByTagName("coordinates")[0].childNodes[0].nodeValue.split(" ");
        for (j in coord) {
          var p = coord[j].split(",");
          var point = new google.maps.LatLng(
            parseFloat(p[1]),
            parseFloat(p[0]));
          bounds.extend(point);
        }
      }
      // if (numRows > 0) {
      //   map.fitBounds(bounds);
      //   outlineSuburbs(codes, fusionId);
      // }
    }
  });
}
function outlineSuburbs(codes, fusionId) {
  var layerindex = fusionIds.indexOf(fusionId);
  if (layerindex == 0 && layer) {
    layer.setOptions({
      query: {
        select: 'geometry',
        from: fusionId
      },
      styles: [{
        polygonOptions: {
          strokeColor: "#4a4a4a",
          strokeWeight: 0,
          strokeOpacity: 0.000001,
          fillColor: "#179990",
          fillOpacity: 0.00001
        }
      }, {
        where: fusionQuery + " IN (" + codes + ")",
        polygonOptions: {
          fillColor: '#179990',
          strokeColor: '#179990',
          strokeOpacity: 1.0,
          strokeWeight: 1.0,
          fillOpacity: 0.4
        }
      }]
    });
  } else if (layerindex == 0) {
    if (layerb) {
      layerb.setMap(null);
      layerb = null;
    }
    layer = new google.maps.FusionTablesLayer({
      query: {
        select: 'geometry',
        from: fusionId
      },
      styles: [{
        polygonOptions: {
          strokeColor: "#4a4a4a",
          strokeWeight: 0,
          strokeOpacity: 0.000001,
          fillColor: "#179990",
          fillOpacity: 0.00001
        }
      }, {
        where: fusionQuery + " IN (" + codes + ")",
        polygonOptions: {
          fillColor: '#179990',
          strokeColor: '#179990',
          strokeOpacity: 1.0,
          strokeWeight: 1.0,
          fillOpacity: 0.4
        }
      }]
    });
    layer.setMap(map);
  } else if (layerindex == 1 && layerb) {
    layerb.setOptions({
      query: {
        select: 'geometry',
        from: fusionIds[1]
      },
      styles: [{
        polygonOptions: {
          strokeColor: "#4a4a4a",
          strokeWeight: 0,
          strokeOpacity: 0.000001,
          fillColor: "#179990",
          fillOpacity: 0.00001
        }
      }, {
        where: fusionQuery + " IN (" + codes + ")",
        polygonOptions: {
          fillColor: '#179990',
          strokeColor: '#179990',
          strokeOpacity: 1.0,
          strokeWeight: 1.0,
          fillOpacity: 0.4
        }
      }]
    });
  } else {
    if (layer) {
      layer.setMap(null);
      layer = null;
    }
    layerb = new google.maps.FusionTablesLayer({
      query: {
        select: 'geometry',
        from: fusionIds[1]
      },
      styles: [{
        polygonOptions: {
          strokeColor: "#4a4a4a",
          strokeWeight: 0,
          strokeOpacity: 0.000001,
          fillColor: "#179990",
          fillOpacity: 0.00001
        }
      }, {
        where: fusionQuery + " IN (" + codes + ")",
        polygonOptions: {
          fillColor: '#179990',
          strokeColor: '#179990',
          strokeOpacity: 1.0,
          strokeWeight: 1.0,
          fillOpacity: 0.4
        }
      }]
    });
    layerb.setMap(map);
  }
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
          if(($(".signupagent").length>0)&&newStep > 3){
            $(".left").addClass("hidden");
            $(".right").addClass("offset-lg-3");
          }
          
          var $parent = $(".step[data-step='" + newStep + "']");
          $parent.fadeIn(500);
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

if($(".address_autocomplete").length>0||$(".suburbs").length>0){
  /* GOOGLE MAPS REAL ESTATE AGENCY AUTOCOMPLETE */
  var map;
  var service;
  var sydney = new google.maps.LatLng(-24.8688,134.2093);

  function initializeMap(query) {
    var center;
    map = new google.maps.Map($("#map")[0], {
        zoom: 4,
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