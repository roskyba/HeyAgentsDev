<form id="agency_portal_consent" novalidate>
  <div class="form-group">
    <label for="agency_name">Agency name</label>
    <input type="text" class="form-control" id="agency_name" name="agency_name" placeholder="Start typing..." data-place="true" required>
  </div>
  <div class="form-group">
    <label for="contact_name">Agency address</label>
    <input type="text" class="form-control" name="office_address" required>
  </div>
  <div class="form-group">
    <label for="contact_name">Principal / director name</label>
    <input type="text" class="form-control" name="contact_name" required>
  </div>
  <div class="form-group">
    <label for="contact_name">Contact email</label>
    <input type="email" class="form-control" name="contact_email" required>
  </div>
  <div class="form-group">
    <label for="contact_phone">Contact phone</label>
    <input type="text" class="form-control" name="contact_phone" required>
  </div>
  <div class="form-group">
    <label for="contact_phone">The number of agents in your office</label>
    <select class="form-control" name="agents" required>
      <option value="fewer than 5">Fewer than 5 agents</option>
      <option value="between 5 and 10">Between 5 and 10 agents</option>
      <option value="over 10">Over 10 agents</option>
    </select>
  </div>
  <div class="form-group">
   <label for="crm_provider">CRM used to feed listings to REA and Domain</label>
    <input type="text" class="form-control" id="portal_uploader" name="portal_uploader" placeholder="Start typing..." required>
  </div>
  <div class="form-check my-4">
    <label class="form-check-label">
      <input class="form-check-input" type="checkbox" value="" name="agreeToTerms" required>
      On behalf of <span class="agency_name_update">the above agency</span>, I agree to the <a href="/terms-and-conditions/agents">terms & conditions</a>.
    </label>
  </div>
  <div class="form-group">
    <input type="submit" class="btn btn-block btn-outline-primary" value="Submit">
  </div>
</form>
<div id="map" class="d-none"></div>
