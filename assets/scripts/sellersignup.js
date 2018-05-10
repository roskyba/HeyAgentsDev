initStepForm("sellersignup", 14);
google.load('visualization', '1', {
  'packages': ['corechart', 'table', 'geomap']
});

var briefData = {};

//Agents dropdown
var agents = new Bloodhound({
  datumTokenizer: function (datum) {
    return Bloodhound.tokenizers.whitespace(datum.name);
  },
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  remote: {
    wildcard: '%QUERY',
    url: 'https://api.heyagents.com.au/v1/agents/search?agent_name=%QUERY',
    filter: function (data) {
      return $.map(data.agents, function (agent) {
        return {
          name: agent.name,
          firstname: agent.name.split(" ")[0],
          lastname: agent.name.replace(agent.name.split(" ")[0] + ' ', ''),
          photo: agent.thumbnail,
          agentId: agent.agentId,
          agency: agent.agencyName
        };
      })
    }
  }
});

$('[name="agent_name"]').typeahead({
  hint: false,
  highlight: true,
  minLength: 3
},
  {
    name: 'agents',
    source: agents,
    displayKey: 'name',
    templates: {
      suggestion: function (data) {
        if (data.photo || checkAgentInput()) {
          return '<div class="tt-suggestion tt-selectable"><img src="' + data.photo + '" class="thumbnail mr-2">' + data.name + '&emsp;<small class="text-muted push-down">' + data.agency + '</span></div>';
        } else {
          return '<div class="tt-suggestion tt-selectable"><span class="thumbnail mr-2">' + data.name.slice(0, 1) + '</span>' + data.name + '&emsp;<small class="text-muted push-down">' + data.agency + '</span></div>';
        }
      }
    }
  }).bind('typeahead:render', function (ev, suggestion) {
    $(".add-value").html($(this).val());
    $(".add-option").click(function () {
      $(this).blur();
    });
  }).bind('typeahead:select', function (ev, suggestion) {
    $('.twitter-typeahead').hide()
    $("#sellersignup10 input[disabled]").removeAttr("disabled");
    updateAgentHTML(suggestion.firstname, suggestion.lastname, suggestion.photo, suggestion.agency, suggestion.agentId);
    cancelAgent();
  });

/**
 * Updates the HTML based on the agent profile
 */
function updateAgentHTML(firstname, lastname, photo, agency, id) {
  if (id) {
    $(".agent-card").addClass("d-flex");
    $(".agent-card").html(createAgentCard(photo, firstname + " " + lastname, agency));
    $("[name='agent_name']").val(firstname + " " + lastname);
    $("[name='domain_agent_id']").val(id);
  }
  $("#sellersignup10 input[disabled]").removeAttr("disabled");
}

/**
 * Creates an agent card with supplied data
 * @param {string} profilePhoto The profile photo url
 * @param {string} agentName
 * @param {string} agency The name of the agent's agency
 * @return {string} The html string of the created card
 */
function createAgentCard(profilePhoto, agentName, agency) {
  return '<img src=' + profilePhoto + ' class="rounded-circle" style="width: 100px"><div class="ml-4 text-left"><p class="m-0">' + agentName + '</p><small>' + agency + '</small></div><button id="cancel-agent" class="btn-cancel-agent"><i class="fa fa-times fa-lg"></i></button>';
}

function cancelAgent() {
  $("#cancel-agent").click(function (event) {
    $('.twitter-typeahead').show();
    $('.btn-agnt').prop('disabled', true);
    event.preventDefault();
    $(".agent-card").removeClass("d-flex");
    $("[name=agent_name]").val("");
    $("[name='domain_agent_id']").val("");
  });
}

//Google maps
var marker = new google.maps.Marker({
  map: map,
  anchorPoint: new google.maps.Point(0, -29)
});


//Submit brief
function waitingList() {
  briefData.email = $("[name=email]").val();
  briefData.password = $("[name=password]").val();
  briefData.firstName = $("[name=firstName]").val();
  briefData.lastName = $("[name=lastName]").val();
  briefData.phone = $("[name=phone]").val();
  console.log(briefData);
  $.ajax({
    method: 'post',
    url: url + "sellers",
    data: briefData,
    success: function () {
      $(".last-step").fadeOut(500, function () {
        $(".confirmation").fadeIn(500);
      });
    },
    error: function () {
      $("body").append('<div class="alert alert-danger alert-dismissible signup-alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Oh no – something went wrong. Please try again soon, or email us at <a href="mailto:support@heyagents.com.au">support@heyagents.com.au</a>.</div>');
    }
  });
}

//Bind button to name input of first screen
$('.signup-begin button').prop('disabled', true);
$('input[name="begin-firstname"]').keyup(function () {
  if ($(this).val() != '') {
    $('.signup-begin button').prop('disabled', false);
  } else {
    $('.signup-begin button').prop('disabled', true);
  }
});

//Go to second screen
function beginSignUp() {
  $('.top-image').show();
  $('#sellersignup1 h1').html("Hey I’m Matt, let’s get started with your property type")
  $(".signup-begin").fadeOut(500, function () {
    $(".signup").fadeIn(500);
    // google.maps.event.trigger(map, 'resize');
  });
  $('body').animate({ scrollTop: 0 }, 'slow');
  window.pageYOffset = 0;
  window.location.hash = hashes[1];
}
//Go back to first screen
function toSignupBeginning() {
  $(".signup").fadeOut(500, function () {
    $(".signup-begin").fadeIn(500);
  });
  window.location.hash = '';
  i = 0;
}

//Create brief model and go to preview brief screen
function toPreviewBrief() {
  $("#to-preview-button").click(function (e) {
    e.preventDefault();
    createBriefPreview();
    $(".step:last").fadeOut(500, function () {
      $(".preview-brief").fadeIn(500);
      // google.maps.event.trigger(map, 'resize');
    })
  })
}

function toEmailStep() {
  $('.preview-brief ').hide();
  $('.email-step-view').show();
}

//Put changed values to brief model and go to last step
function toLastStep() {
  if (madeChanges) {
    agentquestions = [];
    $("input[name=brief-agentquestions]").each(function (index) {
      agentquestions[index] = this.value;
    });

    agentexperience = [];
    $("[name=brief-agentexperience]:checked").each(function (index) {
      agentexperience[index] = this.value;
    });

    var price = parsePrice("brief-price");

    briefData.brief.city = $("#locality").val();
    briefData.brief.priceMin = price[0];
    briefData.brief.priceMax = price[1];
    briefData.brief.sizeRange = $('select[name=brief-size]')[0].selectedOptions[0].value;
    if (agentquestions.length > 0) {
      briefData.brief.questions = agentquestions;
    }
    briefData.brief.saleTimeFrame = $("select[name=brief-salestimeframe]")[0].selectedOptions[0].value;
    briefData.brief.saleMethod = $("select[name=brief-salepreference]")[0].selectedOptions[0].value;
    briefData.brief.saleReason = $("select[name=brief-salereason]")[0].selectedOptions[0].value;
    briefData.brief.requestedAgentLevels = agentexperience;

    briefData.brief.property.type = $("select[name=brief-type]")[0].selectedOptions[0].value;
    briefData.brief.property.postCode = $("#postal_code").val();
    briefData.brief.property.ownershipStyle = $("select[name=brief-ownershipstyle]")[0].selectedOptions[0].value;
    briefData.brief.property.condition = $("select[name=brief-condition]")[0].selectedOptions[0].value;
    briefData.brief.property.state = $("#administrative_area_level_1").val();
    briefData.brief.property.city = $("#locality").val();
    briefData.brief.property.street = $("#route").val();
    briefData.brief.property.geoLocation.latitude = -33.8678064;
    briefData.brief.property.geoLocation.longitude = 151.1892544;
    briefData.brief.property.address = $("#street_number").val();
    briefData.brief.property.bathrooms = $("select[name=brief-bathrooms]")[0].selectedOptions[0].value;
    briefData.brief.property.bedrooms = $("select[name=brief-bedrooms]")[0].selectedOptions[0].value;
    briefData.brief.property.parking = $("select[name=brief-parking]")[0].selectedOptions[0].value;
  }
  $(".preview-brief").fadeOut(500, function () {
    $(".last-step").fadeIn(500);
  })
  $("#replace-city").text(briefData.brief.property.city);
  $("[name=firstName]").val($('input[name="begin-firstname"]').val());
  // if ($('[name=lastname]').val() != '' && $('[name=contactnumber]').val() != '' && $('[name=email]').val() != '' && $('[name=password]').val() != '' ) {
  //   $("[name=agree]").addClass("not-checked");
  // }
  $("[name=agree]").change(function () {
    if (this.checked) {
      $("#submit-form").prop("disabled", false);
      $("[name=agree]").removeClass("not-checked");
    } else {
      $("#submit-form").prop("disabled", true);
      $("[name=agree]").addClass("not-checked");
    }
  });
}

$('[name=to-last-step]').click(function (e) {
  e.preventDefault();
  toEmailStep();
  // toLastStep();
})
//Brief model
var brief;

//Put values in brief model
function createBriefModel() {

  price = parsePrice("price");

  agentquestions = [];
  $("[name=agentquestions]").each(function (index) {
    agentquestions[index] = this.value;
  });

  agentexperience = [];
  $("[name=agentexperience]:checked").each(function (index) {
    agentexperience[index] = this.value;
  });

  //initialize brief model
  briefData = {
    type: "seller",
    brief: {
      suburb: placeSuburb,
      city: $("#locality").val(),
      priceMin: price[0],
      priceMax: price[1],
      sizeRange: 'unsure',
      questions: agentquestions,
      saleTimeFrame: $("[name=salestimeframe]:checked").val(),
      saleMethod: $("[name=salepreference]:checked").val(),
      saleReason: $("[name=salereason]:checked").val(),
      requestedAgentLevels: agentexperience,
      property: {
        postCode: $("#postal_code").val(),
        type: $("[name=type]:checked").val(),
        ownershipStyle: "family home",
        condition: $("[name=condition]:checked").val(),
        state: $("#administrative_area_level_1").val(),
        city: $("#locality").val(),
        street: $("#route").val(),
        geoLocation: {
          latitude: lat,
          longitude: lng
        },
        address: $("#street_number").val(),
        bathrooms: $("[name=bathrooms]").val(),
        bedrooms: $("[name=bedrooms]").val(),
        parking: $("[name=parking]").val(),
      }
    }
  }
  if ($("[name=agent_name]").val() != "") {
    briefData.brief.requestedAgent = {
      domainAgentId: $("[name=domain_agent_id]").val()
    }
  }
}

//Convert price from range to priceMin and priceMax
function parsePrice(name) {
  if (name == "price") {
    var price = $("[name=" + name + "]").val();
  } else {
    var price = $("select[name=" + name + "]")[0].selectedOptions[0].value;
  }

  result = [];
  var pricemin, pricemax;
  if (price == "lt250") {
    result.push("null");
    result.push("250000");
  } else if (price == "mt2000") {
    result.push("2000000");
    result.push("null");
  } else {
    var priceArray = price.split("-");
    result.push((+priceArray[0] * 1000).toString());
    result.push((+priceArray[1] * 1000).toString());
  }
  return result;
}

var sizeValues = [];

//Put labels from steps to brief table
function createBriefPreview() {
  createBriefModel()
  if ($('.badge').text() == '') {
    $("#brief-1").text(sbr);
  } else {
    $("#brief-1").text($('.signup-begin .tt-input').val());
  }
  getResult("#brief-2", "type", "radio")
  $("#brief-3").html(
    "<span><img src='/assets/images/signup/bed-preview.png' style='max-width:40px'> " + $("[name=label-bedrooms]").text() +
    "</span> <span><img src='/assets/images/signup/bath-preview.png' style='max-width:40px' class='ml-2'> " + $("[name=label-bathrooms]").text() +
    "</span> <span><img src='/assets/images/signup/car-preview.png' style='max-width:40px' class='ml-2'> " + $("[name=label-parking]").text() + "</span>"
  );
  getResult("#brief-4", "ownershipstyle", "radio");
  sizeValues = ['Unsure', '0-75', '75-100', '100-1500', '150+'];
  $("#brief-5").html(sizeValues[0]);
  getResult("#brief-6", "condition", "radio");
  $("#brief-7").text($("[name=label-price]").text());
  getResult("#brief-8", "salestimeframe", "radio");
  getResult("#brief-9", "salepreference", "radio");
  getResult("#brief-10", "agentexperience", "checkbox");
  getResult("#brief-11", "salereason", "radio");
  outputQuestions();
}

//Get labels of selected options and put it in the table(for createBriefPreview)
function getResult(place, name, type) {

  if (type == "radio") {
    $("[name=" + name + "]").each(function (index) {
      if ($(this).is(':checked')) {
        $(place).html($("label[for=" + name + "]")[index].innerHTML);
      }
    });
  }

  if (type == "checkbox") {
    var values = "";
    $("[name=" + name + "]").each(function (index) {
      if ($(this).is(':checked')) {
        values += $("label[for=" + name + "]")[index].innerHTML + ", ";
      }
    });
    $(place).html(values.slice(0, values.length - 2))
  }

}

//Get values from inputs and put it in the table(for createBriefPreview)
function outputQuestions() {
  questionsArray = $("[name=agentquestions]");
  questionsHTML = "";

  for (var i = 0; i < questionsArray.length; i++) {
    questionsHTML += "<p>" + questionsArray[i].value + "</p>"
  }

  $("#brief-questions").html(questionsHTML);
}

var sizeOption = '';

//Put inputs with values in table
function makeChanges() {  
  $('.preview-suburb').addClass('hidden');
  $('.edit-suburb').removeClass('hidden');
  madeChanges = true;
  $('[name=make-changes-button]').prop("disabled", true);
  $("#brief-1").html(createBriefInputs("address"));
  $("#brief-2").html(createDropdown("type", "radio"));
  $("#brief-3").html(
    "<span><img src='/assets/images/signup/bed-preview.png' style='max-width:40px'> " + createDropdown("bedrooms", "select") +
    "</span> <span><img src='/assets/images/signup/bath-preview.png' style='max-width:40px' class='ml-2'> " + createDropdown("bathrooms", "select") +
    "</span> <span><img src='/assets/images/signup/car-preview.png' style='max-width:40px' class='ml-2'> " + createDropdown("parking", "select") + "</span>"
  );
  $("#brief-4").html(createDropdown("ownershipstyle", "radio"));
  $("#brief-5").html(createDropdown("size", "radio"));
  sizeValues.forEach(item => {
    sizeOption += "<option value='" + item + "'>" + item + "</option>";
  })
  $('[name=brief-size]').html(sizeOption);
  $("#brief-6").html(createDropdown("condition", "radio"));
  $("#brief-7").html(createDropdown("price", "select"));
  $("#brief-8").html(createDropdown("salestimeframe", "radio"));
  $("#brief-9").html(createDropdown("salepreference", "radio"));
  $("#brief-10").html(createCheckboxes("agentexperience"));
  $("#brief-11").html(createDropdown("salereason", "radio"));
  $("#brief-questions").html(createBriefInputs("agentquestions"));
  $("[name=brief-agentexperience]").change(function () {
    $("[name=to-last-step]").prop("disabled", !($("[name=brief-agentexperience]:checked").length && ($('#street_number').val() != '')));
  })
  $(".address-wrap").html("");
  makeAutocomplete();
  $('[name=brief-address]').keyup(function () {
    $('#street_number').val("");
    $('[name=to-last-step]').prop('disabled', true);
  });
}

//Make changes flag
var madeChanges = false;

//Bind make changes button
$('[name=make-changes-button]').click(function (e) {
  e.preventDefault();
  makeChanges();
})

//Get data from radios/select and return new dropdown for table (for makeChanges)
function createDropdown(name, type) {

  var style = "";

  if (name == "bedrooms" || name == "bathrooms" || name == "parking") {
    style = "style='display:inline-block;width:inherit'";
  }

  var dropdown = "<select name=brief-" + name + " class='form-control' " + style + ">";

  if (type == "radio") {
    $("[name=" + name + "]").each(function (index) {
      var selected = ""
      if (this.checked) {
        selected = "selected";
      }
      dropdown += "<option value='" + this.value + "' " + selected + ">" + $("label[for=" + name + "]")[index].innerHTML + "</option>"
    })
  }

  if (type == "select") {
    $("[name=select-" + name + "] li").each(function () {
      var selectedOption = $("[name=" + name + "]").val();
      var selected = "";
      if (this.dataset.value === selectedOption) {
        selected = "selected";
      }
      dropdown += "<option value='" + this.dataset.value + "' " + selected + ">" + this.innerText + "</option>"
    })
  }
  
  dropdown += "</select>"
  return dropdown;
}

//Get data from checkboxes and return new checkboxes for brief table (for makeChanges)
function createCheckboxes(name) {
  var checkboxes = "";
  $("[name=" + name + "]").each(function (index) {
    var checked = "";
    if (this.checked) {
      checked = "checked";
    }
    checkboxes += "<span class='mr-3'><input type=checkbox name=brief-" + name + " value='" + this.value + "' " + checked + "> " + $("label[for=" + name + "]")[index].innerHTML + "</span>"
  })
  return checkboxes;
}

//Get data from inputs and return new inputs for brief table (for makeChanges)
function createBriefInputs(name) {
  $('.edit-suburb .tt-input').val('');
  var notification = "";
  var inputClasss = "";
  var inputName = "";
  if (name == "address") {
    inputName = `name='suburbs'`
    inputClasss = "suburbs";
    notification = "<p class='notification' style='color:#F00'></p> ";

  } else {
    inputName = "name='brief-";
  }
  var inputs = "";
  questionsArray = $("[name=" + name + "]");
  questionsArray.each(function () {
    inputs += "<input type=text " + inputName + "'" + name + " value='" + this.value + "' name='" + inputName + "' class='form-control my-2 " + inputClasss + "'>" + notification;
  });
  return inputs;
}

// $('#sellersignup1 input[type=submit]').prop('disabled', true);

//Bind Next button to inputs on current steps
function buttonActivation(step) {

  if ($('#sellersignup' + step + ' input[type=radio]').length) {
    if (!$('#sellersignup' + step + ' input[type=radio]').is(':checked')) {
      $('#sellersignup' + step + ' input[type=submit]').prop('disabled', true);
    }
    $('#sellersignup' + step + ' input[type=radio]').change(function () {
      $('#sellersignup' + step + ' input[type=submit]').prop('disabled', !$(this).is(':checked'));
    });
  }

  if ($('#sellersignup' + step + ' input[type=checkbox]').length) {
    if (!$('#sellersignup' + step + ' input[type=checkbox]:checked').length) {
      $('#sellersignup' + step + ' input[type=submit]').prop('disabled', true);
    }
    $('#sellersignup' + step + ' input[type=checkbox]').change(function () {
      $('#sellersignup' + step + ' input[type=submit]').prop('disabled', !$('#sellersignup' + step + ' input[type=checkbox]:checked').length);
    });
  }

  if ($('#sellersignup' + step + ' .dropdown-container').length) {
    $('#sellersignup' + step + ' input[type=submit]').prop('disabled', true);
    $('#sellersignup' + step + ' .dropdown-container input[type=hidden]').change();
    $('#sellersignup' + step + ' .dropdown-container input[type=hidden]').change(function () {
      $('#sellersignup' + step + ' input[type=submit]').prop('disabled', false);
      $('#sellersignup' + step + ' .dropdown-container input[type=hidden]').each(function () {
        if (this.value == "") {
          $('#sellersignup' + step + ' input[type=submit]').prop('disabled', true);
        }
      })
    });
  }
}

//Change values of size inputs dependent on chosen option on property type screen
function changeSize() {
  var propertyType = $('#sellersignup1 input[type=radio]:checked').val();
  $('#sellersignup1 input[type=submit').removeAttr('disabled');
  var apartmentSizeLabels = ["Less than 75m<sup>2</sup>", "75-100m<sup>2</sup>", "100-150m<sup>2</sup>", "More than 150m<sup>2</sup>"];
  var apartmentSizeValues = ["0-75", "75-100", "100-150", "150+"];
  var houseSizeLabels = ["Less than 150m<sup>2</sup>", "150-250m<sup>2</sup>", "250-500m<sup>2</sup>", "More than 500m<sup>2</sup>"];
  var houseSizeValues = ["0-150", "150-250", "250-500", "500+"];
  var landSizeLabels = ["Less than 400m<sup>2</sup>", "400-1000m<sup>2</sup>", "1000-1500m<sup>2</sup>", "More than 1500m<sup>2</sup>"];
  var landSizeValues = ["0-400", "400-1000", "1000-1500", "1500+"];

  $('#sellersignup5 h1').text("What’s your opinion of the value?");

  if (propertyType == "apartment") {
    $('#sellersignup5 input[type=radio]').each(function (index) {
      $("label[for=size]")[index].innerHTML = apartmentSizeLabels[index]
      $(this).val(apartmentSizeValues[index]);
    });
  }

  if (propertyType == "house") {
    $('#sellersignup5 input[type=radio]').each(function (index) {
      $("label[for=size]")[index].innerHTML = houseSizeLabels[index]
      $(this).val(houseSizeValues[index]);
    });
  }

  if (propertyType == "land") {
    $('#sellersignup5 input[type=radio]').each(function (index) {
      $("label[for=size]")[index].innerHTML = landSizeLabels[index]
      $(this).val(landSizeValues[index]);
    });
  }
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
  $('.sellerSuburbs').tagsinput({
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
  $('.sellerSuburbs').on('itemAdded', function (event) {
    $('.tt-input').val($('.signup .badge').text());
    $('.signup-begin .badge, .signup .badge').html();
    $('.preview-brief .tt-input').val($('.signup .badge').text());
    $('.signup .badge').text('');
    $('.badge').hide();
    $('.badge').html()
    $("input[name=postcodes]").val($("input[name=postcodes]").val() + event.item["POA_CODE_2016"] + ",");
  });
  $('.sellerSuburbs').on('itemRemoved', function (event) {
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
  $('.sellerSuburbs').tagsinput({
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
$("#edit-suburb").change(function () {
  codes = "";
  if (useSuburbs) {
    var suburbs = $("#edit-suburb").val()
    for (x in fusionIds) {
      queryFT("'" + suburbs + "'", fusionIds[x]);
    }
  } 
});

//Checks input after click on all area of div
$('.seller-signup-card').click(function () {
  var val = $(this).find('input:checkbox').prop('checked') ? false : true;
  if ($(this).find('input:radio').length) {
    $(".seller-signup-card").removeClass('border-on');
  }
  $(this).addClass('border-on');
  $(this).find('input:radio').prop('checked', true).change();
  $(this).find('input:checkbox').prop('checked', val).change();
  if (!val) {
    $(this).removeClass('border-on');
  }
  return;
});

var questionsSuggest = [
  "How long have you been a real estate agent?",
  "What makes you different to the other real estate agents?",
  "Do you think now is a good time to sell?",
  "How long do you expect my property will be on the market?",
  "If my property doesn’t sell, will I incur any charges?",
  "Do you have a personal support team? If so, what are their roles?",
  "Will you attend every open for inspection held at my property?",
  "What made you choose the company you work for?",
  "Why did you choose to work as a real estate agent?",
  "Can you help me buy before or after I sell my property?",
  "What challenging part of your job are you most experienced in?"
]

var backupQuestions = [];

function createQuestions() {
  var questionsHTML = "";
  for (var question of questionsSuggest) {
    questionsHTML += "<div class='force-overflow dropdown-item question-item' href=#>" + question + "</div>"
  }
  $('.question-menu').html(questionsHTML);

  //bind button to questions
  $('.question-item').click(function (e) {

    e.preventDefault;
    if (inputs.length < 5) {
      addSuggestedQuestion(this.innerHTML);
    }
    createInputs();
    $(".input-group").click();
    return false;
  });

}
var inputs = [];

function addQuestion(questionText) {
  if (questionText != '') {
    inputs.push(questionText);
  }
  $("[name=question-input]").val("");
  checkInput();
}

function addSuggestedQuestion(questionText) {
  inputs.push(questionText);
  backupQuestions.push(questionText);
  index = questionsSuggest.indexOf(questionText);
  questionsSuggest.splice(index, 1);
}

function deleteQuestion(index) {
  var question = inputs[index];
  var questionIndex = backupQuestions.indexOf(question);
  var questionIndexInRealArray = questionsSuggest.indexOf(question);
  if (questionIndex > (-1) && questionIndexInRealArray == (-1)) {
    questionsSuggest.splice(0, 0, question)
    backupQuestions.splice(questionIndex, 1);
  }
  inputs.splice(index, 1);
  createInputs();
  $('[name=agentquestions]').each(function () {
    $("#to-preview-button").prop("disabled", this.value == "");
  })
}

function checkAgentInput(){
  if ($('input[name=agent_name').val()!= '') {
    return true;
  } else {
    return false;
  }
}

function checkInput() {
  var inputValue = $("[name=question-input]").val();
}

var editedQuestion = "";

function createInputs() {
  var inputsHTML = "";
  $('.scrollbar').hide()
  if (inputs.length) {
    for (var i = 0; i < inputs.length; i++) {
      inputsHTML += "<div style='position:relative'><input name='agentquestions' class='form-control mb-2' type=text value='" + inputs[i] + "'/><button name='cancel-question' class='btn-cancel-question'><i class='fa fa-times fa-lg'></i></button></div>"
    }
  }
  $('.questions-group').html(inputsHTML);

  $('[name=cancel-question]').click(function () {
    var index = $('[name=cancel-question]').index(this);
    deleteQuestion(index);
  });

  if (inputs.length > 4) {
    $(".input-group").addClass("hidden");
  } else {
    $(".input-group").removeClass("hidden");
    createQuestions();
  }
  $('[name=agentquestions]').focus(function () {
    editedQuestion = this.value;
  });
  $('[name=agentquestions]').change(function () {
    if (editedQuestion != this.value && backupQuestions.indexOf(editedQuestion) > (-1)) {
      questionsSuggest.splice(0, 0, editedQuestion)
      backupQuestions.splice(backupQuestions.indexOf(editedQuestion), 1);
      createQuestions();
    }
    if (editedQuestion != this.value) {
      var inputIndex = inputs.indexOf(editedQuestion);
      inputs.splice(inputIndex, 1)
      inputs.splice(inputIndex, 0, this.value)
    }
    $("#to-preview-button").prop("disabled", false);
    $('[name=agentquestions]').each(function () {
      if (this.value == "") {
        $("#to-preview-button").prop("disabled", true);
      }
    })
  });
  if ($('[name=agentquestions]').length) {
    $("#to-preview-button").prop("disabled", false);
  } else {
    $("#to-preview-button").prop("disabled", true);
  }
}

//Page offseting
$('#to-preview-button, input[type=submit], [name=to-last-step]').click(function() {
	$('html,body').animate({ scrollTop: 0 }, 'slow')
})

//Check password strength

function testPasswordStrength(value) {
  var strongRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"
  );
  if (strongRegex.test(value)) {
    return "Strong";
  } else {
    return "Weak";
  }
}

//Custom dropdowns
$(".dropdown-container").click(function () {

  var thisDropdown = $(this);
  var openedDropdown = $(".dropdown-container.opened");

  //close previous dropdown
  if (!thisDropdown.hasClass("opened")) {
    openedDropdown.find("p").toggleClass("active");
    openedDropdown.find(".custom-dropdown").toggleClass("hidden");
    openedDropdown.removeClass("opened");
  }
  //open current dropdown
  thisDropdown.toggleClass("opened");
  thisDropdown.find("p").toggleClass("active");
  thisDropdown.find(".custom-dropdown").toggleClass("hidden");
});

//close dropdown when unfocused
$(".dropdown-container").blur(function () {
  var openedDropdown = $(".dropdown-container.opened");

  openedDropdown.find("p").toggleClass("active");
  openedDropdown.find(".custom-dropdown").toggleClass("hidden");
  openedDropdown.removeClass("opened");
});

//assign new value after choosing option
$(".custom-dropdown-option").click(function () {
  var optionLabel = $(this).html();
  var optionValue = this.dataset.value;

  var sellerCardBlock = $(this).parent().parent();
  sellerCardBlock.find("span").html(optionLabel);
  sellerCardBlock.find("input[type=hidden]").val(optionValue).change();
});

$('.question-dropdown').prop('disabled',true);

//Adding hash to url for enabling browsers 'back' button

var hashes = ['', 'prop', 'acco', 'desc', 'cond', 'val', 'per', 'reas', 'meth', 'agntype', 'agntname', 'ques', 'prev', 'email', 'subm', 'finish'];

var i = 1;

function enableSubmit() {
  $('input[name=agree]').addClass('not-checked').prop('disabled', false);
  $('.password-info').hide();
  
}


function disableSubmit() {
  $('input[name=agree]').removeClass('not-checked').prop('disabled', true);
}

setInterval(function () {
  (testPasswordStrength($('[name=password]').val()) == 'Strong' &&
    $('input[name=firstName]').val() != '' &&
    $('input[name=lastName]').val() != '' &&
    $('input[name=phone]').val() != '' &&
    $('input[name=password]').val() != '' ) ?
    enableSubmit() :
    disableSubmit()
}, 100);

function addHashToUrl() {
  if (i == 14) {
    $('div[data-step="13"').css('display', 'none');
  }
  $(`.step`).css('display', 'none');
  window.location.hash = hashes[i+1];
  i++;
}

$('[type=email]').on("change paste keyup", function() {
  $('#sellersignup12 .btn').removeAttr('disabled');
});

function suburbSelectedProccess () {
  i+1;
  $('.navbar>img').removeClass('wider-img').addClass('signup-image');
  $('.signup-begin, .notify-text').hide();
  $(`.signup`).removeClass('hidden');
  $(`div[data-step=1]`).css('display', 'block');
  $(`.top-image`).show();
  $('.table-start > td:first-child').html('Suburb');
}

function checkHash() {
  if (window.location.hash == '#prop') {
    suburbSelectedProccess();
  } else {
    $(`.signup-begin`).show();
  }
}

window.addEventListener('load', checkHash);

  window.onhashchange = function () {
    if ($('#sellersignup1 input[type=radio]:checked').val() == 'land') {
      i + 1;
      window.location.hash = hashes[i + 3];
      $(`div[data-step=3]`).css('display', 'none');
      $(`div[data-step=4]`).css('display', 'none');
      $(`div[data-step=5]`).css('display', 'none');
    }
      $('.navbar>img').removeClass('wider-img').addClass('signup-image');
    if (window.location.hash == '#prop') {
      $(`.step`).removeAttr("style").hide();
      $('.confirmation').css('display', 'none');
      $(`div[data-step=1]`).css('display', 'block');
      $(`div[data-step=2]`).css('display', 'none');
    } else if (window.location.hash == '#acco') {
      $(`.step`).removeAttr("style").hide();
      $('.confirmation').css('display', 'none');
      $(`div[data-step=1]`).css('display', 'none');
      $(`div[data-step=2]`).css('display', 'block');
    } else if (window.location.hash == '#desc') {
      $(`.step`).removeAttr("style").hide();
      $('.confirmation').css('display', 'none');
      $(`div[data-step=2]`).css('display', 'none');
      $(`div[data-step=3]`).css('display', 'block');
    } else if (window.location.hash == '#cond') {
      $(`.step`).removeAttr("style").hide();
      $('.confirmation').css('display', 'none');
      $(`div[data-step=3]`).css('display', 'none');
      $(`div[data-step=4]`).css('display', 'block');
    } else if (window.location.hash == '#val') {
      $(`.step`).removeAttr("style").hide();
      $('.confirmation').css('display', 'none');
      $(`div[data-step=4]`).css('display', 'none');
      $(`div[data-step=5]`).css('display', 'block');
    } else if (window.location.hash == '#per') {
      $(`.step`).css('display', 'none');
      $('.confirmation').css('display', 'none');
      $(`div[data-step=5]`).css('display', 'none');
      $(`div[data-step=6]`).css('display', 'block');
    } else if (window.location.hash == '#reas') {
      $(`.step`).css('display', 'none');
      $('.confirmation').css('display', 'none');
      $(`div[data-step=6]`).css('display', 'none');
      $(`div[data-step=7]`).css('display', 'block');
    } else if (window.location.hash == '#meth') {
      $(`.step`).css('display', 'none');
      $('.confirmation').css('display', 'none');
      $(`div[data-step=7]`).css('display', 'none');
      $(`div[data-step=8]`).css('display', 'block');
    } else if (window.location.hash == '#agntype') {
      $(`.step`).css('display', 'none');
      $('.confirmation').css('display', 'none');
      $(`div[data-step=8]`).css('display', 'none');
      $(`div[data-step=9]`).css('display', 'block');
    } else if (window.location.hash == '#agntname') {
      $(`.step`).css('display', 'none');
      $('.confirmation').css('display', 'none');
      $(`div[data-step=9]`).css('display', 'none');
      $(`div[data-step=10]`).css('display', 'block');
    } else if (window.location.hash == '#ques') {
      $(`.step`).css('display', 'none');
      $('.confirmation').css('display', 'none');
      $(`div[data-step=10]`).css('display', 'none');
      $(`div[data-step=11]`).css('display', 'block');
    } else if (window.location.hash == '#prev') {
      $(`.step`).css('display', 'none');
      $('.confirmation').css('display', 'none');
      $(`div[data-step=11]`).css('display', 'none');
    } else if (window.location.hash == '') {
      $(`.step`).css('display', 'none');
      $('.confirmation').css('display', 'none');
      $(`.signup`).css('display', 'none');
      $(`.signup-begin`).css('display', 'block');
    } else if (window.location.hash == '#email') {

      $(`#sellersignup12 .col-xl-8, #sellersignup12 .col-12`).css('display', 'none');
    }
    if (window.location.hash == '#ques') {
      $('.preview-brief').css('display', 'none')
    }
    if (window.location.hash == '#prev') {
      $('.preview-brief').css('display', 'block');
      $('.last-step').css('display', 'none');
      $('.confirmation').css('display', 'none');
    }
  }
function removeHashFromUrl() {
  $('.form-group>.back').prop('disabled', true);
  setTimeout(function () {
    $('.form-group>.back').prop('disabled', false);
  }, 600);
  i--;
  window.location.hash = hashes[i];
}
$(`.step`).removeAttr("style");
$('input[name=to-last-step]').click(function () {
  window.location.hash = hashes[i];
})
if (window.location.hash == '#' || window.location.hash == '') {
  $('.navbar>img').removeClass('signup-image');
}
$('.form-group>.back').click(removeHashFromUrl);
$('input[type=submit]').click(addHashToUrl);
$('.btn-skip').click(addHashToUrl);

var sbr = localStorage.getItem('suburb')
$(document).ready(function () {
  $('.signup-begin input').bind('keypress', function(e) {
    if(e.keyCode==13){
		  beginSignUp();
    }
  });
  $('.btn-question').click(function() {
    $('.scrollbar').show()
  })

  toPreviewBrief();
  $('#sellersignup1 input[type=radio]').change(function () {
    changeSize();
  });
  //questions
  createQuestions()
  $("[name=question-input]").keyup(function () {
    checkInput();
  });
  $("[name=add-question-button]").click(function () {
    var inputValue = $("[name=question-input-add]").val();
    if (inputs.length < 5) {
      addQuestion(inputValue);
    }
    createInputs();
    $("[name=question-input-add]").val('');
  });
  $("#to-preview-button").prop("disabled", true);
  $(".add-question-input").keyup(function () {
    var content = $(".add-question-input").val();
    var words = content.split(/\s+/);
    var num_words = words.length;
    var max_limit = 200;
    if (num_words > max_limit) {
      return false;
    } else {
      $('.words-left').text(max_limit + 1 - num_words + " Words");
    }
  });
  $('[name=password]').focusin(function () {
    var val = $(this).val(),
      pass = testPasswordStrength(val);
    $('.password-info').show();
  });
  var passRes = '';
  $('[name=password]').focusout(function () {
    var val = $(this).val(),
      pass = testPasswordStrength(val);
    $('.password-info').hide();
  });
  if (passRes == 'Strong') {
    $('.password-info').hide();
  }
  $('.to-finish').click(function() {
    $('#replace-suburb').text($('.signup-begin .tt-input').val());
    $('.email-step-view').css('display','none');
    $('.last-step').css('display','block');
  })
});

function initializeMap() {
    var suburb = $("#suburbs").val();
    suburb = suburb ? suburb : localStorage.getItem('suburb');
    for (x in fusionIds) {
      queryFT("'" + suburb + "'", fusionIds[x]);
    }
}

var fusionId, fusionIds, fusionQuery;
  fusionIds = ["1dKGkM-jACPSSBAbbTirsNysgYQ558gJrp9aY1w-c", "124KUBlnpvXE2vClPnKjpKOC14qE6U8ZhFyAB1gzF"];
  fusionQuery = "SSC_NAME16";

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
google.maps.event.addListener(map, 'bounds_changed', function () {
  google.maps.event.trigger(map, 'resize');
});