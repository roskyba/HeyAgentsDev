  <div class="container">
    <h2 id="proplabel" class="mb-4 text-center {% unless include.header %}sr-only{% endunless %}">{{ include.header | default: "How you benefit"}}</h2>
    <div class="row text-justify">
      {% for prop in page['value propositions'] %}
      <div class="col-12 col-md-4 my-2">
        <div class="w-25 d-inline-block my-4"><img src="{{prop.image.file}}" alt="{{prop.image.alt}}" class="prop-image"></div>
        <h4 class="mb-3">{{prop.header}}</h4>
        <p class='text-left'>{{prop.text | markdownify}}</p>
      </div>
      {% endfor %}
    </div>
  </div>
