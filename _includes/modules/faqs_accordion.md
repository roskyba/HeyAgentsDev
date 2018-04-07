<div class="accordion" role="tablist" aria-multiselectable="true" id="accordion_{{accordion}}">
{% for faq in include.faqs %}
<div class="card">
  <div class="card-header" role="tab" accordion="accordion_{{accordion}}_question_{{forloop.index}}">
    <a data-toggle="collapse" data-parent="#accordion_{{accordion}}" href="#accordion_{{accordion}}_answer_{{forloop.index}}" {% if forloop.first and include.closed != true %} aria-expanded="true" {% else %} aria-expanded="false" class="collapsed"{%endif%} aria-controls="accordion_{{accordion}}_answer_{{forloop.index}}">
      {{faq.question}}<i class="fa fa-angle-down accordion-arrow"></i>
    </a>
  </div>
  <div id="accordion_{{accordion}}_answer_{{forloop.index}}" class="collapse {% if forloop.first and include.closed != true %} show {% endif %}" role="tabpanel" aria-labelledby="accordion_{{accordion}}_question_{{forloop.index}}">
    <div class="card-block">
      {{faq.answer}}
    </div>
  </div>
</div>
{% endfor %}
</div>
{% capture _ %}
{% increment accordion %}
{% endcapture %}
