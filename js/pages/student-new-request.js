// pages/student-new-request.js — Student New Facility Request Page
const StudentNewRequest = (() => {
  function showGuidelines() {
    const title = '<span class="serif-title" style="color: var(--primary); font-size: 1.3rem;">General Guidelines for University Activities</span>';
    const body = `
      <p style="color: #718096; font-size: 0.95rem; margin-bottom: 20px; border-bottom: 1px solid #edf2f7; padding-bottom: 15px;">Please read these important protocols regarding facility reservation.</p>

      <h4 class="serif-title" style="color: var(--primary); text-transform: uppercase; font-size: 0.9rem; margin-top: 15px; letter-spacing: 0.05em;">1. Submission & Scheduling Protocols</h4>
      <p style="font-size: 0.85rem; color: #4a5568; line-height: 1.6; margin-bottom: 12px;"><strong>Online Filing:</strong> All requests must be submitted through the Facility Reservation Portal at least five (5) days prior to the event date. The system will automatically lock dates that do not meet this lead time.</p>
      <p style="font-size: 0.85rem; color: #4a5568; line-height: 1.6; margin-bottom: 12px;"><strong>Availability Check:</strong> Users must check the system calendar for venue availability before proceeding. The system prevents double-booking; however, conflicts with major university events will be flagged during review.</p>
      <p style="font-size: 0.85rem; color: #4a5568; line-height: 1.6; margin-bottom: 20px;"><strong>Examination Ban:</strong> Activities sponsored by student organizations are strictly prohibited ten (10) days prior to major examination periods. The system will disable booking during these dates.</p>

      <h4 class="serif-title" style="color: var(--primary); text-transform: uppercase; font-size: 0.9rem; margin-top: 15px; letter-spacing: 0.05em;">2. Eligibility & Accounts</h4>
      <p style="font-size: 0.85rem; color: #4a5568; line-height: 1.6; margin-bottom: 12px;"><strong>Authorized Users:</strong> Only registered officers of accredited student organizations or authorized faculty/staff may access the reservation system to file requests.</p>
      <p style="font-size: 0.85rem; color: #4a5568; line-height: 1.6; margin-bottom: 20px;"><strong>Adviser Approval:</strong> For student-sponsored activities, the designated Adviser must review and approve the request digitally before it is routed to the GBMO. The Adviser must also be physically present during the entire duration of the actual activity.</p>

      <h4 class="serif-title" style="color: var(--primary); text-transform: uppercase; font-size: 0.9rem; margin-top: 15px; letter-spacing: 0.05em;">3. Event Details & Logistics</h4>
      <p style="font-size: 0.85rem; color: #4a5568; line-height: 1.6; margin-bottom: 12px;"><strong>Layout Requirements:</strong> If your event requires a specific arrangement (tables, chairs, sound system, plants, etc.), you must describe this in the "Program Details" section.</p>
      <p style="font-size: 0.85rem; color: #4a5568; line-height: 1.6; margin-bottom: 12px;"><strong>External Participants:</strong> If inviting participants outside the university (non-UNC), you must check the "External Participants" box. Joint activities with outside groups require a contract/MOA uploaded to the system indicating rental fees and usage terms.</p>
      <p style="font-size: 0.85rem; color: #4a5568; line-height: 1.6; margin-bottom: 20px;"><strong>Fees:</strong> Fund-raising activities and external joint sponsorships are subject to facility usage fees. These will be calculated and reflected in the system upon approval.</p>

      <h4 class="serif-title" style="color: var(--primary); text-transform: uppercase; font-size: 0.9rem; margin-top: 15px; letter-spacing: 0.05em;">4. Security & Conduct</h4>
      <p style="font-size: 0.85rem; color: #4a5568; line-height: 1.6; margin-bottom: 20px;"><strong>Loitering Policy:</strong> For night events, post-class activities, or holiday reservations, participants must remain within the reserved venue. Loitering around other university premises is prohibited for security reasons.</p>
    `;
    Components.openModal(title, body, '');
  }

  function toggleSuspension(checkbox) {
    const details = document.getElementById('suspension-details');
    if (details) details.style.display = checkbox.checked ? 'block' : 'none';
  }

  function toggleExternal(checkbox) {
    const details = document.getElementById('external-details');
    if (details) details.style.display = checkbox.checked ? 'block' : 'none';
  }

  function addPersonRow() {
    const container = document.getElementById('invited-persons-list');
    if (!container) return;

    const row = document.createElement('div');
    row.style.display = 'grid';
    row.style.gridTemplateColumns = '1fr 1fr 1fr 40px';
    row.style.padding = '16px';
    row.style.gap = '15px';
    row.style.background = '#fff';
    row.style.alignItems = 'center';
    row.style.borderTop = '1px solid #e2e8f0';

    row.innerHTML = `
      <input type="text" class="form-control" placeholder="Name" style="background: #fff; margin: 0;" />
      <input type="text" class="form-control" placeholder="Office / Institution" style="background: #fff; margin: 0;" />
      <input type="text" class="form-control" placeholder="Position / Designation" style="background: #fff; margin: 0;" />
      <button type="button" onclick="StudentNewRequest.removePersonRow(this)" style="background: transparent; border: none; color: #e53e3e; cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; width: 100%;"><i class="far fa-trash-alt"></i></button>
    `;

    container.appendChild(row);
  }

  function removePersonRow(btn) {
    const row = btn.parentElement;
    if (row && row.parentElement) {
      row.parentElement.removeChild(row);
    }
  }

  const venuesByCategory = {
    'sports facilities': ['Sports Palace', 'Student Pavilion'],
    'academic spaces': ['Auditorium', 'Seminar Room A', 'Seminar Room B'],
    'laboratory': ['Computer Lab 1', 'Computer Lab 2', 'Computer Lab 3'],
    'classroom': ['Classroom 101', 'Classroom 102', 'Classroom 103'],
    'lobby': ['Main Lobby', 'Admin Lobby'],
    'grounds/outdoor': ['Quadrangle', 'Open Field']
  };

  function updateSpecificVenues(category) {
    const specificVenueGroup = document.getElementById('specific-venue-group');
    const coveredCourtsGroup = document.getElementById('covered-courts-group');
    const optionsList = document.getElementById('venue-options-list');
    const selectedText = document.getElementById('selected-venue-text');
    const searchInput = document.getElementById('venue-search-input');

    if (!category) {
      if (specificVenueGroup) specificVenueGroup.style.display = 'none';
      if (coveredCourtsGroup) coveredCourtsGroup.style.display = 'none';
      return;
    }

    if (category === 'covered courts') {
      if (specificVenueGroup) specificVenueGroup.style.display = 'none';
      if (coveredCourtsGroup) coveredCourtsGroup.style.display = 'block';
      return;
    }

    // For all other categories
    if (coveredCourtsGroup) coveredCourtsGroup.style.display = 'none';
    if (specificVenueGroup) specificVenueGroup.style.display = 'block';

    if (selectedText) {
      selectedText.innerText = 'Search venue...';
      selectedText.style.color = '#718096';
    }
    if (searchInput) searchInput.value = '';

    if (optionsList) {
      const venues = venuesByCategory[category] || [];
      optionsList.innerHTML = venues.map(venue =>
        `<div class="venue-option" onclick="StudentNewRequest.selectVenue('${venue}')" style="padding: 12px 16px; cursor: pointer; color: #1a202c; font-size: 0.95rem; border-bottom: 1px solid #f7fafc;">${venue}</div>`
      ).join('');
    }
  }

  function toggleVenueDropdown() {
    const menu = document.getElementById('venue-dropdown-menu');
    if (menu) {
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
      if (menu.style.display === 'block') {
        document.getElementById('venue-search-input').focus();
      }
    }
  }

  function filterVenues() {
    const input = document.getElementById('venue-search-input').value.toLowerCase();
    const options = document.querySelectorAll('#venue-options-list .venue-option');
    options.forEach(opt => {
      const text = opt.innerText.toLowerCase();
      opt.style.display = text.includes(input) ? 'block' : 'none';
    });
  }

  function selectVenue(venueName) {
    const selectedText = document.getElementById('selected-venue-text');
    if (selectedText) {
      selectedText.innerText = venueName;
      selectedText.style.color = '#1a202c';
    }
    const menu = document.getElementById('venue-dropdown-menu');
    if (menu) menu.style.display = 'none';
  }

  function toggleBehalf(checkbox) {
    const container = document.getElementById('behalf-dropdown-container');
    if (container) {
      container.style.display = checkbox.checked ? 'block' : 'none';
    }
  }

  let currentStep = 1;
  const totalSteps = 5;

  function nextStep() {
    const nextSection = document.getElementById(`step-section-${currentStep + 1}`);
    if (nextSection) {
      currentStep++;
      updateStepView();
    } else {
      Components.toast('Further steps are still in development.', 'info');
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep--;
      updateStepView();
    } else {
      Router.navigate('student/dashboard');
    }
  }

  function updateStepView() {
    for (let i = 1; i <= totalSteps; i++) {
      const circle = document.getElementById(`step-circle-${i}`);
      const title = document.getElementById(`step-title-${i}`);
      if (circle && title) {
        if (i === currentStep) {
          circle.style.background = 'var(--primary)';
          circle.style.color = '#fff';
          circle.style.border = 'none';
          circle.style.boxShadow = '0 4px 10px rgba(233, 53, 88, 0.3)';
          circle.innerHTML = i;
          title.style.color = 'var(--primary)';
          title.style.fontWeight = '800';
        } else if (i < currentStep) {
          circle.style.background = 'var(--primary)';
          circle.style.color = '#fff';
          circle.style.border = 'none';
          circle.style.boxShadow = 'none';
          circle.innerHTML = '<i class="fas fa-check"></i>';
          title.style.color = '#1a202c';
          title.style.fontWeight = '800';
        } else {
          circle.style.background = '#fff';
          circle.style.border = '2px solid #e2e8f0';
          circle.style.color = '#a0aec0';
          circle.style.boxShadow = 'none';
          circle.innerHTML = i;
          title.style.color = '#a0aec0';
          title.style.fontWeight = '600';
        }
      }
    }

    const progressLine = document.getElementById('stepper-progress-line');
    if (progressLine) {
      const progressWidth = ((currentStep - 1) / (totalSteps - 1)) * 100;
      progressLine.style.width = `${progressWidth * 0.8}%`;
    }

    for (let i = 1; i <= totalSteps; i++) {
      const section = document.getElementById(`step-section-${i}`);
      if (section) {
        section.style.display = (i === currentStep) ? 'block' : 'none';
      }
    }

    if (currentStep === 5) {
      if (typeof updateSummary === 'function') {
        updateSummary();
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateSummary() {
    const activityTypeSelect = document.querySelector('#step-section-1 select');
    const activityType = activityTypeSelect ? activityTypeSelect.options[activityTypeSelect.selectedIndex]?.text : '';

    let eventName = '';
    let department = Auth.current()?.dept || 'College of Computer Studies';

    const textInputs = document.querySelectorAll('#step-section-1 input[type="text"]');
    textInputs.forEach(input => {
      if (input.placeholder.toLowerCase().includes('event name')) eventName = input.value;
      if (input.readOnly && (input.value.includes('College') || input.value.includes('School'))) department = input.value;
    });

    const behalfCheckbox = document.querySelector('input[onchange="StudentNewRequest.toggleBehalf(this)"]');
    if (behalfCheckbox && behalfCheckbox.checked) {
      const behalfSelect = document.querySelector('#behalf-dropdown-container select');
      if (behalfSelect && behalfSelect.selectedIndex > 0) department = behalfSelect.options[behalfSelect.selectedIndex]?.text;
    }

    const dateInput = document.querySelector('#step-section-1 input[type="date"]');
    const dateStr = dateInput ? dateInput.value : '';

    let timeStart = '';
    let timeEnd = '';
    const timeInputs = document.querySelectorAll('#step-section-1 input[type="time"]');
    if (timeInputs.length >= 2) {
      timeStart = timeInputs[0].value;
      timeEnd = timeInputs[1].value;
    }

    const textarea = document.querySelector('#step-section-1 textarea');
    const programDetails = textarea ? textarea.value : '';

    const formatValue = (val) => val && val.trim() !== '' && val !== 'Select Type' && val !== 'Select a category' ? val : 'Not specified';

    document.getElementById('summary-activity-type').innerText = formatValue(activityType);
    document.getElementById('summary-event-name').innerText = formatValue(eventName);
    document.getElementById('summary-date').innerText = formatValue(dateStr);
    document.getElementById('summary-time').innerText = (timeStart && timeEnd) ? `${timeStart} - ${timeEnd}` : 'Not specified';
    document.getElementById('summary-department').innerText = formatValue(department);
    document.getElementById('summary-program-details').innerText = formatValue(programDetails);

    let finalVenue = 'Not specified';
    const venueCategory = document.getElementById('venue-category-select')?.value;
    if (venueCategory === 'covered courts') {
      const courts = Array.from(document.querySelectorAll('#covered-courts-group input[type="checkbox"]:checked')).map(cb => cb.nextElementSibling.innerText);
      if (courts.length > 0) finalVenue = courts.join(', ');
    } else {
      const venueText = document.getElementById('selected-venue-text')?.innerText;
      if (venueText && venueText !== 'Search venue...') finalVenue = venueText;
    }

    const attendeesInput = document.querySelector('#step-section-2 input[type="number"]');
    const attendees = attendeesInput ? attendeesInput.value : '';

    document.getElementById('summary-venue').innerText = finalVenue;
    document.getElementById('summary-attendees').innerText = attendees ? `${attendees} people` : 'Not specified';

    const resources = Array.from(document.querySelectorAll('#step-section-3 input[type="checkbox"]:checked')).map(cb => cb.nextElementSibling.innerText);
    const summaryResources = document.getElementById('summary-resources');
    if (resources.length > 0) {
      summaryResources.innerHTML = `<ul style="margin: 0; padding-left: 20px; color: #1a202c; font-size: 0.95rem;">${resources.map(r => `<li>${r}</li>`).join('')}</ul>`;
    } else {
      summaryResources.innerHTML = `<span style="color: #a0aec0; font-size: 0.9rem; font-style: italic;">No resources or ICT selected</span>`;
    }

    const personnel = Array.from(document.querySelectorAll('#step-section-4 input[type="checkbox"]:checked')).map(cb => cb.nextElementSibling.innerText);
    const summaryPersonnel = document.getElementById('summary-personnel');
    if (personnel.length > 0) {
      summaryPersonnel.innerHTML = `<ul style="margin: 0; padding-left: 20px; color: #1a202c; font-size: 0.95rem;">${personnel.map(p => `<li>${p}</li>`).join('')}</ul>`;
    } else {
      summaryPersonnel.innerHTML = `<span style="color: #a0aec0; font-size: 0.9rem; font-style: italic;">No personnel services selected</span>`;
    }
  }

  function render() {
    const user = Auth.current();
    if (!user) { Router.navigate('login'); return; }
    currentStep = 1;

    const content = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
        <div>
          <h2 class="serif-title" style="font-size: 1.1rem; font-weight: 800; margin-bottom: 2px; color: #1a202c;">New Facility Request</h2>
          <p style="color: #718096; font-size: 0.95rem;">Submit a request to reserve a university facility</p>
        </div>
        <button class="btn" style="background: #fff; color: var(--primary); border: 1px solid var(--primary); font-weight: 600; padding: 8px 20px; border-radius: 20px; font-size: 0.85rem;" onclick="StudentNewRequest.showGuidelines()">
          <i class="fas fa-info-circle"></i> Guidelines
        </button>
      </div>

      <!-- Stepper -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; position: relative;">
        <div style="position: absolute; top: 18px; left: 10%; right: 10%; height: 2px; background: #e2e8f0; z-index: 0;"></div>
        <div id="stepper-progress-line" style="position: absolute; top: 18px; left: 10%; width: 0%; height: 2px; background: var(--primary); z-index: 0; transition: width 0.3s ease;"></div>
        
        <div style="display: flex; flex-direction: column; align-items: center; position: relative; z-index: 1; flex: 1;">
          <div id="step-circle-1" style="width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; margin-bottom: 10px; font-size: 0.9rem; transition: all 0.3s ease;">1</div>
          <div id="step-title-1" style="font-size: 0.75rem; text-transform: uppercase; transition: all 0.3s ease;">Activity Details</div>
          <div style="font-size: 0.65rem; color: #a0aec0; text-align: center;">Basic event information</div>
        </div>
        
        <div style="display: flex; flex-direction: column; align-items: center; position: relative; z-index: 1; flex: 1;">
          <div id="step-circle-2" style="width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; margin-bottom: 10px; font-size: 0.9rem; transition: all 0.3s ease;">2</div>
          <div id="step-title-2" style="font-size: 0.75rem; text-transform: uppercase; transition: all 0.3s ease;">Venue & Attendees</div>
          <div style="font-size: 0.65rem; color: #cbd5e0; text-align: center;">Location and capacity</div>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; position: relative; z-index: 1; flex: 1;">
          <div id="step-circle-3" style="width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; margin-bottom: 10px; font-size: 0.9rem; transition: all 0.3s ease;">3</div>
          <div id="step-title-3" style="font-size: 0.75rem; text-transform: uppercase; transition: all 0.3s ease;">Resources & Eqpt</div>
          <div style="font-size: 0.65rem; color: #cbd5e0; text-align: center;">Required items</div>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; position: relative; z-index: 1; flex: 1;">
          <div id="step-circle-4" style="width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; margin-bottom: 10px; font-size: 0.9rem; transition: all 0.3s ease;">4</div>
          <div id="step-title-4" style="font-size: 0.75rem; text-transform: uppercase; transition: all 0.3s ease;">Personnel Services</div>
          <div style="font-size: 0.65rem; color: #cbd5e0; text-align: center;">Staff and support</div>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; position: relative; z-index: 1; flex: 1;">
          <div id="step-circle-5" style="width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; margin-bottom: 10px; font-size: 0.9rem; transition: all 0.3s ease;">5</div>
          <div id="step-title-5" style="font-size: 0.75rem; text-transform: uppercase; transition: all 0.3s ease;">Review & Submit</div>
          <div style="font-size: 0.65rem; color: #cbd5e0; text-align: center;">Confirm request</div>
        </div>
      </div>

      <!-- STEP 1: Activity Details -->
      <div id="step-section-1" style="display: none;">
        <div class="card" style="padding: 40px; margin-bottom: 30px;">
          <h3 class="serif-title" style="color: var(--primary); font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;">ACTIVITY DETAILS</h3>
          <p style="color: #718096; font-size: 0.9rem; margin-bottom: 30px;">Please provide the basic information about your activity or event.</p>

          <div style="display: flex; flex-direction: column; gap: 24px;">
            <!-- Activity Type -->
            <div class="form-group" style="margin: 0;">
              <label style="font-size: 0.85rem; color: #1a1a1a; font-weight: 700; margin-bottom: 8px; display: block;">Activity Type <span style="color: var(--primary);">*</span></label>
              <div style="position: relative;">
                <select class="form-control" style="appearance: none; background: #fff; color: #4a5568;">
                  <option value="">Select Type</option>
                  <option value="university sponsored">University Sponsored</option>
                  <option value="student sponsored">Student Sponsored</option>
                  
                </select>
                <i class="fas fa-chevron-down" style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: #a0aec0; pointer-events: none; font-size: 0.8rem;"></i>
              </div>
            </div>

            <!-- Name of Adviser -->
            <div class="form-group" style="margin: 0;">
              <label style="font-size: 0.85rem; color: #1a1a1a; font-weight: 700; margin-bottom: 8px; display: block;">Name of Adviser <span style="color: var(--primary);">*</span></label>
              <input type="text" class="form-control" placeholder="Dr. Jane Doe" style="background: #fff;" />
              <div style="font-size: 0.65rem; color: #a0aec0; margin-top: 6px;">The Adviser should be present during the whole duration of the activity and recommends its approval.</div>
            </div>

            <!-- Name of Event -->
            <div class="form-group" style="margin: 0;">
              <label style="font-size: 0.85rem; color: #1a1a1a; font-weight: 700; margin-bottom: 8px; display: block;">Name of Event/Activity <span style="color: var(--primary);">*</span></label>
              <input type="text" class="form-control" placeholder="Enter event name" style="background: #fff;" />
            </div>

            <!-- Nature of Activity -->
            <div class="form-group" style="margin: 0;">
              <label style="font-size: 0.85rem; color: #1a1a1a; font-weight: 700; margin-bottom: 8px; display: block;">Program/Nature of Activity <span style="color: var(--primary);">*</span></label>
              <textarea class="form-control" placeholder="Describe the nature and program of the activity" style="background: #fff; min-height: 100px; resize: vertical; padding-top: 14px;"></textarea>
            </div>

            <!-- Dates and Times -->
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
              <div class="form-group" style="margin: 0;">
                <label style="font-size: 0.85rem; color: #1a1a1a; font-weight: 700; margin-bottom: 8px; display: block;">Inclusive Date(s) <span style="color: var(--primary);">*</span></label>
                <input type="date" class="form-control" style="background: #fff; color: #4a5568;" />
                <div style="font-size: 0.65rem; color: #a0aec0; margin-top: 6px;">Requests must be submitted at least 5 days before the event.</div>
              </div>
              <div class="form-group" style="margin: 0;">
                <label style="font-size: 0.85rem; color: #1a1a1a; font-weight: 700; margin-bottom: 8px; display: block;">Start Time <span style="color: var(--primary);">*</span></label>
                <div style="position: relative;">
                  <input type="time" class="form-control" style="background: #fff; color: #4a5568; padding-right: 40px;" />
                </div>
              </div>
              <div class="form-group" style="margin: 0;">
                <label style="font-size: 0.85rem; color: #1a1a1a; font-weight: 700; margin-bottom: 8px; display: block;">End Time <span style="color: var(--primary);">*</span></label>
                <div style="position: relative;">
                  <input type="time" class="form-control" style="background: #fff; color: #4a5568; padding-right: 40px;" />
                </div>
              </div>
            </div>

            <!-- Suspension Checkbox inside a form-control wrapper -->
            <div class="form-control" style="background: #f8fafc; margin: 0; padding: 16px 20px;">
              <label style="display: flex; align-items: center; gap: 12px; cursor: pointer; margin: 0;">
                <input type="checkbox" onchange="StudentNewRequest.toggleSuspension(this)" style="width: 18px; height: 18px; accent-color: var(--primary); cursor: pointer;" />
                <span style="font-size: 0.95rem; color: #1a202c; font-weight: 500;">Request for suspension of classes</span>
              </label>
              <div id="suspension-details" style="display: none; margin-top: 15px;">
                <label style="font-size: 0.85rem; color: #1a1a1a; font-weight: 700; margin-bottom: 8px; display: block;">Offset (specify):</label>
                <input type="text" class="form-control" placeholder="Specify offset details" style="background: #fff;" />
              </div>
            </div>

            <!-- External Participants Checkbox -->
            <div style="padding-top: 10px; padding-bottom: 10px; border-top: 1px solid #edf2f7; margin-top: 10px;">
              <label style="display: flex; align-items: center; gap: 12px; cursor: pointer; margin-bottom: 10px;">
                <input type="checkbox" onchange="StudentNewRequest.toggleExternal(this)" style="width: 18px; height: 18px; accent-color: var(--primary); cursor: pointer;" />
                <span style="font-size: 0.95rem; color: #1a202c; font-weight: 500;">Will you be inviting external participants (not from UNC)?</span>
              </label>

              <div id="external-details" style="display: none; margin-bottom: 20px; width: 100%; margin-top: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                  <div style="font-size: 0.95rem; font-weight: 600; color: #1a202c;">Invited Persons Details</div>
                  <button type="button" onclick="StudentNewRequest.addPersonRow()" class="btn" style="background: #fff; color: #1a1a1a; border: 1px solid #e2e8f0; padding: 6px 14px; border-radius: 6px; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                    <i class="fas fa-plus"></i> Add Person
                  </button>
                </div>
                <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
                  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 40px; background: #f1f5f9; padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 0.85rem; font-weight: 800; color: #1a1a1a;">
                    <div>Name</div>
                    <div>Office / Institution</div>
                    <div>Position / Designation</div>
                    <div></div>
                  </div>
                  <div id="invited-persons-list" style="background: #fff;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 40px; padding: 16px; gap: 15px; align-items: center;">
                      <input type="text" class="form-control" placeholder="Name" style="background: #fff; margin: 0;" />
                      <input type="text" class="form-control" placeholder="Office / Institution" style="background: #fff; margin: 0;" />
                      <input type="text" class="form-control" placeholder="Position / Designation" style="background: #fff; margin: 0;" />
                      <button type="button" onclick="StudentNewRequest.removePersonRow(this)" style="background: transparent; border: none; color: #e53e3e; cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; width: 100%;"><i class="far fa-trash-alt"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Department and Audiences -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div class="form-group" style="margin: 0;">
                <label style="font-size: 0.85rem; color: #1a1a1a; font-weight: 700; margin-bottom: 8px; display: block;">Your Department</label>
                <input type="text" class="form-control" value="${user.dept || 'College of Computer Studies'}" readonly style="background: #f8fafc; color: #718096; border-color: #e2e8f0;" />
              </div>
              <div class="form-group" style="margin: 0;">
                <label style="font-size: 0.85rem; color: #1a1a1a; font-weight: 700; margin-bottom: 8px; display: block;">Participants / Audiences</label>
                <input type="text" class="form-control" placeholder="e.g., All students, Faculty members" style="background: #fff;" />
              </div>
            </div>

            <!-- Behalf Checkbox -->
            <label style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
              <input type="checkbox" onchange="StudentNewRequest.toggleBehalf(this)" style="width: 18px; height: 18px; accent-color: var(--primary); cursor: pointer;" />
              <span style="font-size: 0.95rem; color: #1a202c; font-weight: 500;">Requesting on behalf of a different department / organization?</span>
            </label>

            <!-- Behalf Dropdown (Initially hidden) -->
            <div id="behalf-dropdown-container" style="display: none; margin-top: 15px;">
              <label style="font-size: 0.85rem; color: #1a1a1a; font-weight: 700; margin-bottom: 8px; display: block;">Select Department / Organization <span style="color: var(--primary);">*</span></label>
              <div style="position: relative;">
                <select class="form-control" style="appearance: none; background: #fff; color: #4a5568;">
                  <option value="ccs">College of Computer Studies (CCS)</option>
                  <option value="elementary">Elementary</option>
                  <option value="jhs">Junior High School</option>
                  <option value="shs">Senior High School</option>
                  <option value="scis">School of Computer and Information Sciences (SCIS)</option>
                  <option value="law">School of Law</option>
                  <option value="ssns">School of Social and Natural Sciences (SSNS)</option>
                  <option value="sba">School of Business and Accountancy (SBA)</option>
                  <option value="sted">School of Teacher Education (STED)</option>
                  <option value="snahs">School of Nursing and Allied Health Sciences (SNAHS)</option>
                  <option value="ccje">College of Criminal Justice Education (CCJE)</option>
                  <option value="cea">College of Engineering and Architecture (CEA)</option>
                  <optgroup label="OTHER">
                    <option value="external">External Organization</option>
                    <option value="others">Others</option>
                  </optgroup>
                </select>
                <i class="fas fa-chevron-down" style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: #a0aec0; pointer-events: none; font-size: 0.8rem;"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Buttons (Step 1) -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 40px;">
          <button class="btn" style="background: #fff; color: #718096; border: 1px solid #e2e8f0; font-weight: 600; padding: 12px 24px; border-radius: 8px; font-size: 0.95rem; display: flex; align-items: center; gap: 8px;" onclick="StudentNewRequest.prevStep()">
            <i class="fas fa-chevron-left" style="font-size: 0.8rem;"></i> Back
          </button>
          <button class="btn" style="background: var(--primary); color: #fff; font-weight: 700; padding: 12px 28px; border-radius: 8px; font-size: 0.95rem; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(233, 53, 88, 0.2);" onclick="StudentNewRequest.nextStep()">
            Next <i class="fas fa-chevron-right" style="font-size: 0.8rem;"></i>
          </button>
        </div>
      </div>

      <!-- STEP 2: Venue & Attendees -->
      <div id="step-section-2" style="display: none;">
        <div class="card" style="padding: 40px; margin-bottom: 30px;">
          <h3 class="serif-title" style="color: var(--primary); font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;">VENUE & ATTENDEES</h3>
          <p style="color: #718096; font-size: 0.9rem; margin-bottom: 30px;">Select the location and specify expected attendance</p>

          <div style="display: flex; flex-direction: column; gap: 24px;">
            <!-- Venue Category -->
            <div class="form-group" style="margin: 0;">
              <label style="font-size: 0.85rem; color: #1a1a1a; font-weight: 700; margin-bottom: 8px; display: block;">Venue Category <span style="color: var(--primary);">*</span></label>
              <div style="position: relative;">
                <select id="venue-category-select" onchange="StudentNewRequest.updateSpecificVenues(this.value)" class="form-control" style="appearance: none; background: #fff; color: #4a5568;">
                  <option value="">Select a category</option>
                  <option value="sports facilities">Sports Facilities</option>
                  <option value="covered courts">Covered Courts</option>
                  <option value="academic spaces">Academic Spaces</option>
                  <option value="laboratory">Computer Laboratory</option>
                  <option value="classroom">Standard Classroom</option>
                  <option value="lobby">Lobby</option>
                  <option value="grounds/outdoor">Grounds/Outdoor</option>
                </select>
                <i class="fas fa-chevron-down" style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: #a0aec0; pointer-events: none; font-size: 0.8rem;"></i>
              </div>
            </div>

            <!-- Specific Venue -->
            <div id="specific-venue-group" class="form-group" style="margin: 0; display: none;">
              <label style="font-size: 0.85rem; color: #1a1a1a; font-weight: 700; margin-bottom: 8px; display: block;">Specific Venue <span style="color: var(--primary);">*</span></label>
              
              <div class="custom-select-wrapper" style="position: relative;">
                <div class="custom-select-trigger" onclick="StudentNewRequest.toggleVenueDropdown()" style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; background: #fff; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                  <span id="selected-venue-text" style="color: #718096; font-size: 0.95rem;">Search venue...</span>
                  <i class="fas fa-chevron-down" style="color: #a0aec0; font-size: 0.8rem;"></i>
                </div>
                
                <div id="venue-dropdown-menu" style="display: none; position: absolute; top: 100%; left: 0; right: 0; margin-top: 4px; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); z-index: 10;">
                  <div style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
                    <div style="position: relative;">
                      <i class="fas fa-search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #a0aec0; font-size: 0.85rem;"></i>
                      <input type="text" id="venue-search-input" onkeyup="StudentNewRequest.filterVenues()" placeholder="Type to search..." style="width: 100%; padding: 8px 12px 8px 32px; border: none; font-size: 0.9rem; outline: none; color: #4a5568;" />
                    </div>
                  </div>
                  <div id="venue-options-list" style="max-height: 200px; overflow-y: auto;">
                    <!-- Options populated dynamically based on category -->
                  </div>
                </div>
              </div>
            </div>

            <!-- Covered Courts Checkboxes -->
            <div id="covered-courts-group" class="form-group" style="margin: 0; display: none;">
              <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; background: #f8fafc;">
                <label style="font-size: 0.85rem; color: #1a1a1a; font-weight: 700; margin-bottom: 4px; display: block;">Select Covered Court(s) <span style="color: var(--primary);">*</span></label>
                <p style="font-size: 0.8rem; color: #718096; margin-bottom: 16px;">You may select both courts if needed.</p>
                
                <div style="display: flex; flex-direction: column; gap: 12px;">
                  <label style="display: flex; align-items: center; gap: 12px; cursor: pointer; margin: 0;">
                    <input type="checkbox" style="width: 18px; height: 18px; accent-color: var(--primary); cursor: pointer;" />
                    <span style="font-size: 0.95rem; color: #1a202c;">Covered Court A <span style="color: #a0aec0;">(max 600 pax)</span></span>
                  </label>
                  <label style="display: flex; align-items: center; gap: 12px; cursor: pointer; margin: 0;">
                    <input type="checkbox" style="width: 18px; height: 18px; accent-color: var(--primary); cursor: pointer;" />
                    <span style="font-size: 0.95rem; color: #1a202c;">Covered Court B <span style="color: #a0aec0;">(max 600 pax)</span></span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Expected Participants -->
            <div class="form-group" style="margin: 0;">
              <label style="font-size: 0.85rem; color: #1a1a1a; font-weight: 700; margin-bottom: 8px; display: block;">Expected Number of Participants <span style="color: var(--primary);">*</span></label>
              <input type="number" class="form-control" placeholder="Number of participants" style="background: #fff;" />
            </div>
          </div>
        </div>

        <!-- Footer Buttons (Step 2) -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 40px;">
          <button class="btn" style="background: #fff; color: #1a202c; border: 1px solid #e2e8f0; font-weight: 600; padding: 12px 24px; border-radius: 8px; font-size: 0.95rem; display: flex; align-items: center; gap: 8px;" onclick="StudentNewRequest.prevStep()">
            <i class="fas fa-chevron-left" style="font-size: 0.8rem;"></i> Back
          </button>
          <button class="btn" style="background: var(--primary); color: #fff; font-weight: 700; padding: 12px 28px; border-radius: 8px; font-size: 0.95rem; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(233, 53, 88, 0.2);" onclick="StudentNewRequest.nextStep()">
            Next <i class="fas fa-chevron-right" style="font-size: 0.8rem;"></i>
          </button>
        </div>
      </div>

      <!-- STEP 3: Resources & Equipment -->
      <div id="step-section-3" style="display: none;">
        <div class="card" style="padding: 40px; margin-bottom: 30px;">
          <h3 class="serif-title" style="color: var(--primary); font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;">RESOURCES & ICT</h3>
          <p style="color: #718096; font-size: 0.9rem; margin-bottom: 30px;">Select the resources and ICT equipment needed for your activity (GBM Sheet Sections III & IV).</p>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
            <!-- Resources Needed -->
            <div>
              <h4 style="font-size: 0.9rem; color: #2f855a; text-transform: uppercase; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; font-weight: 700;">
                <span style="width: 8px; height: 8px; background: #2f855a; border-radius: 50%; display: inline-block;"></span>
                III — RESOURCES NEEDED
              </h4>
              <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #fff;">
                
                <label style="display: flex; align-items: center; padding: 16px 20px; cursor: pointer; border-bottom: 1px solid #edf2f7; margin: 0; transition: background 0.2s;">
                  <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary); margin-right: 15px;" />
                  <span style="font-size: 0.95rem; color: #1a202c;">Philippine Flag</span>
                  <span style="background: #c6f6d5; color: #22543d; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; margin-left: 10px; font-weight: 600;">2 available</span>
                </label>
                
                <label style="display: flex; align-items: center; padding: 16px 20px; cursor: pointer; border-bottom: 1px solid #edf2f7; margin: 0; transition: background 0.2s;">
                  <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary); margin-right: 15px;" />
                  <span style="font-size: 0.95rem; color: #1a202c;">UNC Flag</span>
                  <span style="background: #c6f6d5; color: #22543d; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; margin-left: 10px; font-weight: 600;">3 available</span>
                </label>

                <label style="display: flex; align-items: center; padding: 16px 20px; cursor: pointer; border-bottom: 1px solid #edf2f7; margin: 0; transition: background 0.2s;">
                  <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary); margin-right: 15px;" />
                  <span style="font-size: 0.95rem; color: #1a202c;">Aeratron</span>
                  <span style="background: #c6f6d5; color: #22543d; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; margin-left: 10px; font-weight: 600;">3 available</span>
                </label>

                <label style="display: flex; align-items: center; padding: 16px 20px; cursor: pointer; border-bottom: 1px solid #edf2f7; margin: 0; transition: background 0.2s;">
                  <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary); margin-right: 15px;" />
                  <span style="font-size: 0.95rem; color: #1a202c;">Rostrum</span>
                  <span style="background: #c6f6d5; color: #22543d; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; margin-left: 10px; font-weight: 600;">2 available</span>
                </label>

                <label style="display: flex; align-items: center; padding: 16px 20px; cursor: pointer; border-bottom: 1px solid #edf2f7; margin: 0; transition: background 0.2s;">
                  <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary); margin-right: 15px;" />
                  <span style="font-size: 0.95rem; color: #1a202c;">Red Carpet</span>
                  <span style="background: #c6f6d5; color: #22543d; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; margin-left: 10px; font-weight: 600;">2 available</span>
                </label>

                <label style="display: flex; align-items: center; padding: 16px 20px; cursor: pointer; border-bottom: 1px solid #edf2f7; margin: 0; transition: background 0.2s;">
                  <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary); margin-right: 15px;" />
                  <span style="font-size: 0.95rem; color: #1a202c;">Standby Generator</span>
                  <span style="background: #c6f6d5; color: #22543d; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; margin-left: 10px; font-weight: 600;">2 available</span>
                </label>

                <label style="display: flex; align-items: center; padding: 16px 20px; cursor: pointer; border-bottom: 1px solid #edf2f7; margin: 0; transition: background 0.2s;">
                  <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary); margin-right: 15px;" />
                  <span style="font-size: 0.95rem; color: #1a202c;">Air Conditioner</span>
                  <span style="background: #c6f6d5; color: #22543d; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; margin-left: 10px; font-weight: 600;">8 available</span>
                </label>

                <label style="display: flex; align-items: center; padding: 16px 20px; cursor: pointer; border-bottom: 1px solid #edf2f7; margin: 0; transition: background 0.2s;">
                  <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary); margin-right: 15px;" />
                  <span style="font-size: 0.95rem; color: #1a202c;">Air Coolers</span>
                </label>

                <label style="display: flex; align-items: center; padding: 16px 20px; cursor: pointer; border-bottom: 1px solid #edf2f7; margin: 0; transition: background 0.2s;">
                  <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary); margin-right: 15px;" />
                  <span style="font-size: 0.95rem; color: #1a202c;">Mako Fan</span>
                  <span style="background: #c6f6d5; color: #22543d; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; margin-left: 10px; font-weight: 600;">15 available</span>
                </label>

                <label style="display: flex; align-items: center; padding: 16px 20px; cursor: pointer; border-bottom: 1px solid #edf2f7; margin: 0; transition: background 0.2s;">
                  <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary); margin-right: 15px;" />
                  <span style="font-size: 0.95rem; color: #1a202c;">Display Boards</span>
                  <span style="background: #c6f6d5; color: #22543d; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; margin-left: 10px; font-weight: 600;">12 available</span>
                </label>

                <label style="display: flex; align-items: center; padding: 16px 20px; cursor: pointer; border-bottom: 1px solid #edf2f7; margin: 0; transition: background 0.2s;">
                  <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary); margin-right: 15px;" />
                  <span style="font-size: 0.95rem; color: #1a202c;">Pavilion Table</span>
                  <span style="background: #c6f6d5; color: #22543d; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; margin-left: 10px; font-weight: 600;">20 available</span>
                </label>

                <label style="display: flex; align-items: center; padding: 16px 20px; cursor: pointer; border-bottom: 1px solid #edf2f7; margin: 0; transition: background 0.2s;">
                  <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary); margin-right: 15px;" />
                  <span style="font-size: 0.95rem; color: #1a202c;">Monobloc Chairs</span>
                  <span style="background: #c6f6d5; color: #22543d; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; margin-left: 10px; font-weight: 600;">200 available</span>
                </label>

                <label style="display: flex; align-items: center; padding: 16px 20px; cursor: pointer; border-bottom: 1px solid #edf2f7; margin: 0; transition: background 0.2s;">
                  <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary); margin-right: 15px;" />
                  <span style="font-size: 0.95rem; color: #1a202c;">Long Table</span>
                  <span style="background: #c6f6d5; color: #22543d; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; margin-left: 10px; font-weight: 600;">30 available</span>
                </label>

                <label style="display: flex; align-items: center; padding: 16px 20px; cursor: pointer; margin: 0; transition: background 0.2s;">
                  <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary); margin-right: 15px;" />
                  <span style="font-size: 0.95rem; color: #1a202c;">Others (Pls. specify)</span>
                </label>
              </div>
            </div>

            <!-- ICT Resources -->
            <div>
              <h4 style="font-size: 0.9rem; color: #3182ce; text-transform: uppercase; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; font-weight: 700;">
                <span style="width: 8px; height: 8px; background: #3182ce; border-radius: 50%; display: inline-block;"></span>
                IV — ICT RESOURCES
              </h4>
              <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #fff;">
                
                <label style="display: flex; align-items: center; padding: 16px 20px; cursor: pointer; border-bottom: 1px solid #edf2f7; margin: 0; transition: background 0.2s;">
                  <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary); margin-right: 15px;" />
                  <span style="font-size: 0.95rem; color: #1a202c;">Sound System</span>
                  <span style="background: #c6f6d5; color: #22543d; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; margin-left: 10px; font-weight: 600;">2 available</span>
                </label>
                
                <label style="display: flex; align-items: center; padding: 16px 20px; cursor: pointer; border-bottom: 1px solid #edf2f7; margin: 0; transition: background 0.2s;">
                  <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary); margin-right: 15px;" />
                  <span style="font-size: 0.95rem; color: #1a202c;">Internet / WIFI</span>
                </label>

                <label style="display: flex; align-items: center; padding: 16px 20px; cursor: pointer; border-bottom: 1px solid #edf2f7; margin: 0; transition: background 0.2s;">
                  <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary); margin-right: 15px;" />
                  <span style="font-size: 0.95rem; color: #1a202c;">Multi-Media Projector</span>
                  <span style="background: #c6f6d5; color: #22543d; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; margin-left: 10px; font-weight: 600;">5 available</span>
                </label>

                <label style="display: flex; align-items: center; padding: 16px 20px; cursor: pointer; border-bottom: 1px solid #edf2f7; margin: 0; transition: background 0.2s;">
                  <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary); margin-right: 15px;" />
                  <span style="font-size: 0.95rem; color: #1a202c;">LED Wall (to be approved by NSTP)</span>
                </label>

                <label style="display: flex; align-items: center; padding: 16px 20px; cursor: pointer; border-bottom: 1px solid #edf2f7; margin: 0; transition: background 0.2s;">
                  <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary); margin-right: 15px;" />
                  <span style="font-size: 0.95rem; color: #1a202c;">Microphones</span>
                </label>

                <label style="display: flex; align-items: center; padding: 16px 20px; cursor: pointer; border-bottom: 1px solid #edf2f7; margin: 0; transition: background 0.2s;">
                  <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary); margin-right: 15px;" />
                  <span style="font-size: 0.95rem; color: #1a202c;">Computer(s)</span>
                </label>

                <label style="display: flex; align-items: center; padding: 16px 20px; cursor: pointer; border-bottom: 1px solid #edf2f7; margin: 0; transition: background 0.2s;">
                  <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary); margin-right: 15px;" />
                  <span style="font-size: 0.95rem; color: #1a202c;">Printer(s)</span>
                </label>

                <label style="display: flex; align-items: center; padding: 16px 20px; cursor: pointer; border-bottom: 1px solid #edf2f7; margin: 0; transition: background 0.2s;">
                  <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary); margin-right: 15px;" />
                  <span style="font-size: 0.95rem; color: #1a202c;">Projection Screen</span>
                  <span style="background: #c6f6d5; color: #22543d; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; margin-left: 10px; font-weight: 600;">4 available</span>
                </label>

                <label style="display: flex; align-items: center; padding: 16px 20px; cursor: pointer; margin: 0; transition: background 0.2s;">
                  <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary); margin-right: 15px;" />
                  <span style="font-size: 0.95rem; color: #1a202c;">Others (Pls. specify)</span>
                </label>

              </div>
            </div>
          </div>

          <!-- Layout Section -->
          <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
            <h4 class="serif-title" style="color: var(--primary); text-transform: uppercase; font-size: 0.95rem; margin-bottom: 10px; letter-spacing: 0.05em;">LAYOUT OF TABLES AND CHAIRS</h4>
            <p style="font-size: 0.85rem; color: #4a5568; margin-bottom: 4px;">In case there is a prescribed arrangement of the requested facilities, please attach a proposed layout or describe it below.</p>
            <p style="font-size: 0.8rem; color: #718096; font-style: italic; margin-bottom: 24px;">(Please indicate the location of the stage if applicable)</p>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
              <!-- Upload Area -->
              <div>
                <label style="font-size: 0.85rem; color: #1a1a1a; font-weight: 700; margin-bottom: 10px; display: block;">Upload Layout (Optional)</label>
                <label style="border: 2px dashed #cbd5e0; border-radius: 8px; padding: 30px 20px; text-align: center; background: #fff; cursor: pointer; display: block; transition: border-color 0.2s;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='#cbd5e0'">
                  <i class="fas fa-file-upload" style="font-size: 1.5rem; color: #a0aec0; margin-bottom: 12px; display: block;"></i>
                  <span style="display: block; color: #3182ce; font-weight: 600; font-size: 0.9rem; margin-bottom: 8px;">Click to upload a file</span>
                  <span style="display: block; color: #718096; font-size: 0.75rem;">PNG, JPG, or PDF (Max 5MB)</span>
                  <input type="file" style="display: none;" accept=".png,.jpg,.jpeg,.pdf" />
                </label>
              </div>

              <!-- Text Area -->
              <div>
                <label style="font-size: 0.85rem; color: #1a1a1a; font-weight: 700; margin-bottom: 10px; display: block;">Layout Description (Optional)</label>
                <textarea class="form-control" placeholder="Describe how you want the tables, chairs, and stage arranged..." style="background: #fff; height: 135px; resize: none;"></textarea>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer Buttons (Step 3) -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 40px;">
          <button class="btn" style="background: #fff; color: #1a202c; border: 1px solid #e2e8f0; font-weight: 600; padding: 12px 24px; border-radius: 8px; font-size: 0.95rem; display: flex; align-items: center; gap: 8px;" onclick="StudentNewRequest.prevStep()">
            <i class="fas fa-chevron-left" style="font-size: 0.8rem;"></i> Back
          </button>
          <button class="btn" style="background: var(--primary); color: #fff; font-weight: 700; padding: 12px 28px; border-radius: 8px; font-size: 0.95rem; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(233, 53, 88, 0.2);" onclick="StudentNewRequest.nextStep()">
            Next <i class="fas fa-chevron-right" style="font-size: 0.8rem;"></i>
          </button>
        </div>
      </div>

      <!-- STEP 4: Personnel Services -->
      <div id="step-section-4" style="display: none;">
        <div class="card" style="padding: 40px; margin-bottom: 30px;">
          
          <!-- Personnel Services Section -->
          <h3 class="serif-title" style="color: var(--primary); font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;">PERSONNEL SERVICES</h3>
          <p style="color: #718096; font-size: 0.9rem; margin-bottom: 25px;">Select required staff and support services</p>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 40px;">
            <label style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 20px; display: flex; align-items: center; gap: 12px; cursor: pointer; background: #fff; transition: border-color 0.2s;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='#e2e8f0'">
              <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary);" />
              <span style="font-size: 0.95rem; color: #1a202c;">Janitorial</span>
            </label>
            <label style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 20px; display: flex; align-items: center; gap: 12px; cursor: pointer; background: #fff; transition: border-color 0.2s;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='#e2e8f0'">
              <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary);" />
              <span style="font-size: 0.95rem; color: #1a202c;">Security</span>
            </label>
            <label style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 20px; display: flex; align-items: center; gap: 12px; cursor: pointer; background: #fff; transition: border-color 0.2s;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='#e2e8f0'">
              <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary);" />
              <span style="font-size: 0.95rem; color: #1a202c;">ICT Technician</span>
            </label>
            <label style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 20px; display: flex; align-items: center; gap: 12px; cursor: pointer; background: #fff; transition: border-color 0.2s;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='#e2e8f0'">
              <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary);" />
              <span style="font-size: 0.95rem; color: #1a202c;">Electricians</span>
            </label>
            <label style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 20px; display: flex; align-items: center; gap: 12px; cursor: pointer; background: #fff; transition: border-color 0.2s;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='#e2e8f0'">
              <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary);" />
              <span style="font-size: 0.95rem; color: #1a202c;">Operators</span>
            </label>
            <label style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 20px; display: flex; align-items: center; gap: 12px; cursor: pointer; background: #fff; transition: border-color 0.2s;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='#e2e8f0'">
              <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary);" />
              <span style="font-size: 0.95rem; color: #1a202c;">Sound System Operator</span>
            </label>
            <label style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 20px; display: flex; align-items: center; gap: 12px; cursor: pointer; background: #fff; transition: border-color 0.2s;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='#e2e8f0'">
              <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary);" />
              <span style="font-size: 0.95rem; color: #1a202c;">Generator Set Operator</span>
            </label>
          </div>

          <!-- Social / Special Services Section -->
          <h3 class="serif-title" style="color: var(--primary); font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;">SOCIAL / SPECIAL SERVICES</h3>
          <p style="color: #718096; font-size: 0.9rem; margin-bottom: 25px;">Additional services required for the event (e.g., performances, colours, transport)</p>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <label style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 20px; display: flex; align-items: center; gap: 12px; cursor: pointer; background: #fff; transition: border-color 0.2s;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='#e2e8f0'">
              <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary);" />
              <span style="font-size: 0.95rem; color: #1a202c;">Glee Club</span>
            </label>
            <label style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 20px; display: flex; align-items: center; gap: 12px; cursor: pointer; background: #fff; transition: border-color 0.2s;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='#e2e8f0'">
              <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary);" />
              <span style="font-size: 0.95rem; color: #1a202c;">H/S Majorettes</span>
            </label>
            <label style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 20px; display: flex; align-items: center; gap: 12px; cursor: pointer; background: #fff; transition: border-color 0.2s;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='#e2e8f0'">
              <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary);" />
              <span style="font-size: 0.95rem; color: #1a202c;">College Band</span>
            </label>
            <label style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 20px; display: flex; align-items: center; gap: 12px; cursor: pointer; background: #fff; transition: border-color 0.2s;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='#e2e8f0'">
              <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary);" />
              <span style="font-size: 0.95rem; color: #1a202c;">CAT/ROTC Colors</span>
            </label>
            <label style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 20px; display: flex; align-items: center; gap: 12px; cursor: pointer; background: #fff; transition: border-color 0.2s;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='#e2e8f0'">
              <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary);" />
              <span style="font-size: 0.95rem; color: #1a202c;">H/S DXMC</span>
            </label>
            <label style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 20px; display: flex; align-items: center; gap: 12px; cursor: pointer; background: #fff; transition: border-color 0.2s;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='#e2e8f0'">
              <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary);" />
              <span style="font-size: 0.95rem; color: #1a202c;">College Majorettes</span>
            </label>
            <label style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 20px; display: flex; align-items: center; gap: 12px; cursor: pointer; background: #fff; transition: border-color 0.2s;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='#e2e8f0'">
              <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--primary);" />
              <span style="font-size: 0.95rem; color: #1a202c;">Van (to be approved by VPAAS)</span>
            </label>
          </div>

        </div>

        <!-- Footer Buttons (Step 4) -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 40px;">
          <button class="btn" style="background: #fff; color: #1a202c; border: 1px solid #e2e8f0; font-weight: 600; padding: 12px 24px; border-radius: 8px; font-size: 0.95rem; display: flex; align-items: center; gap: 8px;" onclick="StudentNewRequest.prevStep()">
            <i class="fas fa-chevron-left" style="font-size: 0.8rem;"></i> Back
          </button>
          <button class="btn" style="background: var(--primary); color: #fff; font-weight: 700; padding: 12px 28px; border-radius: 8px; font-size: 0.95rem; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(233, 53, 88, 0.2);" onclick="StudentNewRequest.nextStep()">
            Next <i class="fas fa-chevron-right" style="font-size: 0.8rem;"></i>
          </button>
        </div>
      </div>

      <!-- STEP 5: Review & Submit -->
      <div id="step-section-5" style="display: none;">
        <div class="card" style="padding: 40px; margin-bottom: 30px;">
          
          <h3 class="serif-title" style="color: var(--primary); font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;">REVIEW & SUBMIT</h3>
          <p style="color: #718096; font-size: 0.9rem; margin-bottom: 30px;">Please review your request before submitting</p>

          <!-- 1 Activity Details -->
          <div style="margin-bottom: 25px;">
            <h4 style="font-size: 0.95rem; color: #1a202c; text-transform: uppercase; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; font-weight: 600;">
              <span style="width: 24px; height: 24px; background: #38a169; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700;">1</span>
              ACTIVITY DETAILS
            </h4>
            <div style="background: #f8fafc; border-radius: 8px; padding: 25px; display: flex; flex-direction: column; gap: 12px;">
              <div style="display: grid; grid-template-columns: 200px 1fr; gap: 20px;">
                <span style="color: #718096; font-size: 0.9rem;">Activity Type:</span>
                <span id="summary-activity-type" style="color: #1a202c; font-size: 0.95rem; font-weight: 500;">-</span>
              </div>
              <div style="display: grid; grid-template-columns: 200px 1fr; gap: 20px;">
                <span style="color: #718096; font-size: 0.9rem;">Event Name:</span>
                <span id="summary-event-name" style="color: #1a202c; font-size: 0.95rem; font-weight: 500;">-</span>
              </div>
              <div style="display: grid; grid-template-columns: 200px 1fr; gap: 20px;">
                <span style="color: #718096; font-size: 0.9rem;">Date(s):</span>
                <span id="summary-date" style="color: #1a202c; font-size: 0.95rem; font-weight: 500;">-</span>
              </div>
              <div style="display: grid; grid-template-columns: 200px 1fr; gap: 20px;">
                <span style="color: #718096; font-size: 0.9rem;">Time:</span>
                <span id="summary-time" style="color: #1a202c; font-size: 0.95rem; font-weight: 500;">-</span>
              </div>
              <div style="display: grid; grid-template-columns: 200px 1fr; gap: 20px;">
                <span style="color: #718096; font-size: 0.9rem;">Department:</span>
                <span id="summary-department" style="color: #1a202c; font-size: 0.95rem; font-weight: 500;">-</span>
              </div>
              <div style="display: grid; grid-template-columns: 200px 1fr; gap: 20px; border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 4px;">
                <span style="color: #718096; font-size: 0.9rem;">Program Details:</span>
                <span id="summary-program-details" style="color: #1a202c; font-size: 0.95rem; font-weight: 500;">-</span>
              </div>
            </div>
          </div>

          <!-- 2 Venue & Attendees -->
          <div style="margin-bottom: 25px;">
            <h4 style="font-size: 0.95rem; color: #1a202c; text-transform: uppercase; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; font-weight: 600;">
              <span style="width: 24px; height: 24px; background: #38a169; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700;">2</span>
              VENUE & ATTENDEES
            </h4>
            <div style="background: #f8fafc; border-radius: 8px; padding: 25px; display: flex; flex-direction: column; gap: 12px;">
              <div style="display: grid; grid-template-columns: 200px 1fr; gap: 20px;">
                <span style="color: #718096; font-size: 0.9rem;">Venue:</span>
                <span id="summary-venue" style="color: #1a202c; font-size: 0.95rem; font-weight: 500;">-</span>
              </div>
              <div style="display: grid; grid-template-columns: 200px 1fr; gap: 20px;">
                <span style="color: #718096; font-size: 0.9rem;">Expected Attendees:</span>
                <span id="summary-attendees" style="color: #1a202c; font-size: 0.95rem; font-weight: 500;">-</span>
              </div>
            </div>
          </div>

          <!-- 3 Resources & Equipment -->
          <div style="margin-bottom: 25px;">
            <h4 style="font-size: 0.95rem; color: #1a202c; text-transform: uppercase; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; font-weight: 600;">
              <span style="width: 24px; height: 24px; background: #38a169; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700;">3</span>
              RESOURCES & EQUIPMENT
            </h4>
            <div id="summary-resources" style="background: #f8fafc; border-radius: 8px; padding: 25px;">
              <span style="color: #a0aec0; font-size: 0.9rem; font-style: italic;">No resources or ICT selected</span>
            </div>
          </div>

          <!-- 4 Personnel Services -->
          <div style="margin-bottom: 30px;">
            <h4 style="font-size: 0.95rem; color: #1a202c; text-transform: uppercase; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; font-weight: 600;">
              <span style="width: 24px; height: 24px; background: #38a169; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700;">4</span>
              PERSONNEL SERVICES
            </h4>
            <div id="summary-personnel" style="background: #f8fafc; border-radius: 8px; padding: 25px; min-height: 40px;">
              <span style="color: #a0aec0; font-size: 0.9rem; font-style: italic;">No personnel services selected</span>
            </div>
          </div>

          <!-- Agreement Section -->
          <div style="background: #fff5f5; border: 1px solid #fed7d7; border-radius: 8px; padding: 20px 25px; display: flex; align-items: flex-start; gap: 15px;">
            <input type="checkbox" id="agreement-checkbox" onchange="StudentNewRequest.toggleSubmitBtn(this)" style="width: 18px; height: 18px; accent-color: var(--primary); margin-top: 3px;" />
            <div>
              <p style="color: #1a202c; font-size: 0.95rem; font-weight: 600; margin-bottom: 4px;">
                I have read and agree to the <a href="#" style="color: var(--primary); text-decoration: none;">General Guidelines for University Activities</a>.
              </p>
              <p style="color: #718096; font-size: 0.85rem; margin: 0;">You must agree to these guidelines to submit your request.</p>
            </div>
          </div>

        </div>

        <!-- Footer Buttons (Step 5) -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 40px;">
          <button class="btn" style="background: #fff; color: #1a202c; border: 1px solid #e2e8f0; font-weight: 600; padding: 12px 24px; border-radius: 8px; font-size: 0.95rem; display: flex; align-items: center; gap: 8px;" onclick="StudentNewRequest.prevStep()">
            <i class="fas fa-chevron-left" style="font-size: 0.8rem;"></i> Back
          </button>
          <button id="submit-request-btn" class="btn" style="background: #68d391; color: #fff; font-weight: 700; padding: 12px 28px; border-radius: 8px; font-size: 0.95rem; display: flex; align-items: center; gap: 8px; border: none; box-shadow: 0 4px 12px rgba(104, 211, 145, 0.3); opacity: 0.5; cursor: not-allowed; pointer-events: none;" onclick="StudentNewRequest.submitRequest()">
            <i class="fas fa-check" style="font-size: 0.9rem;"></i> Submit Request
          </button>
        </div>
      </div>
      
    `;

    Components.renderShell(user, 'student/new-request', 'New Request', 'Submit a new facility reservation', content);

    setTimeout(() => {
      updateStepView();
    }, 0);
  }

  function toggleSubmitBtn(checkbox) {
    const btn = document.getElementById('submit-request-btn');
    if (btn) {
      if (checkbox.checked) {
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        btn.style.pointerEvents = 'auto';
        btn.style.background = '#16a34a'; // Darker green as requested
        btn.style.boxShadow = '0 4px 12px rgba(22, 163, 74, 0.3)';
      } else {
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
        btn.style.pointerEvents = 'none';
        btn.style.background = '#68d391'; // Lighter green for disabled state
        btn.style.boxShadow = '0 4px 12px rgba(104, 211, 145, 0.3)';
      }
    }
  }

  function submitRequest() {
    const user = Auth.current();
    if (!user) {
      Components.toast('You must be logged in to submit a request.', 'error');
      return;
    }

    const eventName = document.getElementById('summary-event-name').innerText;
    const activityType = document.getElementById('summary-activity-type').innerText;
    const dateStr = document.getElementById('summary-date').innerText;
    const timeStr = document.getElementById('summary-time').innerText;
    const venue = document.getElementById('summary-venue').innerText;
    const department = document.getElementById('summary-department').innerText;
    const attendees = document.getElementById('summary-attendees').innerText;

    let startTime = '08:00';
    let endTime = '17:00';
    if (timeStr && timeStr !== 'Not specified' && timeStr.includes('-')) {
      const parts = timeStr.split('-');
      startTime = parts[0].trim();
      endTime = parts[1].trim();
    }

    // Prepare data
    const requestData = {
      title: eventName !== 'Not specified' ? eventName : 'New Facility Request',
      facilityId: venue !== 'Not specified' ? venue : 'General Venue',
      facilityName: venue !== 'Not specified' ? venue : 'General Venue',
      date: dateStr !== 'Not specified' ? dateStr : new Date().toISOString().split('T')[0],
      startTime: startTime,
      endTime: endTime,
      type: activityType,
      department: department,
      attendees: parseInt(attendees) || 0,
      purpose: document.getElementById('summary-program-details').innerText,
      eventName: eventName !== 'Not specified' ? eventName : 'Facility Request'
    };

    try {
      // Save to both Reservations and Events stores to ensure it shows up in all relevant student dashboards
      Store.Reservations.create(requestData, user);
      Store.Events.create(requestData, user);
      Components.toast('Request submitted successfully!', 'success');

      // Navigate to dashboard which typically acts as "My Requests" for students
      Router.navigate('student/dashboard');
    } catch (e) {
      console.error("Failed to submit request:", e);
      Components.toast('Failed to submit request. Please try again.', 'error');
    }
  }

  return { render, toggleBehalf, showGuidelines, toggleSuspension, toggleExternal, addPersonRow, removePersonRow, nextStep, prevStep, toggleVenueDropdown, filterVenues, selectVenue, updateSpecificVenues, toggleSubmitBtn, submitRequest };
})();
