/* Initializing functions */
// Set-up step by step form
initStepForm("agentreview", 4);
// Set max date to current month
$("[name='sold_date']").attr("max", new Date().toISOString().substr(0, 7));

// Add typeahead to agent_name field
var agents = new Bloodhound({
  datumTokenizer: function (datum) {
    return Bloodhound.tokenizers.whitespace(datum.name);
  },
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  remote: {
    wildcard: '%QUERY',
    url: 'https://api-dev.heyagents.com.au/v2/agents?agent_name=%QUERY',
    rateLimitBy: 'debounce',
    rateLimitWait: 500,
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
        if (data.photo) {
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
    $(".review-agent-header").addClass("hidden");
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
  $(".replace-agent-name").each(function () {
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
    return '<span class="thumbnail mr-2">' + agentName.slice(0, 1) + '</span>' + agentName + '&emsp;<small class="text-muted push-down">' + agency + '</span>'
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

function cancelAgent() {
  $("#cancel-agent").click(function (event) {
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
  pairs.forEach(function (pair) {
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
    success: function () {
      $("#review-confirmed-header").fadeIn(500);
      $(".confirmed").fadeIn(500);
      $(".review-body-section").hide();
    },
    error: function (response) {
      $("#review-confirmed-header").fadeIn(500);
      $(".confirmed").fadeIn(500);
      console.log(response);
      // var message = 'Oh no – we weren\'t able to submit your review. Please try again soon, or email us at <a href="mailto:support@heyagents.com.au">support@heyagents.com.au</a>';
      // $("body").append('<div class="alert alert-danger alert-dismissible signup-alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + message + '</div>');
    }
  });
}

var average;

$(".rating_input").change(function () {
  var total = 0.0; var count = 0;
  $(".rating_input:checked").each(function () {
    total += parseFloat($(this).val());
    count++;
  });
  average = (total / count).toFixed(2);
  $(".rating-replace").html(average);
  $(".overall-rating-top").animate({ width: average / 5 * 100 + "%" }, 200);
});

function preventDefaultSocialButtons() {
  $("#fb-login-button").click(function (event) {
    event.preventDefault();
  });
  $("#google-login-button").click(function (event) {
    event.preventDefault();
  });
  $("#linkedin-login-button").click(function (event) {
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
$("#google-login-button").click(function () {
  $('.review-agent-header, .review-body-section').hide();
  webAuth.authorize({
    connection: 'google-oauth2'
  });
});
// Trigger login with facebook
$("#fb-login-button").click(function () {
  $('.review-agent-header, .review-body-section').hide();
  webAuth.authorize({
    connection: 'facebook'
  });
});
// Trigger login with linkedin
$("#linkedin-login-button").click(function (e) {
  $('.review-agent-header, .review-body-section').hide();
  webAuth.authorize({
    connection: 'linkedin'
  });
});

function handleAuthentication() {
  // Parse the URL and extract the access_token
  webAuth.parseHash(window.location.hash, function (err, authResult) {
    if (err) {
      return console.log(err);
    }
    webAuth.client.userInfo(authResult.accessToken, function (err, user) {
      $("input[name=reviewerFirstName]").val(user.given_name);
      $("input[name=reviewerLastName]").val(user.family_name);
      $("input[name=reviewerEmail]").val(user.email);
      $("#agentreview4 input[type=submit]").removeAttr("disabled");
      $("#agentreview4 input[type=submit]").click();
      window.location.hash = "";
    });
  });
}

function reviewChosenAgent(slug) {
  // $("#review-page-header").fadeIn(0, function () {
  //   $("div[data-step=1]").fadeIn(0);
  // });
  loadAgent(slug).then(
    //Agent exists
    function (res) {
      $(".agent-name").addClass("hidden");
      $("#review-h").addClass("hidden");
      $("#review-h2").removeClass("hidden");
      updateAgentHTML(res.userinfo.firstname, res.userinfo.lastname, res.userinfo.profilephoto, res.userinfo.company, res.userinfo.domainAgentId)
      cancelAgent();
      preventDefaultSocialButtons();
      $("#agentreview1 input[type=submit]").prop("disabled", true);
    },
    //Agent doesn't exist
    function (e) {
      console.log("this agent doesn't exist")
    });
}

function parseUrl(url) {
  var queryString = url.substring(url.indexOf('=') + 1);
  return queryString = queryString.substring(0, queryString.length - 2).replace("-", "+");
}

window.addEventListener("load", function () {
  var parsedAgentName,
      agent;
  if (window.location.search) {
    $('[name=agent_name]').addClass('hidden');
    $.ajax({
      method: 'get',
      url: "https://api-dev.heyagents.com.au/v2/agents?agent_name=" + parseUrl(window.location.search),
      success: function (res) {
        agent = res.data[0];
        $("#review-h").addClass("hidden");
        $(".agent-card").removeClass("hidden").addClass('d-flex').html(createAgentCard(agent.thumbnail, agent.name, agent.agencyName));
        $("[name='agent_name']").val(agent.name);
        $("[name='domainAgentId']").val(agent.agentId);
        $(".agent-name, .btn-cancel-agent").addClass("hidden");
        preventDefaultSocialButtons();
      },
      error: function (e) {
        $("body").append('<div class="alert alert-danger alert-dismissible signup-alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Oh no – we were unable to process your registration. Please try again soon, or email us at <a href="mailto:support@heyagents.com.au">support@heyagents.com.au</a>.</div>');
      }
    });
    $('#agentreview1 input[type=submit]').click(function () {
      setTimeout(function () {
        $("#review-agent-header").html(createAgentHeader(agent.thumbnail, agent.name, agent.agencyName));
      }, 500);
    });
  } else {
    $('.agent-name').removeClass('hidden');
  }
});

$(document).ready(function () {
  var isMobile = false,
      footer = $('.review-footer');
      stepsSection = $('.steps-section');
      console.log(stepsSection.offset().top);
      console.log(stepsSection.height());
  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
      || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
      isMobile = true;
      footer.addClass('mobile-popup');
  }
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > stepsSection.offset().top) {
      footer.addClass('fixed-footer');
    } else {
      footer.removeClass('fixed-footer');
    }
  })
  if (window.location.hash == "") {
    $("#review-page-header").show();
      $("div[data-step=1]").show();
  } else if (window.location.hash.startsWith("#access")) {
    handleAuthentication()
  } else {
    reviewChosenAgent(window.location.hash.substring(1));
  }
  $('[name=address]').keyup(function () {
    $('#street_number').val("");
    $('#agentreview1 input[type=submit]').prop('disabled', true);
  });
  $('#agentreview1 input[type=submit]').click(function () {
    $('.main-menu, .responsive-nav-btn').hide()
  })
  $('[name=address], [name=agent_name]').on("change paste keyup", function () {
    if ($('[name=address]').val() != '' && $('[name=agent_name]') != '' ) {
      $("#agentreview1 input[disabled]").removeAttr("disabled");
    }
  });
  // window.addEventListener('scroll', fixedItem);
});