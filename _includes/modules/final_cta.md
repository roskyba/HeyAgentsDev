
<section class="final-cta">
  <div class="container">
    <div class="row">
      <div class="col-lg-5">
        <h2>Get started</h2>
        {% if include.type == "agent" %}
        <p class="mt-4 mb-3">It only takes a few minutes to set up your profile.</p>
        </div>
          <div class="col-lg-3 offset-lg-2">
            <a class="btn btn-lg btn-primary" href="/signup/agents">Create Your Profile</a>
          </div>
          <div class="col-lg-2">
            <a class="btn btn-lg btn-secondary" href="/how-it-works/agents">Learn More</a>
          </div>
        {% endif %}
        {% if include.type=="seller" %}
        <p class="mt-4 mb-3">It only takes a few minutes to create your brief.</p>
        </div>
          <div class="col-lg-3 offset-lg-2">
            <a class="btn btn-lg btn-primary" href="/signup/">Post Your Brief</a>
          </div>
          <div class="col-lg-2">
            <a class="btn btn-lg btn-secondary" href="/how-it-works/">Learn More</a>
          </div>
        {% endif %}
        {% if include.type=="both" %}
          <p class="mt-4 mb-3">It only takes a few minutes to register.</p>
        </div>
          <div class="col-lg-3 offset-lg-2">
            <a class="btn btn-lg btn-primary" href="/signup/sellers">Post Your Property Brief</a>
          </div>
          <div class="col-lg-2">
            <a class="btn btn-lg btn-secondary" href="/signup/agents">Create your agent profile</a>
          </div>
        {%endif%}
    </div>
  </div>
</section>
