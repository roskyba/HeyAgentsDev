---
title: For Agencies
date: 2017-06-28 11:29:00 +10:00
permalink: "/for-agencies/"
published: false
meta title: Sign up your real estate agency to Hey Agents
meta description: Paying for leads is a thing of the past. Our solution provides high
  quality, vetted sellers who are looking to sell now.
hero:
  header:
    light: When your agents thrive,
    bold: your agency thrives.
  text: 'Hey Agents gives agents the platform to build their online presence, showcase
    their market knowledge and highlight their historic performance. '
  image:
    file: "/assets/images/agencyhero.jpg"
    alt: agency header image
form:
  header: Help your agents stand out, the right way
  text: Sign up your agency below to get started.
  image:
    file: "/assets/images/agency-devices.png"
    alt: hey agents platform dashboard
value propositions:
- header: We believe in agents
  text: Data is at the core of our business, that's why we focus on building long
    term relationships with agencies. We believe highlighting an agents historic performance
    is the key to building trust for any prospective vendors.
  image:
    file: "/uploads/mouse.svg"
    alt: mouse icon
- header: Live & vetted leads
  text: 'Our solution provides high quality, vetted sellers who are looking to sell
    now. This means your agents aren''t wasting time, and only paying for the business
    they win. '
  image:
    file: "/uploads/vetted.svg"
    alt: vetted icon
- header: 'More cost effective '
  text: We want you to remain a commercially viable business, that's why we only charge
    5% +GST on sales made through our platform. Unlike other sites who charge 20%+
    and dig into your bottom line, we provide value at a fair fee.
  image:
    file: "/uploads/rates.svg"
    alt: commission rate icon
faqs header: How we're different
faqs intro: Contrary to the majority of proptech startups, ‘disruption’ isn't a word
  you’ll find in our vocabulary. We are a startup, focused on technology and innovation,
  but are geared towards enhancing the perception of the real estate industry. We
  support and provide more business opportunities to traditional real estate business,
  and demonstrate the necessity and value in quality estate agents.<br><br>As an open
  marketplace, we don’t hold any agent back from joining, nor do we make agent recommendations.
  Through the use of data (sales history) customised client responses and past client
  reviews - consumers can differentiate agents by experience and quality, making it
  clear to see who the best options are based on factual data. We offer a real solution
  (with responsibility and integrity) for the growing segment of the market looking
  for help online.<br><br>Our co-founder, Matthew Gregory comes from the industry
  as a sales agent. He saw first hand the frustrations and friction faced with current
  intermediaries, and the misalignment on the value they provide on both sides of
  the equation. To build the platform with substantial product market fit, we had
  to rely not just on Matthew opinion, but a larger R&D effort. In our research we
  identified four major pain points which we have highlighted below, and how we have
  overcome them.
faqs:
- question: Price
  answer: |-
    Given Macquarie Bank's latest Benchmarking Report, the average real estate business in Australia operates at a 15.4 per cent profit margin, this demonstrates the current 20-25% referral fee being charged by other sites is not commercially viable.
    We charge a percentage of the total commission also, however our fee of 5% is far better value when compared to the typical CPA of most traditional prospecting methods. Our margins are also much lower, meaning we have a clear incentive to make sure the best agents are winning business, at a fair rate.
- question: Database
  answer: 'Our co-founder Matthew’s experience in the industry allow him to understand
    the pain & frustration of being charged a referral fee for clients he has already
    built a relationship with. That’s why we first ask the vendor if they have a relationship
    with, or are on our site to compare a particular agent, if they are we make it
    very clear we will not charge that agent a fee. However, if the vendor bypasses
    that opportunity to submit an agent, agent’s that substantiate an in-house appraisal
    has been conducted (in the past 12 months) - will not be charged a fee. So essentially,
    our platform only charges agents for new client opportunities.

'
- question: Race to the bottom
  answer: The fear our platform will becoming a race to the bottom (concerning fee)
    is fair. But our intention and focus is with connecting the consumers with the
    best agents - irrespective of fee. Education will play its role also, to help
    consumers understand that the NET result is what counts.
- question: Competition
  answer: 'Agents will only compete with relevant agents. Each agent chooses five
    core- suburbs that they can receive new client opportunities from, meaning they
    are not competing with irrelevant agents that throw their hats in the ring.

'
layout: default
---

{% include modules/hero.md %}
<section>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-lg-11 offset-lg-1">
        <h2>{{page.form.header}}</h2>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-lg-5 offset-lg-1">
        <div class="mt-2">{{page.form.text | markdownify}}</div>
        {% include modules/agency_signup.md %}
      </div>
      <div class="col-lg-6 hidden-md-down d-flex pr-0">
        <img class="img-fluid bleed align-self-center" src="{{page.form.image.file}}" alt="{{page.form.image.alt}}">
      </div>
    </div>
  </div>
</section>
<section aria-labelledby="proplabel">
{% include modules/value_prop_banner.md %}
</section>
{% if page.faqs[0].question %}
<section>
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-lg-8 offset-lg-2">
        <h2 class="text-center mb-4">{{page['faqs header']}}</h2>
        <div class="my-5">{{page['faqs intro'] | markdownify}}</div>
        {% include modules/faqs_accordion.md faqs=page.faqs %}
      </div>
    </div>
  </div>
</section>
{% endif %}
{% include modules/question_banner.md %}
