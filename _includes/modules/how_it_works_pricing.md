<section id="pricing">
  <div class="container">
    <div class="row">
      <div class="col-12 col-lg-5">
        <h2 class="mb-4">{{page['pricing section'].header}}</h2>
        {{page['pricing section'].text | markdownify }}
      </div>
      <div class="col-12 offset-lg-1 col-lg-6 d-flex">
        <div class="card comparison-card align-self-center w-100">
          <div class="card-header py-0">
            <div class="row">
              <div class="col-6 text-center border-right py-3">
                <h5 class="my-1">Hey Agents</h5>
              </div>
              <div class="col-6 text-center py-3">
                <h5 class="my-1"><span class="sr-only">vs</span> Competitors</h5>
              </div>
            </div>
          </div>
          <div class="card-block py-0">
          {% for comp in page['pricing section'].comparisons %}
            <div class="row">
              <div class="col-6 py-2 border-right">
              <i class="fa fa-check text-success mr-1 hidden-xs-down" aria-hidden="true"></i>
 {{comp.heyagents}}
              </div>
              <div class="col-6 py-2">
                <span class="sr-only">vs</span> {{comp.competitors}}
              </div>
            </div>
          {% endfor %}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
