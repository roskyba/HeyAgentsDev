---
title: Hey Agents | How it works for agents
date: 2017-06-28 01:29:00 Z
permalink: "/how-it-works/agents/"
meta title: Hey Agents | How it works for agents
meta description: We designed Hey Agents to integrate seamlessly into your busy schedule.
  It takes just 3 minutes to respond to new client opportunities and can be done anytime,
  anywhere.
hero:
  text: 'Hey Agents data-driven transparency allows quality agents to differentiate
    their value on merit.

'
  cta: Create your free profile
  cta link: "/signup/agents"
intro:
  header: 
  text: 
quick steps:
- Create your profile
- Receive qualified briefs
- Submit proposals
- Meet face to face
detailed steps:
- header: 1. Create your profile
  text: More than just a profile, it’s your virtual portfolio. Showcase your personality,
    experience, areas of expertise and track record.
  faqs:
  - question: What will be displayed on my profile?
    answer: Your agent bio, video profile,  client reviews, current and sold listings,
      statistics, plus much more!
  - question: How long will it take to create my profile?
    answer: 'We''re all about efficiency, the process takes less than 2 minutes. '
  - question: Will I have control over my profile?
    answer: 'Yes, you''ll have the ability to edit your profile - just like your Linkedin
      profile. '
  image:
    file: "/uploads/profile.png"
    alt: create a profile with hey agents
- header: 2. Receive qualified briefs
  text: New briefs come in hourly and are visible on your dashboard instantly. We
    will notified you as soon as a new brief from one of your core-suburbs is posted.
  faqs:
  - question: What does a brief look like?
    answer: Seller briefs describes the property, timeframe in which they anticipate
      to be on the market, if they have a preferred method of sale, investment or
      owner occupied etc.
  - question: Can I respond to all seller briefs that come through the Hey Agents
      platform?
    answer: To keep our platform relevant, agents are required to chose 5 'core suburbs'
      during sign-up. You will have access to respond to any brief that comes in from
      your choice of 5 suburbs.
  image:
    file: "/uploads/briefs.png"
    alt: location specific briefs
- header: 3. Submit proposals
  text: We're all about efficiency. Proposals are designed to be done on the fly and
    shouldn't take longer than 4 minutes to complete. Write a small intro, answer
    questions the seller has asked, and your done.
  faqs:
  - question: How do I stand out?
    answer: 'Responsiveness and past client reviews hold a lot of weight. The beauty
      of our platform is that it brings a level of transparency, and for once the
      ability for agents to stand out on merit. '
  - question: Will I need to quote a value for the property & marketing cost?
    answer: We educate sellers to wait until the listing presentation for an appraisal,
      and the same applies for the marketing costs and strategy. Because both are
      determined by the property, its location, condition and price point - which
      cannot be accurately answered without physically viewing the property.
  - question: Is my selling fee displayed?
    answer: 'Yes it is, but keep in mind its in a closed platform so only vetted,
      ready sellers will be able to view your bespoke fee. '
  image:
    file: "/uploads/property.png"
    alt: submit your proposal
- header: 4. Meet face to face
  text: This is what its all about, more opportunity to do what you do best. We recommend
    that our sellers meet 2-3 agents for a traditional listing presentation.
  faqs:
  - question: Why do you recommend to meet 2-3 agents?
    answer: Firstly it provides sellers with a filter that cannot be replicated online
      - a listing presentation is what really sets you apart. We believe that if you
      are one of the 2-3 best agents for a particular type of dwelling in a suburb
      or price point, then this allows for more opportunity.
  - question: Wont sellers just choose on price?
    answer: Our platform was created to differentiate agents based their quality.
      Property isn't a commodity and either are you.
  image:
    file: "/uploads/interview2.png"
    alt: handshake
faq header: How we're different
faqs:
- question: 
  answer: 
layout: default
---

{% include modules/how_it_works_nav.md active="agents" %}
{% include modules/how_it_works.md %}
<section>
  <div class="container pricing-section-agents">
    <h2 class="text-center">{{page['pricing section'].header}}</h2>
    <div class="row">
      <div class="col-12 col-md-6 offset-md-3 text-center">
        <p class="my-2">{{page['pricing section'].text | markdownify}}</p>
      </div>
    </div>
    <div class="row">
      {% for plan in page['pricing section'].plans %}
        <div class="col-12 col-md-6 my-2">
          <div class="card {% if forloop.first %} card-first {% endif %} mx-auto" style="max-width: 400px">
            <div class="card-header {% if forloop.first %} featured {% endif %} text-center">
              <h4>{{plan.title}}</h4>
            </div>
            <div class="card-block text-center">
              <ul>
                {% for feature in plan.features %}
                <li class="my-5">{{feature}}</li>
                {% endfor %}
              </ul>
              {% if forloop.first %}
              <a href="/signup/agents" class="btn btn-block btn-outline-primary mt-4">GET STARTED</a>
              {% else %}
              <a href="mailto:hello@heyagents.com.au" class="btn btn-block btn-primary mt-4">LETS TALK</a>
              {% endif %}
            </div>
          </div>
        </div>
      {% endfor%}
    </div>
  </div>
</section>

  <section class="last-cta-section-agents">
    <div class="regular-container">
      <div class="row">
        <div class="col-xs-12 col-sm-6">
          <h3 class="large-margin-top wow fadeInUp" >Open new doors with Hey Agents</h3>
          <p class="medium-margin-bottom wow fadeInUp" data-wow-delay="0.3s">Access new client opportunities that not only have an active need
            to sell but who already trust and acknowledge your individual expertise.
          </p>
          <a href="/signup/agents" class="button primary big wow fadeInUp" data-wow-delay="0.6s">Create your free profile</a>
        </div>
        <div class="col-xs-12 col-sm-6">
          <img src="/assets/img/mobile-ui-preview.jpg" alt="hey agents interface" class="cta-section-image">
        </div>
      </div>
    </div>
  </section>
{% if page.faqs[0].question %}
<section class="bg-white" id="faqs">
  <div class="container">
    <h2 class="text-center mb-5">{{page['faq header']}}</h2>
    {% include modules/faqs_accordion.md faqs=page.faqs %}
  </div>
</section>
{% endif %}
