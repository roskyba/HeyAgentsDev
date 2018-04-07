<div class="row pt-4 step-bar hidden-xs-down">
  <div class="offset-lg-1 col-lg-10">
    <div class="row">
      {% for step in page['quick steps'] %}
      <div class="col-sm-3 col-md-3">
        <a href="#step_{{forloop.index}}" class="smoothscroll">{{step}}</a>
      </div>
      {% endfor %}
    </div>
  </div>
</div>
