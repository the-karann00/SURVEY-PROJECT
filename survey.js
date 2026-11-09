/**
 * ==============================================================================
 * SIMPLE ONLINE SURVEY CREATOR - SCRIPT.JS (Concise & Beginner-Friendly)
 * Pure Vanilla JavaScript • Clean & Modular • Easy to Explain to Your Teacher
 * ==============================================================================
 */

// 1. DEFAULT DATA (Sample Surveys A, B, C & Responses)
const DEFAULT_SURVEYS = [
  {
    id: "survey_a",
    title: "Student Feedback About Teaching",
    description: "Feedback regarding teaching methods, interactivity, and doubts.",
    status: "Published",
    createdAt: "2026-11-01",
    questions: [
      { id: "q1", text: "Which subject are you studying?", type: "short_text", required: true },
      { id: "q2", text: "How clearly does the teacher explain the topics?", type: "rating", required: true },
      { id: "q3", text: "Does the teacher provide practical examples?", type: "yes_no", required: true },
      { id: "q4", text: "How interactive are the classes?", type: "multiple_choice", options: ["Very interactive", "Interactive", "Average", "Not interactive"], required: true },
      { id: "q5", text: "Are your doubts resolved during class?", type: "yes_no", required: true },
      { id: "q6", text: "Which teaching method do you prefer?", type: "multiple_choice", options: ["Blackboard", "PPT presentation", "Live coding/demonstration", "Group activities"], required: true },
      { id: "q7", text: "What improvements would you suggest?", type: "long_text", required: false }
    ]
  },
  {
    id: "survey_b",
    title: "College Campus Feedback",
    description: "Help improve amenities, library, and internet connectivity.",
    status: "Published",
    createdAt: "2026-11-02",
    questions: [
      { id: "q1", text: "How satisfied are you with college facilities?", type: "rating", required: true },
      { id: "q2", text: "How would you rate classroom cleanliness?", type: "multiple_choice", options: ["Excellent", "Good", "Average", "Poor"], required: true },
      { id: "q3", text: "Are library resources sufficient?", type: "yes_no", required: true },
      { id: "q4", text: "How satisfied are you with internet connectivity?", type: "rating", required: true },
      { id: "q5", text: "What improvements would you suggest?", type: "long_text", required: false }
    ]
  },
  {
    id: "survey_c",
    title: "Student Technology Preferences",
    description: "Coding habits, domain interests, and learning resources.",
    status: "Published",
    createdAt: "2026-11-03",
    questions: [
      { id: "q1", text: "Which programming language do you prefer?", type: "multiple_choice", options: ["C", "C++", "Java", "Python", "JavaScript", "Other"], required: true },
      { id: "q2", text: "How often do you practice coding?", type: "multiple_choice", options: ["Daily", "Several times a week", "Occasionally", "Rarely"], required: true },
      { id: "q3", text: "Which area interests you most?", type: "multiple_choice", options: ["Web Development", "Artificial Intelligence", "Cybersecurity", "App Development", "Data Science"], required: true },
      { id: "q4", text: "Which learning method helps you most?", type: "multiple_choice", options: ["YouTube", "Online courses", "Books/notes", "Practical projects", "Classroom teaching"], required: true }
    ]
  }
];

const DEFAULT_RESPONSES = [
  { responseId: "resp_101", surveyId: "survey_a", submittedAt: "11/3/2026, 10:15 AM", answers: { q1: "Data Structures", q2: 5, q3: "Yes", q4: "Very interactive", q5: "Yes", q6: "Live coding/demonstration", q7: "More practice labs." } },
  { responseId: "resp_102", surveyId: "survey_a", submittedAt: "11/3/2026, 2:40 PM", answers: { q1: "DBMS", q2: 4, q3: "Yes", q4: "Interactive", q5: "Yes", q6: "PPT presentation", q7: "Share lecture notes early." } },
  { responseId: "resp_201", surveyId: "survey_b", submittedAt: "11/4/2026, 9:30 AM", answers: { q1: 5, q2: "Excellent", q3: "Yes", q4: 4, q5: "Wi-Fi in library needs upgrade." } }
];

// 2. STORAGE HELPERS (HTML5 LocalStorage API)
function getSurveys() {
  const d = localStorage.getItem('survey_app_surveys');
  if (!d) { saveSurveys(DEFAULT_SURVEYS); return DEFAULT_SURVEYS; }
  return JSON.parse(d);
}
function saveSurveys(data) { localStorage.setItem('survey_app_surveys', JSON.stringify(data)); }

function getResponses() {
  const d = localStorage.getItem('survey_app_responses');
  if (!d) { saveResponses(DEFAULT_RESPONSES); return DEFAULT_RESPONSES; }
  return JSON.parse(d);
}
function saveResponses(data) { localStorage.setItem('survey_app_responses', JSON.stringify(data)); }
function escapeHTML(str) { return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

// 3. PUBLIC STUDENT PORTAL (index.html)
let currentSurvey = null;

function showPublicView(viewId) {
  ['surveys-view', 'survey-taker-view', 'survey-success-view', 'survey-already-submitted-view'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', id !== viewId);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initPublic() {
  const grid = document.getElementById('surveys-grid');
  if (!grid) return;

  const surveys = getSurveys();
  const responses = getResponses();
  const published = surveys.filter(s => s.status === 'Published');

  // Update homepage statistics
  document.getElementById('public-stat-surveys').textContent = published.length;
  document.getElementById('public-stat-responses').textContent = responses.length;

  // Render published surveys
  grid.innerHTML = published.length ? published.map(s => {
    const count = responses.filter(r => r.surveyId === s.id).length;
    const isDone = localStorage.getItem('survey_submitted_' + s.id) === 'true';
    return `
      <div class="card survey-card">
        <div>
          <div class="survey-card-header">
            <h3 class="survey-card-title">${escapeHTML(s.title)}</h3>
            <span class="badge badge-published">Published</span>
          </div>
          <p class="survey-card-desc">${escapeHTML(s.description || 'No description.')}</p>
        </div>
        <div>
          <div class="survey-card-meta">
            <span>📝 ${s.questions.length} Questions</span>
            <span>👥 ${count} Responses</span>
          </div>
          <button class="btn ${isDone ? 'btn-outline' : 'btn-primary'} btn-block" onclick="openSurvey('${s.id}')">
            ${isDone ? 'Completed (Details)' : 'Take Survey →'}
          </button>
        </div>
      </div>`;
  }).join('') : '<p class="text-center" style="grid-column:1/-1;">No published surveys open right now.</p>';

  // Button navigation listeners
  ['btn-back-to-surveys', 'btn-cancel-survey', 'btn-success-home', 'btn-already-back'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.onclick = () => { showPublicView('surveys-view'); initPublic(); };
  });

  const form = document.getElementById('survey-taking-form');
  if (form) form.onsubmit = handleSurveySubmit;
}

function openSurvey(id) {
  const survey = getSurveys().find(s => s.id === id);
  if (!survey) return;

  // Prevent duplicate submissions on the same browser
  if (localStorage.getItem('survey_submitted_' + id) === 'true') {
    showPublicView('survey-already-submitted-view');
    return;
  }

  currentSurvey = survey;
  document.getElementById('taker-survey-title').textContent = survey.title;
  document.getElementById('taker-survey-desc').textContent = survey.description || '';
  document.getElementById('taker-survey-status').textContent = survey.status;
  document.getElementById('survey-validation-error').classList.add('hidden');

  // Build question inputs dynamically based on question type
  const container = document.getElementById('survey-questions-container');
  container.innerHTML = survey.questions.map((q, i) => {
    let inputHTML = '';
    if (q.type === 'short_text') {
      inputHTML = `<input type="text" name="q_${q.id}" class="form-control" placeholder="Type your answer...">`;
    } else if (q.type === 'long_text') {
      inputHTML = `<textarea name="q_${q.id}" class="form-control" rows="3" placeholder="Type your answer..."></textarea>`;
    } else if (q.type === 'multiple_choice') {
      inputHTML = `<div class="options-group">${(q.options || []).map(opt => `
        <label class="option-item-label"><input type="radio" name="q_${q.id}" value="${escapeHTML(opt)}"> <span>${escapeHTML(opt)}</span></label>
      `).join('')}</div>`;
    } else if (q.type === 'checkbox') {
      inputHTML = `<div class="options-group">${(q.options || []).map(opt => `
        <label class="option-item-label"><input type="checkbox" name="q_${q.id}" value="${escapeHTML(opt)}"> <span>${escapeHTML(opt)}</span></label>
      `).join('')}</div>`;
    } else if (q.type === 'yes_no') {
      inputHTML = `<div class="yes-no-group">
        <label class="yes-no-label"><input type="radio" name="q_${q.id}" value="Yes"> 👍 Yes</label>
        <label class="yes-no-label"><input type="radio" name="q_${q.id}" value="No"> 👎 No</label>
      </div>`;
    } else if (q.type === 'rating') {
      inputHTML = `<div class="rating-group">${[1, 2, 3, 4, 5].map(v => `
        <label class="rating-label"><input type="radio" name="q_${q.id}" value="${v}"> ${v}</label>
      `).join('')}</div><div class="rating-scale-legend"><span>1 = Low</span><span>5 = High</span></div>`;
    }

    return `
      <div class="question-taker-card" id="q_card_${q.id}">
        <div class="question-header">
          <span class="question-number-badge">${i + 1}</span>
          <div class="question-prompt">${escapeHTML(q.text)} ${q.required ? '<span class="required-star">*</span>' : ''}</div>
        </div>
        ${inputHTML}
      </div>`;
  }).join('');

  showPublicView('survey-taker-view');
}

function handleSurveySubmit(e) {
  e.preventDefault();
  const form = e.target;
  const answers = {};
  let valid = true;

  document.querySelectorAll('.question-taker-card').forEach(c => c.classList.remove('has-error'));

  // Validate all questions
  for (let q of currentSurvey.questions) {
    const fieldName = `q_${q.id}`;
    let val;

    if (q.type === 'checkbox') {
      val = Array.from(form.querySelectorAll(`input[name="${fieldName}"]:checked`)).map(c => c.value);
      if (q.required && val.length === 0) valid = false;
    } else if (q.type === 'multiple_choice' || q.type === 'yes_no' || q.type === 'rating') {
      const selected = form.querySelector(`input[name="${fieldName}"]:checked`);
      val = selected ? (q.type === 'rating' ? Number(selected.value) : selected.value) : '';
      if (q.required && !val) valid = false;
    } else {
      val = (form.elements[fieldName]?.value || '').trim();
      if (q.required && !val) valid = false;
    }

    if (q.required && (!val || (Array.isArray(val) && !val.length))) {
      document.getElementById(`q_card_${q.id}`)?.classList.add('has-error');
    }
    answers[q.id] = val;
  }

  const errBox = document.getElementById('survey-validation-error');
  if (!valid) {
    errBox.classList.remove('hidden');
    document.querySelector('.has-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  errBox.classList.add('hidden');

  // Save response to localStorage
  const newResp = {
    responseId: 'resp_' + Date.now(),
    surveyId: currentSurvey.id,
    submittedAt: new Date().toLocaleString(),
    answers
  };

  const all = getResponses();
  all.push(newResp);
  saveResponses(all);
  localStorage.setItem('survey_submitted_' + currentSurvey.id, 'true'); // Flag duplicate prevention

  document.getElementById('success-survey-name').textContent = currentSurvey.title;
  document.getElementById('success-response-id').textContent = newResp.responseId;
  document.getElementById('success-response-time').textContent = newResp.submittedAt;
  showPublicView('survey-success-view');
}

// 4. ADMIN PORTAL (admin.html)
let editingSurveyId = null;
let builderQuestions = [];
let activeSurvey = null;

function showAdminSection(panelId) {
  ['admin-surveys-list-panel', 'admin-survey-editor-panel', 'admin-results-panel'].forEach(id => {
    document.getElementById(id).classList.toggle('hidden', id !== panelId);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showSurveyList() {
  showAdminSection('admin-surveys-list-panel');
  renderDashboard();
}

function initAdmin() {
  const loginForm = document.getElementById('admin-login-form');
  if (!loginForm) return;

  const isAuth = sessionStorage.getItem('survey_admin_auth') === 'true';
  document.getElementById('admin-login-view').classList.toggle('hidden', isAuth);
  document.getElementById('admin-dashboard-view').classList.toggle('hidden', !isAuth);
  document.getElementById('admin-user-pill')?.classList.toggle('hidden', !isAuth);

  if (isAuth) renderDashboard();

  loginForm.onsubmit = (e) => {
    e.preventDefault();
    const u = document.getElementById('admin-username').value.trim();
    const p = document.getElementById('admin-password').value.trim();
    if (u === 'admin' && p === 'admin123') {
      sessionStorage.setItem('survey_admin_auth', 'true');
      initAdmin();
    } else {
      document.getElementById('login-error-alert').classList.remove('hidden');
    }
  };

  document.getElementById('btn-admin-logout').onclick = () => {
    sessionStorage.removeItem('survey_admin_auth');
    initAdmin();
  };

  document.getElementById('btn-reset-demo-data').onclick = () => {
    if (confirm("Reset to default sample surveys and responses?")) {
      saveSurveys(DEFAULT_SURVEYS);
      saveResponses(DEFAULT_RESPONSES);
      for (let k in localStorage) { if (k.startsWith('survey_submitted_')) localStorage.removeItem(k); }
      renderDashboard();
      alert("Demo data restored!");
    }
  };

  document.getElementById('btn-open-create-survey').onclick = () => openEditor(null);
  document.getElementById('btn-cancel-editor').onclick = showSurveyList;
  document.getElementById('btn-discard-survey').onclick = showSurveyList;
  document.getElementById('btn-add-question').onclick = addBuilderQuestion;
  document.getElementById('survey-editor-form').onsubmit = saveSurveyForm;
  document.getElementById('btn-back-from-results').onclick = showSurveyList;
  document.getElementById('btn-export-csv').onclick = exportCSV;
}

function renderDashboard() {
  const surveys = getSurveys();
  const responses = getResponses();
  const published = surveys.filter(s => s.status === 'Published').length;

  document.getElementById('kpi-total-surveys').textContent = surveys.length;
  document.getElementById('kpi-published-surveys').textContent = published;
  document.getElementById('kpi-total-responses').textContent = responses.length;
  document.getElementById('kpi-draft-surveys').textContent = surveys.length - published;
  document.getElementById('table-surveys-count').textContent = `${surveys.length} Surveys Registered`;

  const tbody = document.getElementById('admin-surveys-table-body');
  tbody.innerHTML = surveys.map(s => {
    const count = responses.filter(r => r.surveyId === s.id).length;
    return `
      <tr>
        <td><strong>${escapeHTML(s.title)}</strong><br><small class="text-muted">${s.id}</small></td>
        <td>${s.questions.length}</td>
        <td>
          <select class="form-control" style="width:115px;padding:4px 6px;" onchange="changeStatus('${s.id}', this.value)">
            <option value="Draft" ${s.status === 'Draft' ? 'selected' : ''}>Draft</option>
            <option value="Published" ${s.status === 'Published' ? 'selected' : ''}>Published</option>
            <option value="Closed" ${s.status === 'Closed' ? 'selected' : ''}>Closed</option>
          </select>
        </td>
        <td><span class="badge badge-info">${count}</span></td>
        <td>${s.createdAt || 'N/A'}</td>
        <td>
          <div class="table-action-btns">
            <button class="btn btn-outline btn-xs" onclick="viewResults('${s.id}')">📊 Results</button>
            <button class="btn btn-outline btn-xs" onclick="openEditor('${s.id}')">✏️ Edit</button>
            <button class="btn btn-danger-outline btn-xs" onclick="deleteSurvey('${s.id}')">🗑️ Delete</button>
          </div>
        </td>
      </tr>`;
  }).join('');
}

function changeStatus(id, newStatus) {
  const list = getSurveys();
  const s = list.find(x => x.id === id);
  if (s) { s.status = newStatus; saveSurveys(list); renderDashboard(); }
}

function deleteSurvey(id) {
  if (!confirm("Are you sure you want to delete this survey and its responses?")) return;
  saveSurveys(getSurveys().filter(s => s.id !== id));
  saveResponses(getResponses().filter(r => r.surveyId !== id));
  renderDashboard();
}

// 5. SURVEY EDITOR BUILDER (CREATE / EDIT)
function openEditor(id) {
  editingSurveyId = id;
  document.getElementById('editor-validation-error').classList.add('hidden');

  if (id) {
    const s = getSurveys().find(x => x.id === id);
    document.getElementById('editor-heading').textContent = "Edit Survey";
    document.getElementById('edit-survey-title').value = s.title;
    document.getElementById('edit-survey-desc').value = s.description || '';
    document.getElementById('edit-survey-status').value = s.status;
    builderQuestions = JSON.parse(JSON.stringify(s.questions));
  } else {
    document.getElementById('editor-heading').textContent = "Create New Survey";
    document.getElementById('edit-survey-title').value = '';
    document.getElementById('edit-survey-desc').value = '';
    document.getElementById('edit-survey-status').value = 'Published';
    builderQuestions = [{ id: 'q_' + Date.now(), text: '', type: 'multiple_choice', options: ['Option 1', 'Option 2'], required: true }];
  }
  renderBuilder();
  showAdminSection('admin-survey-editor-panel');
}

function addBuilderQuestion() {
  builderQuestions.push({ id: 'q_' + Date.now(), text: '', type: 'multiple_choice', options: ['Option 1', 'Option 2'], required: true });
  renderBuilder();
}

function renderBuilder() {
  const list = document.getElementById('builder-questions-list');
  list.innerHTML = builderQuestions.map((q, i) => `
    <div class="question-builder-card">
      <div class="builder-card-top">
        <strong>Question #${i + 1}</strong>
        <button type="button" class="btn btn-danger-outline btn-xs" onclick="removeBuilderQ(${i})">✖ Remove</button>
      </div>
      <div class="builder-grid">
        <div>
          <label class="form-label">Question Text *</label>
          <input type="text" class="form-control" value="${escapeHTML(q.text)}" oninput="builderQuestions[${i}].text=this.value">
        </div>
        <div>
          <label class="form-label">Question Type</label>
          <select class="form-control" onchange="builderQuestions[${i}].type=this.value; if((this.value==='multiple_choice'||this.value==='checkbox')&&!builderQuestions[${i}].options) builderQuestions[${i}].options=['Option 1','Option 2']; renderBuilder();">
            <option value="short_text" ${q.type==='short_text'?'selected':''}>Short Text</option>
            <option value="long_text" ${q.type==='long_text'?'selected':''}>Long Text</option>
            <option value="multiple_choice" ${q.type==='multiple_choice'?'selected':''}>Multiple Choice</option>
            <option value="checkbox" ${q.type==='checkbox'?'selected':''}>Checkboxes</option>
            <option value="yes_no" ${q.type==='yes_no'?'selected':''}>Yes / No</option>
            <option value="rating" ${q.type==='rating'?'selected':''}>Rating (1-5)</option>
          </select>
        </div>
        <div>
          <label class="checkbox-label" style="margin-top:28px;">
            <input type="checkbox" ${q.required?'checked':''} onchange="builderQuestions[${i}].required=this.checked"> Required
          </label>
        </div>
      </div>
      ${(q.type === 'multiple_choice' || q.type === 'checkbox') ? `
        <div class="options-builder-box">
          <small><strong>Options (min 2):</strong></small>
          ${(q.options || []).map((opt, oi) => `
            <div class="option-builder-row">
              <input type="text" class="form-control" value="${escapeHTML(opt)}" oninput="builderQuestions[${i}].options[${oi}]=this.value">
              <button type="button" class="btn btn-outline btn-xs" onclick="builderQuestions[${i}].options.splice(${oi},1); renderBuilder();" ${q.options.length<=2?'disabled':''}>🗑️</button>
            </div>
          `).join('')}
          <button type="button" class="btn btn-outline btn-xs" style="margin-top:5px;" onclick="builderQuestions[${i}].options.push('Option '+(builderQuestions[${i}].options.length+1)); renderBuilder();">➕ Add Option</button>
        </div>
      ` : ''}
    </div>
  `).join('');
}

function removeBuilderQ(index) {
  if (builderQuestions.length <= 1) return alert("A survey must have at least 1 question.");
  builderQuestions.splice(index, 1);
  renderBuilder();
}

function saveSurveyForm(e) {
  e.preventDefault();
  const title = document.getElementById('edit-survey-title').value.trim();
  const desc = document.getElementById('edit-survey-desc').value.trim();
  const status = document.getElementById('edit-survey-status').value;
  const errBox = document.getElementById('editor-validation-error');

  if (!title) { errBox.textContent = "Survey title cannot be empty!"; errBox.classList.remove('hidden'); return; }
  for (let [idx, q] of builderQuestions.entries()) {
    if (!q.text.trim()) { errBox.textContent = `Question #${idx+1} is missing question text!`; errBox.classList.remove('hidden'); return; }
    if ((q.type === 'multiple_choice' || q.type === 'checkbox') && (!q.options || q.options.filter(o => o.trim()).length < 2)) {
      errBox.textContent = `Question #${idx+1} must have at least 2 options!`; errBox.classList.remove('hidden'); return;
    }
  }

  const surveys = getSurveys();
  if (editingSurveyId) {
    const idx = surveys.findIndex(s => s.id === editingSurveyId);
    if (idx !== -1) { surveys[idx].title = title; surveys[idx].description = desc; surveys[idx].status = status; surveys[idx].questions = builderQuestions; }
  } else {
    surveys.push({ id: 'survey_' + Date.now(), title, description: desc, status, createdAt: new Date().toISOString().split('T')[0], questions: builderQuestions });
  }
  saveSurveys(surveys);
  showSurveyList();
}

// 6. RESULTS & ANALYTICS DASHBOARD
function viewResults(id) {
  activeSurvey = getSurveys().find(s => s.id === id);
  if (!activeSurvey) return;
  const responses = getResponses().filter(r => r.surveyId === id);

  document.getElementById('results-survey-title').textContent = activeSurvey.title;
  document.getElementById('results-survey-desc').textContent = activeSurvey.description || '';
  document.getElementById('results-survey-status').textContent = activeSurvey.status;
  document.getElementById('results-response-count').textContent = `${responses.length} Total Responses`;

  const container = document.getElementById('results-questions-container');
  if (!responses.length) {
    container.innerHTML = '<div class="card text-center"><p class="text-muted">No responses submitted yet.</p></div>';
  } else {
    container.innerHTML = activeSurvey.questions.map((q, idx) => {
      let statsHTML = '';
      if (q.type === 'multiple_choice' || q.type === 'yes_no' || q.type === 'checkbox') {
        const opts = (q.type === 'yes_no') ? ['Yes', 'No'] : (q.options || []);
        const counts = {};
        opts.forEach(o => counts[o] = 0);
        let totalVotes = 0;
        responses.forEach(r => {
          const ans = r.answers[q.id];
          if (Array.isArray(ans)) { ans.forEach(a => { if (counts[a] !== undefined) { counts[a]++; totalVotes++; } }); }
          else if (counts[ans] !== undefined) { counts[ans]++; totalVotes++; }
        });
        statsHTML = `<div class="stat-bars-list">${opts.map(o => {
          const pct = totalVotes ? ((counts[o] / totalVotes) * 100).toFixed(1) : 0;
          return `
            <div class="stat-bar-item">
              <div class="stat-bar-labels"><span>${escapeHTML(o)}</span><span>${counts[o]} votes (${pct}%)</span></div>
              <div class="stat-bar-track"><div class="stat-bar-fill" style="width:${pct}%"></div></div>
            </div>`;
        }).join('')}</div>`;
      } else if (q.type === 'rating') {
        const ratings = responses.map(r => Number(r.answers[q.id])).filter(v => v >= 1 && v <= 5);
        const avg = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "0.0";
        statsHTML = `
          <div class="rating-metric-display">
            <div class="rating-score-box"><div class="rating-score-big">${avg}</div><small>/ 5.0</small></div>
            <div class="stat-bars-list" style="flex:1;">${[5, 4, 3, 2, 1].map(star => {
              const count = ratings.filter(v => v === star).length;
              const pct = ratings.length ? ((count / ratings.length) * 100).toFixed(1) : 0;
              return `
                <div class="stat-bar-item">
                  <div class="stat-bar-labels"><span>${star} Star</span><span>${count} (${pct}%)</span></div>
                  <div class="stat-bar-track"><div class="stat-bar-fill" style="width:${pct}%"></div></div>
                </div>`;
            }).join('')}</div>
          </div>`;
      } else {
        const texts = responses.map(r => r.answers[q.id]).filter(t => t && String(t).trim());
        statsHTML = texts.length ? `<div class="text-answers-list">${texts.map(t => `<div class="text-answer-item">"${escapeHTML(t)}"</div>`).join('')}</div>` : '<p class="text-muted">No text responses.</p>';
      }

      return `<div class="result-card"><h4 class="result-question-prompt">Q${idx+1}: ${escapeHTML(q.text)}</h4>${statsHTML}</div>`;
    }).join('');
  }

  // Raw Submissions Table
  const tbody = document.getElementById('raw-responses-table-body');
  tbody.innerHTML = responses.map((r, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><code>${r.responseId}</code></td>
      <td>${r.submittedAt}</td>
      <td>${Object.entries(r.answers).map(([qid, val]) => {
        const qText = activeSurvey.questions.find(x => x.id === qid)?.text || qid;
        return `<div><strong>${escapeHTML(qText)}:</strong> ${escapeHTML(Array.isArray(val) ? val.join(', ') : val)}</div>`;
      }).join('')}</td>
    </tr>
  `).join('') || '<tr><td colspan="4" class="text-center text-muted">No submissions recorded.</td></tr>';

  showAdminSection('admin-results-panel');
}

// 7. CSV EXPORT (Browser Blob API)
function exportCSV() {
  if (!activeSurvey) return;
  const responses = getResponses().filter(r => r.surveyId === activeSurvey.id);
  if (!responses.length) return alert("No responses to export.");

  const headers = ['Response ID', 'Timestamp', ...activeSurvey.questions.map(q => `"${q.text.replace(/"/g, '""')}"`)];
  const rows = responses.map(r => [
    `"${r.responseId}"`,
    `"${r.submittedAt}"`,
    ...activeSurvey.questions.map(q => {
      const v = r.answers[q.id];
      return `"${(Array.isArray(v) ? v.join('; ') : (v ?? '')).toString().replace(/"/g, '""')}"`;
    })
  ]);

  const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `results_${activeSurvey.id}.csv`;
  link.click();
}

// 8. BOOTSTRAPPER
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('surveys-grid')) initPublic();
  if (document.getElementById('admin-login-form')) initAdmin();
});