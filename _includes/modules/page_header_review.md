<div class="text-center page-header-review">
  <div class="container">
    <div class="row">
      <div class="col-12 col-sm-10 offset-sm-1 col-lg-6 offset-lg-3">
        <h1>{{page.hero.header | default: include.header}}</h1>
        {% if page.hero.text %}
          <p class="mt-4 mb-0">{{page.hero.text | markdownify}}</p>
        {% endif %}
        {% if page.hero.cta %}
          <a class="btn btn-lg btn-primary mt-4" href="{{page.hero['cta link']}}">{{page.hero.cta}}</a>
        {% endif %}
      </div>
    </div>
  </div>
</div>
