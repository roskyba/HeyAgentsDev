<section class='added_section dotted-bg'>
  <div class="container">
    <div class="row px-4">
      <div class="col-12 col-lg-6 py-5 px-5 added_section_content">
        <h2>{{page.sections[2].header}}</h2>
        <p class="text-left">{{page.sections[2].text | markdownify}}</p>
        <p class="my-5 text-left">{{page.sections[2].caption | markdownify}}</p>
        <div class="d-flex mt-4 mb-5 banner-search">
          <input type="text" placeholder="Your postcode">
          <a class="btn btn-lg btn-primary" href="{{page.hero['cta link']}}">{{page.hero.cta}}</a>
        </div>
      </div>
      <div class="col-12 col-lg-6 pt-5">
        <div class='added_section_picture'>
          <img class="img-fluid bleed large-mobile-image" src="{{page.sections[2]['image'].file}}" alt="{{page.sections[1]['image'].alt}}"/>
        </div>
      </div>
    </div>
  </div>
</section>