{% include modules/page_header.md header="Contact us"%}
<div class="bg-faded bg-tabs">
  <div class="container">
    <ul class="nav nav-tabs row pt-3" role="navigation">
      <li class="nav-item col-md-3 text-center">
        <a class="nav-link {% if page.permalink == '/contact/' %} active {% endif %}" href="/contact">General</a>
      </li>
      <li class="nav-item col-md-3 text-center">
        <a class="nav-link {% if page.permalink contains 'careers' %} active {% endif %}" href="/contact/careers">Careers</a>
      </li>
      <li class="nav-item col-md-3 text-center">
        <a class="nav-link {% if page.permalink contains 'investors' %} active {% endif %}" href="/contact/investors">Investors</a>
      </li>
      <li class="nav-item col-md-3 text-center">
        <a class="nav-link {% if page.permalink contains 'media' %} active {% endif %}" href="/contact/media">Media</a>
      </li>
    </ul>
  </div>
</div>
