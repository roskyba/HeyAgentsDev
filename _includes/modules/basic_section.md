<section class="bg-white">
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 offset-md-1 col-md-5 p-0 my-2 {% if page.sections[include.section]['content on left?']%} {% endif %} ">
        <img class="img-fluid bleed large-mobile-image" src="{{page.sections[include.section].image.file}}" alt="{{page.sections[include.section].image.alt}}">  
      </div>
      <div class="col-12 col-md-5 d-flex my-2 {% if page.sections[include.section]['content on left?']%} {% endif %}">
        <div class='align-self-center text-justify'>
          <h2>{{page.sections[include.section].header}}</h2>
          <p class="my-4">{{page.sections[include.section].text | markdownify}}</p>
          <a class="btn btn-outline-primary" href="{{page.sections[include.section]['cta link']}}">{{page.sections[include.section].cta}}</a>
          {% if page.url != '/for-agents/'%}
            <a class="btn btn-outline-primary" href="{{page.hero['cta link']}}">{{page.hero.cta}}</a>  
          {% endif %} 
        </div>
      </div>
    </div>
    {% if page.url != '/for-agents/' %}
      <div class='row mb-5 basic-section-navigation'>
        <div class='horizontal'>    
        </div>
        <div class='col-md single-item-nav'>
          <span>1</span>
          <p>Post your brief</p>
        </div>
        <div class='col-md single-item-nav'>
          <span>2</span>
          <p>Receive proposals</p></div>
        <div class='col-md single-item-nav'>
          <span>3</span>
          <p>Shortlist and chat</p></div>
        <div class='col-md single-item-nav'>
          <span>4</span>
          <p>Schedule interview</p></div>
        <div class='col-md single-item-nav'>
          <span>5</span>
          <p>Sell your Places</p></div>
      </div>
      {% endif %}
  </div>
</section>
