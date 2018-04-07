  <header>
  {% case page.url %}
  {% when "/how-it-works/" or "/terms-and-conditions/agents/" or "/terms-and-conditions/" %}
    <nav class="row navbar navbar-how-it-works navbar-toggleable-md navbar-light {% if include.min == true %} min {% endif %}">
  {% when "/about/" %}
    <nav class="row navbar navbar-cus navbar-toggleable-md navbar-light {% if include.min == true %} min {% endif %}">
  {% when "/contact/" %}
    <nav class="row navbar navbar-cus navbar-toggleable-md navbar-light {% if include.min == true %} min {% endif %}">
  {% when "/how-it-works/agents/" %}
    <nav class="row navbar navbar-how-it-works navbar-cus navbar-toggleable-md navbar-light {% if include.min == true %} min {% endif %}">
  {% when "/signup/agents/" %}
    <nav class="row navbar navbar-signup signup-agents navbar-toggleable-md navbar-light {% if include.min == true %} min {% endif %}">
  {% when "/for-agents/" %}
    <nav class="row navbar navbar-toggleable-md navbar-light {% if include.min == true %} min {% endif %}">
  {% when "/signup/" %}
    <nav class="row navbar navbar-signup navbar-signup-sellers navbar-toggleable-md navbar-light {% if include.min == true %} min {% endif %}">
        <img src='/assets/img/matthew-gregory-profile-picture.png' class="rounded-circle top-image wider-img">
  {% else %}
    <nav class="row navbar navbar-toggleable-md navbar-light {% if include.min == true %} min {% endif %}">
{% endcase %}
      <div class="col-xs-3 header-branding">
        <img src="/assets/img/logo.png" alt="Hey Agents logo" height="40" class="logo" onclick='document.location.href="/"'>
      </div>
      {% if include.min == false %}
      <div class="col-xs-9 header-navigation">
        <ul class='main-menu'>
          <li><a href='/'>For sellers</a></li>
          <li><a href='/for-agents/'>For agents</a></li>
          <li><a href='/about/'>About us</a></li>
          <li><a href='/how-it-works/'>How it works</a></li>  
          <li><a href='/review/'>Review an agent</a></li>
          <li style="position:relative"><button class="primary-header-cta" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Get started</button>
              <div class="mt-4 dropdown-menu dropdown-menu-right">
                <a class="dropdown-item" href="/signup/">I'm a seller</a>
                <a class="dropdown-item" href="/signup/agents">I'm an agent</a>
              </div>
          </li>
          <li><a href="http://app.heyagents.com.au/access/login" class="secondary-header-cta">Login</a></li>
        </ul>
      </div>
      <div class="responsive-nav-btn"></div>
      <div class="responsive-close-nav-btn"></div>
      {% endif %}
    </nav>
  </header>
