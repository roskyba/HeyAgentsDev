initStepForm("agentsignup", 3);
google.load('visualization', '1', {
  'packages': ['corechart', 'table', 'geomap']
});

// Add typeahead to agent_name field
var agents = new Bloodhound({
  datumTokenizer: function (datum) {
    return Bloodhound.tokenizers.whitespace(datum.name);
  },
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  remote: {
    wildcard: '%QUERY',
    url: 'https://api-dev.heyagents.com.au/v2/agents?agent_name=%QUERY',
    filter: function (data) {
      return $.map(data.data, function (agent, i) {
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
      minLength: 3,
      valueKey: 'name',
    },
    {
      name: 'agents',
      source: agents,  
      templates: {
        suggestion: function (data) {
          if (data.photo) {
            $('.twitter-typeahead input').css('background', 'none');
            return '<div class="tt-suggestion tt-selectable"><img src="' + data.photo + '" class="thumbnail mr-2">' + data.name + '&emsp;<small class="push-down">' + data.agency + '</span></div>';
          } else {
            return '<div class="tt-suggestion tt-selectable"><span class="thumbnail mr-2">' + data.name.slice(0, 1) + '</span>' + data.name + '&emsp;<small class="push-down">' + data.agency + '</span></div>';
          }
        }
      }
    }).bind('typeahead:render', function (ev, suggestion) {
      $(".add-value").html($(this).val());
      $(".add-option").click(function () {
        $(this).blur();
      });
    }).bind('typeahead:select', function (ev, suggestion) {
      $(".agent-name").addClass("hidden");
      $("#agentreview1 input[disabled]").removeAttr("disabled");
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
    $("[name='domainAgentId']").val(id);
    $("[name='license']").val(id);
    $("[name='company']").val(agency);
  }
  $(".replace-agent-name").each(function () {
    if ($(this).hasClass("possessive")) {
      $(this).html(firstname + "'s");
    } else {
      $(this).html(firstname);
    }
  });
  $("#agentsignup1 input[disabled]").removeAttr("disabled");
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
    event.preventDefault();
    $("#agentsignup1 input[type='submit']").prop("disabled", true);
    $("[name='agent_name']").val("");
    $("[name='domainAgentId']").val("");
    $("[name='license']").val("");
    $("[name='company']").val("");
    $(".agent-name").removeClass("hidden");
    $(".agent-card").removeClass("d-flex");
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
  $('#suburbs').tagsinput({
    maxTags: 5,
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
  $('#suburbs').on('itemAdded', function (event) {
    $('.homepage-hero .tt-input').val($('.homepage-hero .badge').text());
    $('.homepage-hero .badge').hide();
    $("input[name=postcodes]").val($("input[name=postcodes]").val() + event.item["POA_CODE_2016"] + ",");
  });
  $('#suburbs').on('itemRemoved', function (event) {
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
  $('#suburbs').tagsinput({
    maxTags: 5,
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
$("#suburbs").change(function () {
  codes = "";
  if (useSuburbs) {
    var suburbs = $("#suburbs").val().split(",");
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
    var pcarray = $("#suburbs").tagsinput("items");
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
$('#password-agent, #confirm-password-agent').on('keyup', function () {
  if ($('#password-agent').val() == $('#confirm-password-agent').val()) {
    $('#message').html('');
    if ($("#agree")[0].checked) {
      $("#agentsignup3 input[type='submit']").prop("disabled", false);
    }
  } else if ($('#password-agent').val().length > 0 && $('#confirm-password-agent').val().length > 0) {
    $('#message').html('Password does not match the confirm password').css('color', 'red');
    $("#agentsignup3 input[type='submit']").prop("disabled", true);
  }
});
function convertData(data) {
  for (key in data) {
    if (key === "agent_name") {
      var agentData = data[key];
      var separatedResult = agentData.split(" ");
      for (i = 0; i < separatedResult.length; i++) {
        if (i == 0) {
          data.firstName = separatedResult[i];
        }
        else {
          data.lastName = separatedResult[i];
        }
      }
      delete data.agent_name;
    } else if (key === "postcodes") {
      var postcodesArr = data[key].split(",");
      postcodesArr.pop();
      data.postcodes = postcodesArr;
    }
    if (key === "suburbs") {
      var suburbsArr = data[key].split(",");
      data.suburbs = suburbsArr;
    }
  }
  return data;
}

$('#agentsignup1 [type=submit]').click(function () {
  $('.signup-agents a').hide();
})

function registerAgent(data) {
  var jsondata = serializedToJSON(data);
  convertData(jsondata);
  $.ajax({
    method: 'post',
    url: "https://api-dev.heyagents.com.au/v2/agents",
    data: $.param(jsondata),
    success: function () {
      $("#progress").width("100%").attr("aria-valuenow", 100);
      $(".signupagent").fadeOut(500, function () {
        $(".confirmed").css("display", "flex").hide().fadeIn(500);
      });
      window.Intercom("update", {
        suburbs: jsondata.suburbs
      });
      window.Intercom("trackEvent", "registered");
    },
    error: function () {
      $("body").append('<div class="alert alert-danger alert-dismissible signup-alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Oh no – we were unable to process your registration. Please try again soon, or email us at <a href="mailto:support@heyagents.com.au">support@heyagents.com.au</a>.</div>');
    }
  });


  function serializedToJSON(data) {
    var pairs = data.split('&');
    var result = {};
    pairs.forEach(function (pair) {
      pair = pair.split('=');
      result[pair[0]] = decodeURIComponent(pair[1] || '');
    });
    return JSON.parse(JSON.stringify(result));
  }
}

$("#agree, #password-agent, #confirm-password-agent").change(function () {
  var agree = $("#agree")[0].checked;
  var pass = $("#password-agent").val();
  var confirmPass = $("#confirm-password-agent").val();

  if (agree && pass == confirmPass) {
    $("#agentsignup3 input[type='submit']").prop("disabled", false);
  } else {
    $("#agentsignup3 input[type='submit']").prop("disabled", true);
  }
});