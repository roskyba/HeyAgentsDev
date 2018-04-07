{% include modules/page_header.md header="Terms and Conditions"%}
<div class="bg-faded bg-tabs">
  <div class="container">
    <ul class="nav nav-tabs row pt-3" role="navigation">
      <li class="nav-item col-6 text-center">
        <a class="nav-link {% if include.active == 'all' %} active {% endif %}" href="/terms-and-conditions">For everyone</a>
      </li>
      <li class="nav-item col-6 text-center">
        <a class="nav-link {% if include.active == 'agents' %} active {% endif %}" href="/terms-and-conditions/agents">For agents<span class="hidden-sm-down"> and agencies</span></a>
      </li>
    </ul>
  </div>
</div>
