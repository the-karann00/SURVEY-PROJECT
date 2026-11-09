/**
 * ==============================================================================
 * SIMPLE ONLINE SURVEY CREATOR - JAVASCRIPT (script.js)
 * Clean, Modular, Framework-Free Vanilla JavaScript
 * Suitable for BTech CSE College Project Demonstration
 * ==============================================================================
 */

// Global Storage Keys
const STORAGE_KEYS = {
  SURVEYS: 'survey_app_surveys',
  RESPONSES: 'survey_app_responses',
  ADMIN_AUTH: 'survey_app_admin_auth',
  SUBMISSIONS_PREFIX: 'survey_submitted_'
};

/**
 * Default Sample Surveys (Surveys A, B, and C as required)
 * Preloaded automatically on first visit or when clicking 'Reset Demo Data'.
 */
const DEFAULT_SURVEYS = [
  {
    id: "survey_a",
    title: "Student Feedback About Teaching",
    description: "Please provide your honest feedback regarding teaching methods, classroom interactivity, and doubt resolution.",
    status: "Published",
    createdAt: "2026-11-01",
    questions: [
      {
        id: "q_a1",
        text: "Which subject are you studying?",
        type: "short_text",
        required: true
      },
      {
        id: "q_a2",
        text: "How clearly does the teacher explain the topics?",
        type: "rating",
        required: true
      },
      {
        id: "q_a3",
        text: "Does the teacher provide practical examples?",
        type: "yes_no",
        required: true
      },
      {
        id: "q_a4",
        text: "How interactive are the classes?",
        type: "multiple_choice",
        options: ["Very interactive", "Interactive", "Average", "Not interactive"],
        required: true
      },
      {
        id: "q_a5",
        text: "Are your doubts resolved during class?",
        type: "yes_no",
        required: true
      },
      {
        id: "q_a6",
        text: "Which teaching method do you prefer?",
        type: "multiple_choice",
        options: ["Blackboard", "PPT presentation", "Live coding/demonstration", "Group activities"],
        required: true
      },
      {
        id: "q_a7",
        text: "What improvements would you suggest for the class?",
        type: "long_text",
        required: false
      }
    ]
  },
  {
    id: "survey_b",
    title: "College Campus Feedback",
    description: "Help the administration improve campus amenities, library resources, and digital infrastructure.",
    status: "Published",
    createdAt: "2026-11-02",
    questions: [
      {
        id: "q_b1",
        text: "How satisfied are you with college facilities?",
        type: "rating",
        required: true
      },
      {
        id: "q_b2",
        text: "How would you rate classroom cleanliness?",
        type: "multiple_choice",
        options: ["Excellent", "Good", "Average", "Poor"],
        required: true
      },
      {
        id: "q_b3",
        text: "Are library resources sufficient?",
        type: "yes_no",
        required: true
      },
      {
        id: "q_b4",
        text: "How satisfied are you with internet connectivity?",
        type: "rating",
        required: true
      },
      {
        id: "q_b5",
        text: "What improvements would you suggest?",
        type: "long_text",
        required: false
      }
    ]
  },
  {
    id: "survey_c",
    title: "Student Technology Preferences",
    description: "An exploratory survey to understand students' coding habits, domain interests, and preferred learning paths.",
    status: "Published",
    createdAt: "2026-11-03",
    questions: [
      {
        id: "q_c1",
        text: "Which programming language do you prefer?",
        type: "multiple_choice",
        options: ["C", "C++", "Java", "Python", "JavaScript", "Other"],
        required: true
      },
      {
        id: "q_c2",
        text: "How often do you practice coding?",
        type: "multiple_choice",
        options: ["Daily", "Several times a week", "Occasionally", "Rarely"],
        required: true
      },
      {
        id: "q_c3",
        text: "Which area interests you most?",
        type: "multiple_choice",
        options: ["Web Development", "Artificial Intelligence", "Cybersecurity", "App Development", "Data Science"],
        required: true
      },
      {
        id: "q_c4",
        text: "Which learning method helps you most?",
        type: "multiple_choice",
        options: ["YouTube", "Online courses", "Books/notes", "Practical projects", "Classroom teaching"],
        required: true
      }
    ]
  }
];

/**
 * Pre-seeded sample responses for Survey A and Survey B
 * Allows the results dashboard to show rich analytics immediately.
 */
const DEFAULT_RESPONSES = [
  {
    responseId: "resp_101",
    surveyId: "survey_a",
    submittedAt: "2026-11-03 10:15 AM",
    answers: {
      "q_a1": "Data Structures & Algorithms",
      "q_a2": 5,
      "q_a3": "Yes",
      "q_a4": "Very interactive",
      "q_a5": "Yes",
      "q_a6": "Live coding/demonstration",
      "q_a7": "More hands-on coding sessions would be wonderful!"
    }
  },
  {
    responseId: "resp_102",
    surveyId: "survey_a",
    submittedAt: "2026-11-03 02:40 PM",
    answers: {
      "q_a1": "Database Management Systems",
      "q_a2": 4,
      "q_a3": "Yes",
      "q_a4": "Interactive",
      "q_a5": "Yes",
      "q_a6": "PPT presentation",
      "q_a7": "Upload the lecture slides before each class."
    }
  },
  {
    responseId: "resp_103",
    surveyId: "survey_a",
    submittedAt: "2026-11-04 11:20 AM",
    answers: {
      "q_a1": "Operating Systems",
      "q_a2": 4,
      "q_a3": "No",
      "q_a4": "Average",
      "q_a5": "No",
      "q_a6": "Live coding/demonstration",
      "q_a7": "Please slow down during the CPU scheduling algorithms."
    }
  },
  {
    responseId: "resp_201",
    surveyId: "survey_b",
    submittedAt: "2026-11-03 04:10 PM",
    answers: {
      "q_b1": 4,
      "q_b2": "Good",
      "q_b3": "Yes",
      "q_b4": 3,
      "q_b5": "Wi-Fi speeds in the reading room need an upgrade."
    }
  },
  {
    responseId: "resp_202",
    surveyId: "survey_b",
    submittedAt: "2026-11-04 09:30 AM",
    answers: {
      "q_b1": 5,
      "q_b2": "Excellent",
      "q_b3": "Yes",
      "q_b4": 4,
      "q_b5": "Canteen food quality has improved significantly."
    }
  }
];

/* ==============================================================================
   DATA STORAGE HELPER FUNCTIONS (LocalStorage API)
   ============================================================================== */

/**
 * Retrieve surveys from localStorage. If empty, seeds default surveys.
 */
function getSurveys() {
  const data = localStorage.getItem(STORAGE_KEYS.SURVEYS);
  if (!data) {
    saveSurveys(DEFAULT_SURVEYS);
    return DEFAULT_SURVEYS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Error parsing surveys from localStorage:", e);
    return DEFAULT_SURVEYS;
  }
}

/**
 * Save an array of surveys to localStorage
 */
function saveSurveys(surveys) {
  localStorage.setItem(STORAGE_KEYS.SURVEYS, JSON.stringify(surveys));
}

/**
 * Retrieve all responses from localStorage. If empty, seeds default responses.
 */
function getResponses() {
  const data = localStorage.getItem(STORAGE_KEYS.RESPONSES);
  if (!data) {
    saveResponses(DEFAULT_RESPONSES);
    return DEFAULT_RESPONSES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Error parsing responses from localStorage:", e);
    return DEFAULT_RESPONSES;
  }
}

/**
 * Save an array of responses to localStorage
 */
function saveResponses(responses) {
  localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(responses));
}

/**
 * Check if the current browser has already submitted a response for a survey
 */
function hasSubmittedSurvey(surveyId) {
  return localStorage.getItem(STORAGE_KEYS.SUBMISSIONS_PREFIX + surveyId) === 'true';
}

/**
 * Mark a survey as submitted on this browser to prevent duplicate entries
 */
function markSurveySubmitted(surveyId) {
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS_PREFIX + surveyId, 'true');
}

/**
 * Reset all application data back to default demo surveys and sample responses
 */
function resetAllData() {
  localStorage.setItem(STORAGE_KEYS.SURVEYS, JSON.stringify(DEFAULT_SURVEYS));
  localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(DEFAULT_RESPONSES));
  
  // Clear any browser submission restrictions
  for (let key in localStorage) {
    if (key.startsWith(STORAGE_KEYS.SUBMISSIONS_PREFIX)) {
      localStorage.removeItem(key);
    }
  }
}

/**
 * Safely escape HTML to prevent XSS attacks when displaying user inputs
 */
function escapeHTML(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* ==============================================================================
   PUBLIC STUDENT PORTAL LOGIC (index.html)
   ============================================================================== */

let activeTakingSurvey = null;

/**
 * Initialize public portal view
 */
function initPublicPortal() {
  const surveysGrid = document.getElementById('surveys-grid');
  if (!surveysGrid) return; // Exit if not on index.html

  updatePublicStats();
  renderPublicSurveys();

  // Attach navigation listeners
  const btnBack = document.getElementById('btn-back-to-surveys');
  if (btnBack) btnBack.addEventListener('click', showSurveysListSection);

  const btnCancel = document.getElementById('btn-cancel-survey');
  if (btnCancel) btnCancel.addEventListener('click', showSurveysListSection);

  const btnSuccessHome = document.getElementById('btn-success-home');
  if (btnSuccessHome) btnSuccessHome.addEventListener('click', showSurveysListSection);

  const btnAlreadyBack = document.getElementById('btn-already-back');
  if (btnAlreadyBack) btnAlreadyBack.addEventListener('click', showSurveysListSection);

  // Attach form submission handler
  const surveyForm = document.getElementById('survey-taking-form');
  if (surveyForm) {
    surveyForm.addEventListener('submit', handleSurveySubmission);
  }
}

/**
 * Update the public homepage stats counter
 */
function updatePublicStats() {
  const surveys = getSurveys();
  const responses = getResponses();

  const publishedCount = surveys.filter(s => s.status === 'Published').length;

  const statSurveys = document.getElementById('public-stat-surveys');
  const statResponses = document.getElementById('public-stat-responses');

  if (statSurveys) statSurveys.textContent = publishedCount;
  if (statResponses) statResponses.textContent = responses.length;
}

/**
 * Render all published surveys onto the homepage grid
 */
function renderPublicSurveys() {
  const container = document.getElementById('surveys-grid');
  if (!container) return;

  const surveys = getSurveys();
  const responses = getResponses();

  const publishedSurveys = surveys.filter(s => s.status === 'Published');

  if (publishedSurveys.length === 0) {
    container.innerHTML = `
      <div class="card text-center" style="grid-column: 1 / -1; padding: 3rem;">
        <h3>No Surveys Currently Available</h3>
        <p class="text-muted" style="margin-top: 0.5rem;">
          There are no published surveys open for submissions at this time.
        </p>
        <div style="margin-top: 1.5rem;">
          <a href="admin.html" class="btn btn-primary">Go to Admin Portal</a>
        </div>
      </div>
    `;
    return;
  }

  let html = '';
  publishedSurveys.forEach(survey => {
    const surveyResponses = responses.filter(r => r.surveyId === survey.id).length;
    const isSubmitted = hasSubmittedSurvey(survey.id);

    html += `
      <div class="card survey-card">
        <div>
          <div class="survey-card-header">
            <h3 class="survey-card-title">${escapeHTML(survey.title)}</h3>
            <span class="badge badge-published">Published</span>
          </div>
          <p class="survey-card-desc">${escapeHTML(survey.description || 'No description provided.')}</p>
        </div>

        <div>
          <div class="survey-card-meta">
            <span>📝 ${survey.questions.length} Questions</span>
            <span>👥 ${surveyResponses} Responses</span>
          </div>
          <div class="survey-card-footer">
            ${isSubmitted ? `
              <button class="btn btn-outline btn-block" onclick="openSurveyTaker('${survey.id}')">
                Completed (Check Status)
              </button>
            ` : `
              <button class="btn btn-primary btn-block" onclick="openSurveyTaker('${survey.id}')">
                Take Survey →
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/**
 * Open the survey taking form or show 'Already Submitted' message
 */
function openSurveyTaker(surveyId) {
  const surveys = getSurveys();
  const survey = surveys.find(s => s.id === surveyId);
  if (!survey) return;

  // Check if student already submitted this survey on this browser
  if (hasSubmittedSurvey(surveyId)) {
    hideAllPublicViews();
    document.getElementById('survey-already-submitted-view').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  activeTakingSurvey = survey;

  // Set survey metadata
  document.getElementById('taker-survey-title').textContent = survey.title;
  document.getElementById('taker-survey-desc').textContent = survey.description || '';
  document.getElementById('taker-survey-status').textContent = survey.status;

  // Clear previous validation error alert
  document.getElementById('survey-validation-error').classList.add('hidden');

  // Build Question Elements dynamically
  const questionsContainer = document.getElementById('survey-questions-container');
  questionsContainer.innerHTML = '';

  survey.questions.forEach((q, index) => {
    const questionCard = document.createElement('div');
    questionCard.className = 'question-taker-card';
    questionCard.id = `taker-card-${q.id}`;

    let inputMarkup = '';

    switch (q.type) {
      case 'short_text':
        inputMarkup = `
          <input type="text" name="question_${q.id}" id="input_${q.id}" class="form-control" 
            placeholder="Type your answer here..." ${q.required ? 'data-required="true"' : ''}>
        `;
        break;

      case 'long_text':
        inputMarkup = `
          <textarea name="question_${q.id}" id="input_${q.id}" class="form-control" rows="3" 
            placeholder="Type your response here..." ${q.required ? 'data-required="true"' : ''}></textarea>
        `;
        break;

      case 'multiple_choice':
        inputMarkup = `<div class="options-group">`;
        (q.options || []).forEach((opt, optIndex) => {
          const radioId = `radio_${q.id}_${optIndex}`;
          inputMarkup += `
            <label class="option-item-label" for="${radioId}">
              <input type="radio" name="question_${q.id}" id="${radioId}" value="${escapeHTML(opt)}" 
                ${q.required ? 'data-required="true"' : ''}>
              <span>${escapeHTML(opt)}</span>
            </label>
          `;
        });
        inputMarkup += `</div>`;
        break;

      case 'checkbox':
        inputMarkup = `<div class="options-group">`;
        (q.options || []).forEach((opt, optIndex) => {
          const checkId = `check_${q.id}_${optIndex}`;
          inputMarkup += `
            <label class="option-item-label" for="${checkId}">
              <input type="checkbox" name="question_${q.id}" id="${checkId}" value="${escapeHTML(opt)}" 
                data-group="${q.id}" ${q.required ? 'data-required="true"' : ''}>
              <span>${escapeHTML(opt)}</span>
            </label>
          `;
        });
        inputMarkup += `</div>`;
        break;

      case 'yes_no':
        inputMarkup = `
          <div class="yes-no-group">
            <div class="yes-no-btn">
              <label class="yes-no-label" id="label_yn_${q.id}_yes">
                <input type="radio" name="question_${q.id}" value="Yes" 
                  onchange="handleYesNoChange('${q.id}', 'Yes')" ${q.required ? 'data-required="true"' : ''}>
                <span>👍 Yes</span>
              </label>
            </div>
            <div class="yes-no-btn">
              <label class="yes-no-label" id="label_yn_${q.id}_no">
                <input type="radio" name="question_${q.id}" value="No" 
                  onchange="handleYesNoChange('${q.id}', 'No')" ${q.required ? 'data-required="true"' : ''}>
                <span>👎 No</span>
              </label>
            </div>
          </div>
        `;
        break;

      case 'rating':
        inputMarkup = `
          <div class="rating-group">
            ${[1, 2, 3, 4, 5].map(val => `
              <div class="rating-option">
                <label class="rating-label" id="label_rating_${q.id}_${val}">
                  <input type="radio" name="question_${q.id}" value="${val}" 
                    onchange="handleRatingChange('${q.id}', ${val})" ${q.required ? 'data-required="true"' : ''}>
                  ${val}
                </label>
              </div>
            `).join('')}
          </div>
          <div class="rating-scale-legend">
            <span>1 = Poor / Low</span>
            <span>5 = Excellent / High</span>
          </div>
        `;
        break;

      default:
        inputMarkup = `<input type="text" name="question_${q.id}" class="form-control">`;
    }

    questionCard.innerHTML = `
      <div class="question-header">
        <span class="question-number-badge">${index + 1}</span>
        <div class="question-prompt">
          ${escapeHTML(q.text)}
          ${q.required ? '<span class="required-star">*</span>' : ''}
        </div>
      </div>
      <div class="question-input-wrapper">
        ${inputMarkup}
      </div>
    `;

    questionsContainer.appendChild(questionCard);
  });

  // Switch to Survey Taking View
  hideAllPublicViews();
  document.getElementById('survey-taker-view').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Visual styling update for Rating 1-5 selection
 */
function handleRatingChange(qId, selectedVal) {
  for (let i = 1; i <= 5; i++) {
    const lbl = document.getElementById(`label_rating_${qId}_${i}`);
    if (lbl) {
      if (i === selectedVal) {
        lbl.classList.add('selected');
      } else {
        lbl.classList.remove('selected');
      }
    }
  }
}

/**
 * Visual styling update for Yes/No toggle selection
 */
function handleYesNoChange(qId, choice) {
  const lblYes = document.getElementById(`label_yn_${qId}_yes`);
  const lblNo = document.getElementById(`label_yn_${qId}_no`);

  if (choice === 'Yes') {
    if (lblYes) lblYes.classList.add('selected');
    if (lblNo) lblNo.classList.remove('selected');
  } else {
    if (lblNo) lblNo.classList.add('selected');
    if (lblYes) lblYes.classList.remove('selected');
  }
}

/**
 * Validate and submit user survey responses
 */
function handleSurveySubmission(e) {
  e.preventDefault();
  if (!activeTakingSurvey) return;

  const form = document.getElementById('survey-taking-form');
  const errorAlert = document.getElementById('survey-validation-error');
  let isValid = true;
  let firstErrorCard = null;

  // Clear previous error styles
  document.querySelectorAll('.question-taker-card').forEach(card => card.classList.remove('has-error'));

  const collectedAnswers = {};

  // Validate each question according to rules
  for (let q of activeTakingSurvey.questions) {
    const fieldName = `question_${q.id}`;

    if (q.type === 'short_text' || q.type === 'long_text') {
      const inputEl = form.elements[fieldName];
      const val = inputEl ? inputEl.value.trim() : '';

      if (q.required && val === '') {
        isValid = false;
        markQuestionError(q.id);
        if (!firstErrorCard) firstErrorCard = document.getElementById(`taker-card-${q.id}`);
      } else {
        collectedAnswers[q.id] = val;
      }
    } 
    else if (q.type === 'multiple_choice' || q.type === 'yes_no' || q.type === 'rating') {
      const selected = form.querySelector(`input[name="${fieldName}"]:checked`);
      if (q.required && !selected) {
        isValid = false;
        markQuestionError(q.id);
        if (!firstErrorCard) firstErrorCard = document.getElementById(`taker-card-${q.id}`);
      } else {
        collectedAnswers[q.id] = selected ? (q.type === 'rating' ? Number(selected.value) : selected.value) : '';
      }
    } 
    else if (q.type === 'checkbox') {
      const checkedBoxes = form.querySelectorAll(`input[name="${fieldName}"]:checked`);
      const checkedValues = Array.from(checkedBoxes).map(cb => cb.value);

      if (q.required && checkedValues.length === 0) {
        isValid = false;
        markQuestionError(q.id);
        if (!firstErrorCard) firstErrorCard = document.getElementById(`taker-card-${q.id}`);
      } else {
        collectedAnswers[q.id] = checkedValues;
      }
    }
  }

  // If validation fails, display error banner and focus on first error
  if (!isValid) {
    errorAlert.classList.remove('hidden');
    if (firstErrorCard) {
      firstErrorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  // Validation succeeded -> Save response
  errorAlert.classList.add('hidden');

  const now = new Date();
  const formattedTime = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const newResponseId = 'resp_' + Date.now();

  const newResponse = {
    responseId: newResponseId,
    surveyId: activeTakingSurvey.id,
    surveyTitle: activeTakingSurvey.title,
    submittedAt: formattedTime,
    answers: collectedAnswers
  };

  const allResponses = getResponses();
  allResponses.push(newResponse);
  saveResponses(allResponses);

  // Prevent repeat submissions for this survey on this browser
  markSurveySubmitted(activeTakingSurvey.id);

  // Populate and show thank you view
  document.getElementById('success-survey-name').textContent = activeTakingSurvey.title;
  document.getElementById('success-response-id').textContent = newResponseId;
  document.getElementById('success-response-time').textContent = formattedTime;

  hideAllPublicViews();
  document.getElementById('survey-success-view').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update public statistics
  updatePublicStats();
}

function markQuestionError(questionId) {
  const card = document.getElementById(`taker-card-${questionId}`);
  if (card) {
    card.classList.add('has-error');
  }
}

function showSurveysListSection() {
  hideAllPublicViews();
  const listView = document.getElementById('surveys-view');
  if (listView) listView.classList.remove('hidden');
  renderPublicSurveys();
  updatePublicStats();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideAllPublicViews() {
  const views = [
    'surveys-view',
    'survey-taker-view',
    'survey-success-view',
    'survey-already-submitted-view'
  ];
  views.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
}


/* ==============================================================================
   ADMINISTRATOR DASHBOARD LOGIC (admin.html)
   ============================================================================== */

let currentEditingSurveyId = null; // null if creating a new survey
let builderQuestions = [];         // In-memory questions array during creation/editing

/**
 * Initialize admin portal
 */
function initAdminPortal() {
  const loginForm = document.getElementById('admin-login-form');
  if (!loginForm) return; // Exit if not on admin.html

  // Check existing session
  checkAdminAuth();

  // Attach login listener
  loginForm.addEventListener('submit', handleAdminLogin);

  // Attach logout listener
  const btnLogout = document.getElementById('btn-admin-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', handleAdminLogout);
  }

  // Dashboard top actions
  const btnCreate = document.getElementById('btn-open-create-survey');
  if (btnCreate) {
    btnCreate.addEventListener('click', () => openSurveyEditor(null));
  }

  const btnReset = document.getElementById('btn-reset-demo-data');
  if (btnReset) {
    btnReset.addEventListener('click', confirmResetDemoData);
  }

  // Editor Actions
  const btnAddQ = document.getElementById('btn-add-question');
  if (btnAddQ) {
    btnAddQ.addEventListener('click', addNewQuestionToBuilder);
  }

  const btnCancelEditor = document.getElementById('btn-cancel-editor');
  if (btnCancelEditor) {
    btnCancelEditor.addEventListener('click', cancelSurveyEditor);
  }

  const btnDiscardSurvey = document.getElementById('btn-discard-survey');
  if (btnDiscardSurvey) {
    btnDiscardSurvey.addEventListener('click', cancelSurveyEditor);
  }

  const editorForm = document.getElementById('survey-editor-form');
  if (editorForm) {
    editorForm.addEventListener('submit', handleSaveSurvey);
  }

  // Results Actions
  const btnBackResults = document.getElementById('btn-back-from-results');
  if (btnBackResults) {
    btnBackResults.addEventListener('click', showAdminSurveysTable);
  }

  const btnExportCSV = document.getElementById('btn-export-csv');
  if (btnExportCSV) {
    btnExportCSV.addEventListener('click', exportActiveSurveyCSV);
  }
}

/**
 * Check if administrator is already logged in
 */
function checkAdminAuth() {
  const isAuthenticated = sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';

  const loginView = document.getElementById('admin-login-view');
  const dashboardView = document.getElementById('admin-dashboard-view');
  const userPill = document.getElementById('admin-user-pill');

  if (isAuthenticated) {
    if (loginView) loginView.classList.add('hidden');
    if (dashboardView) dashboardView.classList.remove('hidden');
    if (userPill) userPill.classList.remove('hidden');
    renderAdminDashboard();
  } else {
    if (loginView) loginView.classList.remove('hidden');
    if (dashboardView) dashboardView.classList.add('hidden');
    if (userPill) userPill.classList.add('hidden');
  }
}

/**
 * Demo Login handler: checks username 'admin' and password 'admin123'
 */
function handleAdminLogin(e) {
  e.preventDefault();
  const usernameInput = document.getElementById('admin-username');
  const passwordInput = document.getElementById('admin-password');
  const errorAlert = document.getElementById('login-error-alert');

  const username = usernameInput ? usernameInput.value.trim() : '';
  const password = passwordInput ? passwordInput.value.trim() : '';

  // Academic Demo Credentials Verification
  if (username === 'admin' && password === 'admin123') {
    sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    if (errorAlert) errorAlert.classList.add('hidden');
    usernameInput.value = '';
    passwordInput.value = '';
    checkAdminAuth();
  } else {
    if (errorAlert) errorAlert.classList.remove('hidden');
  }
}

/**
 * Administrator logout
 */
function handleAdminLogout() {
  sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  checkAdminAuth();
}

/**
 * Render admin KPI metrics and survey table
 */
function renderAdminDashboard() {
  const surveys = getSurveys();
  const responses = getResponses();

  const totalSurveys = surveys.length;
  const publishedCount = surveys.filter(s => s.status === 'Published').length;
  const draftsCount = totalSurveys - publishedCount;
  const totalResponses = responses.length;

  // Update KPI counters
  document.getElementById('kpi-total-surveys').textContent = totalSurveys;
  document.getElementById('kpi-published-surveys').textContent = publishedCount;
  document.getElementById('kpi-total-responses').textContent = totalResponses;
  document.getElementById('kpi-draft-surveys').textContent = draftsCount;
  document.getElementById('table-surveys-count').textContent = `${totalSurveys} Surveys Registered`;

  // Render surveys table rows
  const tableBody = document.getElementById('admin-surveys-table-body');
  if (!tableBody) return;

  if (surveys.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center" style="padding: 2rem;">
          No surveys found. Click "➕ Create New Survey" or "🔄 Reset Sample Surveys".
        </td>
      </tr>
    `;
    return;
  }

  let rowsHtml = '';
  surveys.forEach(survey => {
    const surveyResponsesCount = responses.filter(r => r.surveyId === survey.id).length;

    rowsHtml += `
      <tr>
        <td>
          <strong>${escapeHTML(survey.title)}</strong>
          <div class="text-muted" style="font-size: 0.8rem;">ID: ${survey.id}</div>
        </td>
        <td>${survey.questions.length}</td>
        <td>
          <select class="form-control" style="padding: 0.25rem 0.5rem; font-size: 0.85rem; width: 120px;" 
            onchange="updateSurveyStatus('${survey.id}', this.value)">
            <option value="Draft" ${survey.status === 'Draft' ? 'selected' : ''}>Draft</option>
            <option value="Published" ${survey.status === 'Published' ? 'selected' : ''}>Published</option>
            <option value="Closed" ${survey.status === 'Closed' ? 'selected' : ''}>Closed</option>
          </select>
        </td>
        <td>
          <span class="badge badge-info">${surveyResponsesCount}</span>
        </td>
        <td style="font-size: 0.85rem; color: var(--text-muted);">${survey.createdAt || 'N/A'}</td>
        <td>
          <div class="table-action-btns">
            <button class="btn btn-outline btn-xs" onclick="viewSurveyResults('${survey.id}')" title="View Results & Analytics">
              📊 Results
            </button>
            <button class="btn btn-outline btn-xs" onclick="openSurveyEditor('${survey.id}')" title="Edit Survey">
              ✏️ Edit
            </button>
            <button class="btn btn-danger-outline btn-xs" onclick="deleteSurvey('${survey.id}')" title="Delete Survey">
              🗑️ Delete
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  tableBody.innerHTML = rowsHtml;
}

/**
 * Quick inline status change (Draft / Published / Closed)
 */
function updateSurveyStatus(surveyId, newStatus) {
  const surveys = getSurveys();
  const survey = surveys.find(s => s.id === surveyId);
  if (survey) {
    survey.status = newStatus;
    saveSurveys(surveys);
    renderAdminDashboard();
  }
}

/**
 * Delete a survey and all its responses after confirmation
 */
function deleteSurvey(surveyId) {
  const surveys = getSurveys();
  const survey = surveys.find(s => s.id === surveyId);
  if (!survey) return;

  const confirmed = confirm(`Are you sure you want to permanently delete "${survey.title}" and all its collected responses?`);
  if (!confirmed) return;

  // Remove survey
  const updatedSurveys = surveys.filter(s => s.id !== surveyId);
  saveSurveys(updatedSurveys);

  // Remove corresponding responses
  const responses = getResponses();
  const updatedResponses = responses.filter(r => r.surveyId !== surveyId);
  saveResponses(updatedResponses);

  renderAdminDashboard();
}

/**
 * Confirm and reset data back to default sample surveys A, B, C
 */
function confirmResetDemoData() {
  const confirmed = confirm("Reset all data back to original sample surveys (A, B, C) and demo responses?");
  if (confirmed) {
    resetAllData();
    renderAdminDashboard();
    alert("Sample surveys and demo responses have been successfully restored!");
  }
}

/* ==============================================================================
   SURVEY EDITOR BUILDER LOGIC (CREATE / EDIT)
   ============================================================================== */

/**
 * Open Survey Editor (pass surveyId to edit, or null to create new)
 */
function openSurveyEditor(surveyId) {
  currentEditingSurveyId = surveyId;
  const heading = document.getElementById('editor-heading');
  const titleInput = document.getElementById('edit-survey-title');
  const descInput = document.getElementById('edit-survey-desc');
  const statusSelect = document.getElementById('edit-survey-status');
  const errorAlert = document.getElementById('editor-validation-error');

  errorAlert.classList.add('hidden');

  if (surveyId) {
    // Edit Mode
    const surveys = getSurveys();
    const survey = surveys.find(s => s.id === surveyId);
    if (!survey) return;

    heading.textContent = "Edit Survey: " + survey.title;
    titleInput.value = survey.title;
    descInput.value = survey.description || '';
    statusSelect.value = survey.status;

    // Deep clone questions into builder
    builderQuestions = JSON.parse(JSON.stringify(survey.questions));
  } else {
    // Create New Mode
    heading.textContent = "Create New Survey";
    titleInput.value = '';
    descInput.value = '';
    statusSelect.value = 'Published';

    // Start with 1 default question
    builderQuestions = [
      {
        id: 'q_' + Date.now(),
        text: '',
        type: 'multiple_choice',
        options: ['Option 1', 'Option 2'],
        required: true
      }
    ];
  }

  renderBuilderQuestions();

  // Switch views
  document.getElementById('admin-surveys-list-panel').classList.add('hidden');
  document.getElementById('admin-results-panel').classList.add('hidden');
  document.getElementById('admin-survey-editor-panel').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Add a new empty question to the builder
 */
function addNewQuestionToBuilder() {
  builderQuestions.push({
    id: 'q_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    text: '',
    type: 'multiple_choice',
    options: ['Option 1', 'Option 2'],
    required: true
  });
  renderBuilderQuestions();
}

/**
 * Render the questions currently in the editor builder
 */
function renderBuilderQuestions() {
  const container = document.getElementById('builder-questions-list');
  if (!container) return;

  if (builderQuestions.length === 0) {
    container.innerHTML = `
      <div class="card text-center" style="padding: 2rem;">
        <p class="text-muted">No questions added yet. Click "➕ Add Question" above.</p>
      </div>
    `;
    return;
  }

  let html = '';
  builderQuestions.forEach((q, index) => {
    const isChoiceType = (q.type === 'multiple_choice' || q.type === 'checkbox');

    html += `
      <div class="question-builder-card" id="q-card-${q.id}">
        <div class="builder-card-top">
          <span class="builder-card-title">Question #${index + 1}</span>
          <button type="button" class="btn btn-danger-outline btn-xs" onclick="removeBuilderQuestion(${index})">
            ✖ Remove Question
          </button>
        </div>

        <div class="builder-grid">
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Question Text <span class="required-star">*</span></label>
            <input type="text" class="form-control" placeholder="Enter question..." 
              value="${escapeHTML(q.text)}" oninput="updateBuilderQuestionText(${index}, this.value)">
          </div>

          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Question Type</label>
            <select class="form-control" onchange="updateBuilderQuestionType(${index}, this.value)">
              <option value="short_text" ${q.type === 'short_text' ? 'selected' : ''}>Short Text</option>
              <option value="long_text" ${q.type === 'long_text' ? 'selected' : ''}>Long Text</option>
              <option value="multiple_choice" ${q.type === 'multiple_choice' ? 'selected' : ''}>Multiple Choice (Radio)</option>
              <option value="checkbox" ${q.type === 'checkbox' ? 'selected' : ''}>Checkboxes (Multiple Answers)</option>
              <option value="yes_no" ${q.type === 'yes_no' ? 'selected' : ''}>Yes / No</option>
              <option value="rating" ${q.type === 'rating' ? 'selected' : ''}>Rating (1 to 5)</option>
            </select>
          </div>

          <div class="form-group" style="margin-bottom: 0;">
            <label class="checkbox-label">
              <input type="checkbox" ${q.required ? 'checked' : ''} onchange="updateBuilderQuestionRequired(${index}, this.checked)">
              <span>Required?</span>
            </label>
          </div>
        </div>

        <!-- Dynamic Answer Options Section (for MCQ / Checkboxes) -->
        ${isChoiceType ? `
          <div class="options-builder-box">
            <div class="options-builder-title">Answer Options (Minimum 2 required)</div>
            <div id="builder-options-list-${index}">
              ${(q.options || []).map((opt, optIndex) => `
                <div class="option-builder-row">
                  <input type="text" class="form-control" style="padding: 0.4rem 0.75rem;" 
                    placeholder="Option ${optIndex + 1}" value="${escapeHTML(opt)}"
                    oninput="updateBuilderOptionText(${index}, ${optIndex}, this.value)">
                  <button type="button" class="btn btn-outline btn-xs" onclick="removeBuilderOption(${index}, ${optIndex})" 
                    ${(q.options.length <= 2) ? 'disabled title="Minimum 2 options needed"' : ''}>
                    🗑️
                  </button>
                </div>
              `).join('')}
            </div>
            <button type="button" class="btn btn-outline btn-xs" style="margin-top: 0.5rem;" onclick="addBuilderOption(${index})">
              ➕ Add Another Option
            </button>
          </div>
        ` : ''}

      </div>
    `;
  });

  container.innerHTML = html;
}

// In-Memory Question Mutators
function updateBuilderQuestionText(qIndex, val) {
  builderQuestions[qIndex].text = val;
}

function updateBuilderQuestionType(qIndex, newType) {
  builderQuestions[qIndex].type = newType;
  if ((newType === 'multiple_choice' || newType === 'checkbox') && (!builderQuestions[qIndex].options || builderQuestions[qIndex].options.length === 0)) {
    builderQuestions[qIndex].options = ['Option 1', 'Option 2'];
  }
  renderBuilderQuestions();
}

function updateBuilderQuestionRequired(qIndex, isRequired) {
  builderQuestions[qIndex].required = isRequired;
}

function removeBuilderQuestion(qIndex) {
  if (builderQuestions.length <= 1) {
    alert("A survey must have at least one question.");
    return;
  }
  builderQuestions.splice(qIndex, 1);
  renderBuilderQuestions();
}

function addBuilderOption(qIndex) {
  if (!builderQuestions[qIndex].options) builderQuestions[qIndex].options = [];
  builderQuestions[qIndex].options.push(`Option ${builderQuestions[qIndex].options.length + 1}`);
  renderBuilderQuestions();
}

function updateBuilderOptionText(qIndex, optIndex, val) {
  builderQuestions[qIndex].options[optIndex] = val;
}

function removeBuilderOption(qIndex, optIndex) {
  if (builderQuestions[qIndex].options.length <= 2) {
    alert("Multiple-choice / Checkbox questions require at least two options.");
    return;
  }
  builderQuestions[qIndex].options.splice(optIndex, 1);
  renderBuilderQuestions();
}

/**
 * Validate and Save Survey into LocalStorage
 */
function handleSaveSurvey(e) {
  e.preventDefault();
  const titleInput = document.getElementById('edit-survey-title');
  const descInput = document.getElementById('edit-survey-desc');
  const statusSelect = document.getElementById('edit-survey-status');
  const errorAlert = document.getElementById('editor-validation-error');

  const title = titleInput.value.trim();
  const desc = descInput.value.trim();
  const status = statusSelect.value;

  // Validation Checks
  if (!title) {
    errorAlert.textContent = "Validation Error: Survey Title cannot be empty.";
    errorAlert.classList.remove('hidden');
    titleInput.focus();
    return;
  }

  if (builderQuestions.length === 0) {
    errorAlert.textContent = "Validation Error: Please add at least one question to the survey.";
    errorAlert.classList.remove('hidden');
    return;
  }

  for (let i = 0; i < builderQuestions.length; i++) {
    const q = builderQuestions[i];
    if (!q.text.trim()) {
      errorAlert.textContent = `Validation Error: Question #${i + 1} has empty question text.`;
      errorAlert.classList.remove('hidden');
      return;
    }

    if (q.type === 'multiple_choice' || q.type === 'checkbox') {
      const validOptions = (q.options || []).map(o => o.trim()).filter(o => o !== '');
      if (validOptions.length < 2) {
        errorAlert.textContent = `Validation Error: Question #${i + 1} (${q.text}) must have at least 2 non-empty answer options.`;
        errorAlert.classList.remove('hidden');
        return;
      }
      q.options = validOptions;
    }
  }

  errorAlert.classList.add('hidden');

  const surveys = getSurveys();

  if (currentEditingSurveyId) {
    // Update existing survey
    const index = surveys.findIndex(s => s.id === currentEditingSurveyId);
    if (index !== -1) {
      surveys[index].title = title;
      surveys[index].description = desc;
      surveys[index].status = status;
      surveys[index].questions = builderQuestions;
    }
  } else {
    // Create new survey
    const newSurvey = {
      id: "survey_" + Date.now(),
      title: title,
      description: desc,
      status: status,
      createdAt: new Date().toISOString().split('T')[0],
      questions: builderQuestions
    };
    surveys.push(newSurvey);
  }

  saveSurveys(surveys);
  cancelSurveyEditor();
}

function cancelSurveyEditor() {
  document.getElementById('admin-survey-editor-panel').classList.add('hidden');
  document.getElementById('admin-results-panel').classList.add('hidden');
  document.getElementById('admin-surveys-list-panel').classList.remove('hidden');
  renderAdminDashboard();
}

function showAdminSurveysTable() {
  document.getElementById('admin-results-panel').classList.add('hidden');
  document.getElementById('admin-survey-editor-panel').classList.add('hidden');
  document.getElementById('admin-surveys-list-panel').classList.remove('hidden');
  renderAdminDashboard();
}


/* ==============================================================================
   RESULTS & ANALYTICS DASHBOARD ENGINE
   ============================================================================== */

let activeResultSurvey = null;
let activeSurveyResponses = [];

/**
 * View detailed results & analytics for a specific survey
 */
function viewSurveyResults(surveyId) {
  const surveys = getSurveys();
  const responses = getResponses();

  const survey = surveys.find(s => s.id === surveyId);
  if (!survey) return;

  activeResultSurvey = survey;
  activeSurveyResponses = responses.filter(r => r.surveyId === surveyId);

  // Set Header Information
  document.getElementById('results-survey-title').textContent = survey.title;
  document.getElementById('results-survey-desc').textContent = survey.description || 'No description provided.';
  document.getElementById('results-survey-status').textContent = survey.status;
  document.getElementById('results-response-count').textContent = `${activeSurveyResponses.length} Total Responses`;

  // Render Per-Question Analytical Cards
  renderQuestionAnalytics(survey, activeSurveyResponses);

  // Render Raw Responses Log
  renderRawResponsesTable(survey, activeSurveyResponses);

  // Switch View
  document.getElementById('admin-surveys-list-panel').classList.add('hidden');
  document.getElementById('admin-survey-editor-panel').classList.add('hidden');
  document.getElementById('admin-results-panel').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Calculate statistics and generate visual analytics (percentage bars, rating averages)
 */
function renderQuestionAnalytics(survey, surveyResponses) {
  const container = document.getElementById('results-questions-container');
  if (!container) return;

  const totalResponses = surveyResponses.length;

  if (totalResponses === 0) {
    container.innerHTML = `
      <div class="card text-center" style="padding: 3rem;">
        <h3>No Responses Collected Yet</h3>
        <p class="text-muted" style="margin-top: 0.5rem;">
          Publish this survey and submit a response through the student homepage to see analytics here.
        </p>
      </div>
    `;
    return;
  }

  let html = '';

  survey.questions.forEach((q, index) => {
    html += `
      <div class="result-card">
        <h4 class="result-question-prompt">
          Q${index + 1}: ${escapeHTML(q.text)}
          <span style="font-weight: 400; font-size: 0.85rem; color: var(--text-muted);">(${formatQuestionType(q.type)})</span>
        </h4>
    `;

    // 1. Multiple Choice / Checkbox / Yes-No Analytics
    if (q.type === 'multiple_choice' || q.type === 'yes_no' || q.type === 'checkbox') {
      const options = (q.type === 'yes_no') ? ['Yes', 'No'] : (q.options || []);
      const counts = {};
      options.forEach(opt => counts[opt] = 0);

      let answeredCount = 0;

      surveyResponses.forEach(r => {
        const ans = r.answers[q.id];
        if (ans !== undefined && ans !== null && ans !== '') {
          answeredCount++;
          if (Array.isArray(ans)) {
            ans.forEach(val => {
              if (counts[val] !== undefined) counts[val]++;
            });
          } else {
            if (counts[ans] !== undefined) counts[ans]++;
          }
        }
      });

      html += `<div class="stat-bars-list">`;
      options.forEach(opt => {
        const count = counts[opt] || 0;
        const percentage = answeredCount > 0 ? ((count / answeredCount) * 100).toFixed(1) : 0;

        html += `
          <div class="stat-bar-item">
            <div class="stat-bar-labels">
              <span>${escapeHTML(opt)}</span>
              <span>${count} votes (${percentage}%)</span>
            </div>
            <div class="stat-bar-track">
              <div class="stat-bar-fill" style="width: ${percentage}%;"></div>
            </div>
          </div>
        `;
      });
      html += `</div>`;

    // 2. Rating (1 to 5) Analytics
    } else if (q.type === 'rating') {
      let sum = 0;
      let count = 0;
      const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      surveyResponses.forEach(r => {
        const val = Number(r.answers[q.id]);
        if (!isNaN(val) && val >= 1 && val <= 5) {
          sum += val;
          count++;
          ratingCounts[val]++;
        }
      });

      const avg = count > 0 ? (sum / count).toFixed(1) : "0.0";

      html += `
        <div class="rating-metric-display">
          <div class="rating-score-box">
            <div class="rating-score-big">${avg}</div>
            <div class="text-muted" style="font-size: 0.85rem;">out of 5.0</div>
            <div class="rating-stars">${'★'.repeat(Math.round(avg))}${'☆'.repeat(5 - Math.round(avg))}</div>
          </div>
          <div class="stat-bars-list" style="flex: 1; width: 100%;">
            ${[5, 4, 3, 2, 1].map(star => {
              const starCount = ratingCounts[star];
              const starPct = count > 0 ? ((starCount / count) * 100).toFixed(1) : 0;
              return `
                <div class="stat-bar-item">
                  <div class="stat-bar-labels">
                    <span>${star} Star${star > 1 ? 's' : ''}</span>
                    <span>${starCount} (${starPct}%)</span>
                  </div>
                  <div class="stat-bar-track">
                    <div class="stat-bar-fill" style="width: ${starPct}%;"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;

    // 3. Short & Long Text Answers
    } else if (q.type === 'short_text' || q.type === 'long_text') {
      const textResponses = surveyResponses
        .map(r => ({ text: r.answers[q.id], date: r.submittedAt }))
        .filter(item => item.text && item.text.trim() !== '');

      if (textResponses.length === 0) {
        html += `<p class="text-muted">No written responses provided yet.</p>`;
      } else {
        html += `<div class="text-answers-list">`;
        textResponses.forEach(item => {
          html += `
            <div class="text-answer-item">
              "${escapeHTML(item.text)}"
              <span class="text-answer-date">Submitted: ${item.date}</span>
            </div>
          `;
        });
        html += `</div>`;
      }
    }

    html += `</div>`; // Close result-card
  });

  container.innerHTML = html;
}

/**
 * Render raw submissions table
 */
function renderRawResponsesTable(survey, surveyResponses) {
  const tableBody = document.getElementById('raw-responses-table-body');
  if (!tableBody) return;

  if (surveyResponses.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-muted" style="padding: 1.5rem;">
          No submissions recorded yet.
        </td>
      </tr>
    `;
    return;
  }

  let html = '';
  surveyResponses.forEach((r, idx) => {
    const answersSummary = Object.keys(r.answers).map(qId => {
      const q = survey.questions.find(item => item.id === qId);
      const qPrompt = q ? q.text : qId;
      const val = Array.isArray(r.answers[qId]) ? r.answers[qId].join(', ') : r.answers[qId];
      return `<div><strong>${escapeHTML(qPrompt)}:</strong> ${escapeHTML(String(val))}</div>`;
    }).join('');

    html += `
      <tr>
        <td>${idx + 1}</td>
        <td><code>${r.responseId}</code></td>
        <td style="font-size: 0.85rem; color: var(--text-muted);">${r.submittedAt}</td>
        <td style="font-size: 0.85rem;">${answersSummary}</td>
      </tr>
    `;
  });

  tableBody.innerHTML = html;
}

/**
 * Format question type code into human-friendly label
 */
function formatQuestionType(type) {
  const map = {
    'short_text': 'Short Text',
    'long_text': 'Long Text',
    'multiple_choice': 'Multiple Choice',
    'checkbox': 'Checkboxes',
    'yes_no': 'Yes / No',
    'rating': '1 to 5 Rating'
  };
  return map[type] || type;
}

/**
 * Export Survey Results as a downloadable CSV file (Pure JavaScript)
 */
function exportActiveSurveyCSV() {
  if (!activeResultSurvey || activeSurveyResponses.length === 0) {
    alert("No response data available to export.");
    return;
  }

  // 1. Build CSV Header Row
  const headers = ['Response ID', 'Submitted Timestamp'];
  activeResultSurvey.questions.forEach(q => {
    headers.push(q.text.replace(/"/g, '""')); // Escape quotes for CSV
  });

  const csvRows = [];
  csvRows.push(headers.map(h => `"${h}"`).join(','));

  // 2. Build Data Rows
  activeSurveyResponses.forEach(r => {
    const row = [
      `"${r.responseId}"`,
      `"${r.submittedAt}"`
    ];

    activeResultSurvey.questions.forEach(q => {
      let val = r.answers[q.id];
      if (val === undefined || val === null) {
        val = '';
      } else if (Array.isArray(val)) {
        val = val.join('; ');
      }
      row.push(`"${String(val).replace(/"/g, '""')}"`);
    });

    csvRows.push(row.join(','));
  });

  const csvString = csvRows.join('\r\n');

  // 3. Trigger browser download using Blob
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  const sanitizedTitle = activeResultSurvey.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
  a.download = `survey_${sanitizedTitle}_results.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}


/* ==============================================================================
   APPLICATION BOOTSTRAPPER (Runs when DOM Content is Ready)
   ============================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Check which page is currently loaded and initialize appropriate module
  if (document.getElementById('surveys-grid')) {
    initPublicPortal();
  }

  if (document.getElementById('admin-login-form')) {
    initAdminPortal();
  }
});