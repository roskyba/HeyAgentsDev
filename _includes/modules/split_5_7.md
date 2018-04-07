<div class="row">
  {% assign mod = include.index | modulo: 2 %}
  {% assign index = include.index | minus: 1 %}
  <div class="col-12 offset-lg-1 col-lg-4 how-to-work-img {% if mod == 0 %} push-lg-6 {% endif %}">
    <img class="img-fluid mx-auto" src="{{step.image.file}}" alt="{{step.image.alt}}">
  </div>
  <div class="col-12 offset-lg-1 col-lg-5 d-flex {% if mod == 0 %} pull-lg-5 {% endif %}">
    <div class="align-self-center step-post px-3">
      <h3>{{step.header}}</h3>
      <p>{{step.text | markdownify}}</p>
      {% if step.faqs %}
        {% include modules/faqs_accordion.md faqs=step.faqs closed=true %}
      {% endif %}
    </div>
  </div>
</div>
