/* Initializing functions */
// Set-up step by step form
initStepForm("agentreview", 4);
// Set max date to current month
$("[name='sold_date']").attr("max", new Date().toISOString().substr(0,7));

// Add typeahead to agent_name field
var agents = new Bloodhound({
  datumTokenizer: function (datum) {
      return Bloodhound.tokenizers.whitespace(datum.name);
  },
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  remote: {
    wildcard: '%QUERY',
    url: 'https://api.heyagents.com.au/v1/agents/search?agent_name=%QUERY',
    rateLimitBy: 'debounce',
    rateLimitWait: 500,
    filter: function (data) {
        return $.map(data.agents, function (agent) {
            return {
                name: agent.name,
                firstname: agent.name.split(" ")[0],
                lastname: agent.name.replace(agent.name.split(" ")[0]+' ', ''),
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
    suggestion: function(data) {
        if (data.photo) {
          return '<div class="tt-suggestion tt-selectable"><img src="' + data.photo + '" class="thumbnail mr-2">' + data.name + '&emsp;<small class="text-muted push-down">' +data.agency + '</span></div>';
        } else {
          return '<div class="tt-suggestion tt-selectable"><span class="thumbnail mr-2">' + data.name.slice(0,1) + '</span>' + data.name + '&emsp;<small class="text-muted push-down">' +data.agency + '</span></div>';
        }
    }
  }
}).bind('typeahead:render', function(ev, suggestion) {
  $(".add-value").html($(this).val());
  $(".add-option").click(function() {
    $(this).blur();
  });
}).bind('typeahead:select', function(ev, suggestion) {
  $(".agent-name").addClass("hidden");
  $("#review-h").addClass("hidden");
  $("#review-h2").removeClass("hidden");
  $("#agentreview1 input[disabled]").removeAttr("disabled");
  updateAgentHTML(suggestion.firstname, suggestion.lastname, suggestion.photo, suggestion.agency, suggestion.agentId);
  cancelAgent();
  preventDefaultSocialButtons();
  checkAddress("#agentreview1 input[type=submit]");
});

/**
 * Queries the API for agent profile
 * @param {string} id The agent identifier
 * @return {Object} The resolved promise
 */
function loadAgent(id) {
  return Promise.resolve($.ajax({
    method: 'get',
    url: apiurl("profile") + "&slug=" + id
  }));
}

/**
 * Updates the HTML based on the agent profile
 */
function updateAgentHTML(firstname, lastname, photo, agency, id) {
  if (id) {
    $(".agent-card").addClass("d-flex");
    $(".agent-card").html(createAgentCard(photo, firstname + " " + lastname, agency));
    $("#review-agent-header").html(createAgentHeader(photo, firstname + " " + lastname, agency));
    $("[name='agent_name']").val(firstname + " " + lastname);
    $("[name='domainAgentId']").val(id);
  }
  $(".replace-agent-name").each(function() {
    if ($(this).hasClass("possessive")) {
      $(this).html(firstname + "'s");
    } else {
      $(this).html(firstname);
    }
  });
  $("#agentreview1 input[disabled]").removeAttr("disabled");
}



/**
 * Creates an agent card with supplied data
 * @param {string} profilePhoto The profile photo url
 * @param {string} agentName
 * @param {string} agency The name of the agent's agency
 * @return {string} The html string of the created card
 */
function createAgentCard(profilePhoto, agentName, agency) {
  if (profilePhoto == '') {
    return '<span class="thumbnail mr-2">' + agentName.slice(0,1) + '</span>' + agentName + '&emsp;<small class="text-muted push-down">' + agency + '</span>'
  }
  return '<img src=' + profilePhoto + ' class="rounded-circle" style="width: 100px"><div class="ml-4 text-left"><p class="m-0">' + agentName + '</p><small>' + agency + '</small></div><button id="cancel-agent" class="btn-cancel-agent"><i class="fa fa-times fa-lg"></i></button>';
}

var agentHeader;
function createAgentHeader(profilePhoto, agentName, agency) {
  if (profilePhoto == "") {
    agentHeader = '<h1 class="px-3 px-2 mb-3 mt-5">' + agentName + '</h1><div class="my-2"></div><div class="progress-bar-new mt-2 col-xs-12 col-sm-10 offset-sm-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3"><div class="col-md-8 offset-md-2"><div class="first-bar"><small>Rate Agent</small></div><div class="second-bar"><small>Write Testimonial</small></div><div class="third-bar"><small>Submit Review</small></div></div></div>'
  } else {
    agentHeader = '<img src=' + profilePhoto + ' class="mt-5 rounded-circle" style="width: 100px"><h1 class="px-2 mb-3 mt-5">' + agentName + '</h1><div class="my-2"></div><div class="progress-bar-new mt-2 col-xs-12 col-sm-10 offset-sm-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3"><div class="col-md-8 offset-md-2"><div class="first-bar"><small>Rate Agent</small></div><div class="second-bar"><small>Write Testimonial</small></div><div class="third-bar"><small>Submit Review</small></div></div></div>';
  }
  return agentHeader;
}

function cancelAgent(){
$("#cancel-agent").click(function(event){
  event.preventDefault();
  $("#agentreview1 input[type='submit']").prop("disabled", true);
  $("#review-h").removeClass("hidden");
  $("#review-h2").addClass("hidden");
  $(".agent-name").removeClass("hidden");
  $(".agent-card").removeClass("d-flex");
  $('[name=agent_name]').val("");
  $('[name=domainAgentId]').val("");
});
}

/**
 * Gets a given URL parameter
 * @param {string} name The parameter being retrieved
 * @return {string|null} The parameter string, if it exists
 */
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function serializedToJSON(data) {
    var pairs = data.split('&');
    var result = {};
    pairs.forEach(function(pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });
    return JSON.parse(JSON.stringify(result));
}


function reviewAgent(data) {
  var json = serializedToJSON(data);
  if (localStorage.getItem("token")) {
    data += "&token=" + localStorage.getItem("token");
  }

  $.ajax({
    method: "POST",
    url: url + "reviews",
    data: json,
    success: function() {
        $("#review-confirmed-header").fadeIn(500);
        $(".confirmed").fadeIn(500);
        setReview(average);
    },
    error: function(response) {
      var message = 'Oh no – we weren\'t able to submit your review. Please try again soon, or email us at <a href="mailto:support@heyagents.com.au">support@heyagents.com.au</a>';

      if (response.responseJSON.message == "User already reviewed agent") {
        message = "It looks like you've already reviewed this agent. Thanks for your feedback!";
      }

      $("body").append('<div class="alert alert-danger alert-dismissible signup-alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + message + '</div>');
    }
  });  
}

var average;

$(".rating_input").change(function() {
  var total = 0.0; var count = 0;
  $(".rating_input:checked").each(function() {
    total += parseFloat($(this).val());
    count++;
  });
  average = (total/count).toFixed(2);
  $(".rating-replace").html(average);
  $(".overall-rating-top").animate({width: average / 5 * 100 + "%"}, 200);
});

function setReview(review) {
  if (review >= 4) {
    $(".dynamic_review").hide();
    $(".positive_review").show();
  } else if (review >= 3) {
    $(".dynamic_review").hide();
    $(".average_review").show();
  } else {
    $(".dynamic_review").hide();
    $(".negative_review").show();
  }
}

function preventDefaultSocialButtons(){
  $("#fb-login-button").click(function(event){
    event.preventDefault();
  });
  $("#google-login-button").click(function(event){
    event.preventDefault();
  });
  $("#linkedin-login-button").click(function(event){
    event.preventDefault();
  });
}
//Auth0
var webAuth = new auth0.WebAuth({
  domain: "heyagents.au.auth0.com",
  clientID: "TUfJnQUKUD4pwdiC1JOmzQv4DynA-z6d",
  redirectUri: "https://heyagents.com.au/review",
  responseType: 'token',
  scope: 'openid email profile',
});

// Trigger login with google
$("#google-login-button").click(function(){
  webAuth.authorize({
    connection: 'google-oauth2'
  });
});
// Trigger login with facebook
$("#fb-login-button").click(function(){
  webAuth.authorize({
    connection: 'facebook'
  });
});
// Trigger login with linkedin
$("#linkedin-login-button").click(function(e){
  webAuth.authorize({
    connection: 'linkedin'
  });
});

function handleAuthentication() {
  // Parse the URL and extract the access_token
  webAuth.parseHash(window.location.hash, function(err, authResult) {
    if (err) {
      return console.log(err);
    }
    webAuth.client.userInfo(authResult.accessToken, function(err, user) {
        $("input[name=firstname]").val(user.given_name);
        $("input[name=lastname]").val(user.family_name);
        $("input[name=revieweremail]").val(user.email);
        $("#agentreview4 input[type=submit]").removeAttr("disabled");
        $("#agentreview4 input[type=submit]").click();
        window.location.hash="";
    });
  });
}

function reviewChosenAgent(slug){
  $("#review-page-header").fadeIn(0, function(){
    $("div[data-step=1]").fadeIn(0);
  });
  loadAgent(slug).then(
    //Agent exists
    function(res) {
      $(".agent-name").addClass("hidden");
      $("#review-h").addClass("hidden");
      $("#review-h2").removeClass("hidden");
      updateAgentHTML(res.userinfo.firstname, res.userinfo.lastname, res.userinfo.profilephoto, res.userinfo.company, res.userinfo.domainAgentId)
      cancelAgent();
      preventDefaultSocialButtons();
      $("#agentreview1 input[type=submit]").prop("disabled", true);
    },
    //Agent doesn't exist
    function(e) {
      console.log("this agent doesn't exist")
    });
}

$(document).ready(function(){
  if (window.location.hash==""){
    $("#review-page-header").fadeIn(0, function(){
      $("div[data-step=1]").fadeIn(0);
    });
  } else if (window.location.hash.startsWith("#access")){
    handleAuthentication()
  } else {
    reviewChosenAgent(window.location.hash.substring(1));
  }
  $('[name=address]').keyup(function(){
    $('#street_number').val("");
    $('#agentreview1 input[type=submit]').prop('disabled', true);
  });
  $('#agentreview1 input').click(function() {
    $('.main-menu, .responsive-nav-btn').hide()})
});