<section class="text-center page-header">
  <div class="container">
    <div class="row">
    {% case page.url %}
    {% when "/terms-and-conditions/" %}
      <div class="col-12 col-sm-10 offset-sm-1 col-lg-6 offset-lg-3 pt-5">
    {% else %}
      <div class="col-12 col-sm-10 offset-sm-1 col-lg-6 offset-lg-3">
    {% endcase %}
        <h1>{{page.hero.header | default: include.header}}</h1>
        {% if page.hero.text %}
          <p class="mt-4 mb-0">{{page.hero.text | markdownify}}</p>
        {% endif %}
        {% if page.hero.cta %}
          <a class="btn btn-primary mt-4" href="{{page.hero['cta link']}}">{{page.hero.cta}}</a>
        {% endif %}
      </div>
    </div>
  </div>
</section>
