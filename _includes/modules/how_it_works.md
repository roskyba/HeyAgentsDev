<section class="bg-white">
  <div class="container">
    <h2>{{page.intro.header}}</h2>
    <div class="row">
      <div class="col-12 col-lg-6">
        <p class="mt-2">{{page.intro.text | markdownify}}</p>
      </div>
    </div>
    {% include modules/how_it_works_step_bar.md %}
  </div>
  <div class="step-bar-border hidden-xs-down"></div>
    <div class="container">
      <div class="row">
      {% for step in page['detailed steps'] %}
        <div id="step_{{forloop.index}}">
          {% include modules/split_5_7.md step=step index=forloop.index %}
        </div>
      {% endfor %}
      </div>
  </div>
</section>
