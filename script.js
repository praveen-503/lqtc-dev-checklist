/**
 * script.js - Modern Enterprise Dashboard Logic
 * Handles LocalStorage data layer, Render Engine, State Management, and Theming.
 */

/* ==========================================================================
   Model & Constants
   ========================================================================== */

const STORAGE_KEYS = {
    STORIES: 'userStories',
    BUGS: 'bugTracker',
    THEME: 'theme'
};

const BUG_CHECKLIST = [
    "Reviewed",
    "Recreated",
    "Fixed",
    "Released"
];

const STORY_CHECKLIST = [
    "Story RCI - 4 Estimation in Story Points",
    "Add Tasks to User Story",
    "Change Story Status to Active",
    "Create Feature Branch",
    "Development",
    "Internal Code/Database Scripts Review",
    "External Code/Database Scripts Review",
    "Merge Code into Release",
    "Deploy Code & Database Scripts Into DEV Environment",
    "Dev Integration Testing",
    "Update User Story Including Dev Testing Results",
    "Peer Dev Integration Testing",
    "Add comment to User Story stating Peer Dev Testing is completed",
    "Developer Demo",
    "Deploy Code & Database Scripts Into DEV INT Environment",
    "Update RB Description Section by linking the User Story #",
    "Update RB Database Section including Script Path & Change Set #",
    "Update RB Build Section including Build # and path to Jenkins Build",
    "Update RB Deployment Order with any other dependent RB or say no dependencies",
    "Add comment to RB stating Database Scripts Review & Approved (Peer Developer)",
    "Assign User Story to SQA Lead",
    "Send Release Note to SQA / Assign RB to SQA Lead"
];

let globalTargetModal = null; // Store reference to close explicitly
let currentStoryFilter = 'Active'; // Default filter for User Stories
let pendingConfirmCallback = null; // Stored callback for delete interactions

function showConfirmModal(message, callback) {
    document.getElementById('confirmDeleteMessage').textContent = message;
    pendingConfirmCallback = callback;
    const modalEl = document.getElementById('confirmDeleteModal');
    let modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (!modalInstance) modalInstance = new bootstrap.Modal(modalEl);
    modalInstance.show();
}

/* ==========================================================================
   Data Layer (LocalStorage)
   ========================================================================== */

function getStories() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STORIES)) || [];
}

function saveStories(stories) {
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories));
}

function getBugs() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BUGS)) || [];
}

function saveBugs(bugs) {
    localStorage.setItem(STORAGE_KEYS.BUGS, JSON.stringify(bugs));
}

function seedMockData() {
    let stories = getStories();
    let bugs = getBugs();

    if (stories.length === 0 && bugs.length === 0) {
        // Seed 1 story
        const storyId = 'id_' + Date.now();
        const initStoryChecks = Array(STORY_CHECKLIST.length).fill(false);
        initStoryChecks[0] = true;
        initStoryChecks[1] = true;
        
        stories.push({
            id: storyId,
            number: 'US-570749',
            priority: 'High',
            status: 'Active',
            devDate: '2026-04-10',
            releaseDate: '2026-04-20',
            createdAt: Date.now(),
            checklist: initStoryChecks,
            comments: [{ text: "Discussed with Scrum team. Approved for next sprint.", date: Date.now() }]
        });

        // Seed Bugs
        bugs.push({
            id: 'id_' + Date.now() + '1',
            number: 'BUGX291',
            description: 'Application crashes when saving a duplicate record during concurrent request.',
            status: 'Yet to Fix',
            relatedStory: storyId,
            createdAt: Date.now(),
            fixedDate: '',
            checklist: [true, true, false, false]
        });

        bugs.push({
            id: 'id_' + Date.now() + '2',
            number: 'BUGX188',
            description: 'UI misalignment in the header dropdown menu on mobile Safari.',
            status: 'Fixed',
            relatedStory: null,
            createdAt: Date.now() - 86400000,
            fixedDate: '2026-03-25',
            checklist: [true, true, true, false]
        });

        saveStories(stories);
        saveBugs(bugs);
    }
}

/* ==========================================================================
   Utility Functions
   ========================================================================== */

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function extractNumberForADO(str) {
    const match = str.match(/\d+/);
    return match ? match[0] : null;
}

function calculateProgress(checklistArray) {
    if (!checklistArray || checklistArray.length === 0) return 0;
    const completed = checklistArray.filter(v => v).length;
    return Math.round((completed / checklistArray.length) * 100);
}

function getPriorityBadgeClass(priority) {
    switch(priority) {
        case 'High': return 'bg-danger';
        case 'Medium': return 'bg-primary';
        case 'Low': return 'bg-success';
        default: return 'bg-secondary';
    }
}

/* ==========================================================================
   Render Engine
   ========================================================================== */

function setStoryFilter(filterValue) {
    currentStoryFilter = filterValue;
    
    // Update active class on tabs
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if(btn.dataset.filter === filterValue) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    renderAll();
}

function renderAll() {
    // Save currently open collapses to restore them after re-render
    const openCollapses = Array.from(document.querySelectorAll('.collapse.show')).map(el => el.id);

    updateRelatedStoryDropdown();
    const stories = getStories();
    const bugs = getBugs();
    
    // Process Active and Fixed bugs separately
    const activeBugs = bugs.filter(b => b.status !== 'Fixed');
    const fixedBugs = bugs.filter(b => b.status === 'Fixed');

    // Update Counts
    document.getElementById('activeBugsCount').textContent = activeBugs.length;
    document.getElementById('fixedBugsCount').textContent = fixedBugs.length;
    
    // Also update navbar badges
    const navActiveEl = document.getElementById('navActiveBugsCount');
    if (navActiveEl) navActiveEl.textContent = activeBugs.length;
    const navFixedEl = document.getElementById('navFixedBugsCount');
    if (navFixedEl) navFixedEl.textContent = fixedBugs.length;
    
    // Story Counts
    const activeStories = stories.filter(s => s.status === 'Active');
    const completedStories = stories.filter(s => s.status === 'Completed');
    
    document.getElementById('storiesCount').textContent = stories.length;
    const activeStoryEl = document.getElementById('activeStoriesCount');
    if (activeStoryEl) activeStoryEl.textContent = activeStories.length;
    const completedStoryEl = document.getElementById('completedStoriesCount');
    if (completedStoryEl) completedStoryEl.textContent = completedStories.length;
    
    // Filter Stories based on current UI selection
    let filteredStories = stories;
    if (currentStoryFilter !== 'All') {
        filteredStories = stories.filter(s => s.status === currentStoryFilter);
    }
    
    // Sort Filtered Stories
    const sortVal = document.getElementById('sortStoriesSelect').value;
    const sortedStories = [...filteredStories].sort((a, b) => {
        if (sortVal === 'newest') return b.createdAt - a.createdAt;
        if (sortVal === 'oldest') return a.createdAt - b.createdAt;
        if (sortVal === 'priority') {
            const pMap = { 'High': 3, 'Medium': 2, 'Low': 1 };
            return (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
        }
        return 0; // fallback
    });

    renderBugList('activeBugsList', activeBugs, 'active');
    renderBugList('fixedBugsList', fixedBugs, 'fixed');
    renderStoryList('userStoriesList', sortedStories);
    
    // Restore Open Collapses
    openCollapses.forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.classList.add('show');
            const btn = document.querySelector(`[data-bs-target="#${id}"]`);
            if(btn) btn.setAttribute('aria-expanded', 'true');
        }
    });
}

function renderBugList(containerId, bugArray, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    if (bugArray.length === 0) {
        container.innerHTML = `<div class="text-center text-muted small py-4">No ${type} bugs found.</div>`;
        return;
    }

    bugArray.forEach(bug => {
        const relatedStoryDisplay = bug.relatedStory ? `<div class="text-muted small mt-1"><i class="bi bi-link"></i> Story Link Associated</div>` : '';
        const progress = calculateProgress(bug.checklist);
        const cardClass = type === 'active' ? 'card-active-bug' : 'card-fixed-bug';
        const adoRef = extractNumberForADO(bug.number);
        const adoLink = adoRef ? `https://qtcado.qtcm.com/DefaultCollection/QTCAgile/_workitems/edit/${adoRef}` : '#';

        let checklistHTML = '<div class="checklist-container mt-2">';
        BUG_CHECKLIST.forEach((item, index) => {
            const isChecked = bug.checklist[index] ? 'checked' : '';
            checklistHTML += `
                <div class="checklist-item ${bug.checklist[index] ? 'checked' : ''}" onclick="event.stopPropagation(); toggleBugChecklist('${bug.id}', ${index})">
                    <input class="form-check-input mt-0" type="checkbox" ${isChecked} onclick="event.stopPropagation(); toggleBugChecklist('${bug.id}', ${index})">
                    <span>${item}</span>
                </div>
            `;
        });
        checklistHTML += '</div>';

        container.innerHTML += `
            <div class="dashboard-card ${cardClass}">
                <div class="card-actions">
                    <button class="btn btn-action-card btn-edit" title="Edit Bug" onclick="event.stopPropagation(); editBug('${bug.id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-action-card btn-delete" title="Delete Bug" onclick="event.stopPropagation(); deleteBug('${bug.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
                
                <div class="dashboard-card-header" data-bs-toggle="collapse" data-bs-target="#collapseBug-${bug.id}" aria-expanded="false" aria-controls="collapseBug-${bug.id}">
                    <div class="d-flex justify-content-between align-items-start pe-5">
                        <a href="${adoLink}" target="_blank" onclick="event.stopPropagation()" class="card-link mb-1 d-inline-block">${bug.number}</a>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-1 pe-5">
                        <span class="badge ${type === 'active' ? 'bg-danger' : 'bg-success'} card-badge">${type === 'active' ? 'Active' : 'Fixed'}</span>
                        <div class="text-muted small">
                            <i class="bi bi-chevron-down ms-1 dropdown-indicator"></i>
                        </div>
                    </div>
                    <div class="card-subtitle text-truncate-2 mt-2 mb-1 pe-2">${bug.description}</div>
                </div>

                <div class="collapse" id="collapseBug-${bug.id}">
                    <div class="pt-3 border-top mt-2">
                        <div class="d-flex flex-wrap gap-2 text-muted x-small align-items-center" style="font-size:0.75rem;">
                            <div><i class="bi bi-calendar-plus me-1"></i>${formatDate(bug.createdAt)}</div>
                            ${bug.fixedDate ? `<div><i class="bi bi-calendar-check me-1"></i>${formatDate(bug.fixedDate)}</div>` : ''}
                        </div>
                        ${relatedStoryDisplay}
                        
                        <div class="progress-wrapper mb-2 mt-3">
                            <div class="d-flex justify-content-between x-small text-muted mb-1" style="font-size:0.75rem; font-weight: 500;">
                                <span>Progress</span>
                                <span>${progress}%</span>
                            </div>
                            <div class="progress">
                                <div class="progress-bar ${type === 'fixed' ? 'bg-success' : ''}" role="progressbar" style="width: ${progress}%"></div>
                            </div>
                        </div>
                        
                        ${checklistHTML}
                    </div>
                </div>
            </div>
        `;
    });
}

function renderStoryList(containerId, storyArray) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    if (storyArray.length === 0) {
        container.innerHTML = `<div class="text-center text-muted small py-4">No stories found. Create one to get started.</div>`;
        return;
    }

    storyArray.forEach(story => {
        const progress = calculateProgress(story.checklist);
        const cardClass = story.status === 'Completed' ? 'completed' : '';
        const adoRef = extractNumberForADO(story.number);
        const adoLink = adoRef ? `https://qtcado.qtcm.com/DefaultCollection/QTCAgile/_workitems/edit/${adoRef}` : '#';

        let checklistHTML = '<div class="checklist-container mt-3">';
        STORY_CHECKLIST.forEach((item, index) => {
            const isChecked = story.checklist[index] ? 'checked' : '';
            checklistHTML += `
                <div class="checklist-item ${story.checklist[index] ? 'checked' : ''}" onclick="event.stopPropagation(); toggleStoryChecklist('${story.id}', ${index})">
                    <input class="form-check-input mt-0" type="checkbox" ${isChecked} onclick="event.stopPropagation(); toggleStoryChecklist('${story.id}', ${index})">
                    <span>${item}</span>
                </div>
            `;
        });
        checklistHTML += '</div>';

        container.innerHTML += `
            <div class="dashboard-card card-user-story ${cardClass}">
                <div class="card-actions">
                    <button class="btn btn-action-card btn-edit" title="Edit Story" onclick="event.stopPropagation(); editStory('${story.id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-action-card btn-email" title="Generate Release Email" onclick="event.stopPropagation(); openEmailTemplate('${story.id}')">
                        <i class="bi bi-envelope"></i>
                    </button>
                    <button class="btn btn-action-card btn-delete" title="Delete Story" onclick="event.stopPropagation(); deleteStory('${story.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
                
                <div class="dashboard-card-header" data-bs-toggle="collapse" data-bs-target="#collapseStory-${story.id}" aria-expanded="false" aria-controls="collapseStory-${story.id}">
                    <div class="d-flex justify-content-between align-items-start mb-2 pe-5">
                        <h6 class="card-title mb-0">
                            <a href="${adoLink}" target="_blank" onclick="event.stopPropagation()" class="card-link fs-6">${story.number}</a>
                        </h6>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mb-2 pe-5">
                        <div class="d-flex gap-2">
                            <span class="badge ${getPriorityBadgeClass(story.priority)} card-badge">${story.priority}</span>
                            <span class="badge ${story.status === 'Completed' ? 'bg-success' : 'bg-primary'} card-badge">${story.status}</span>
                        </div>
                        <div class="text-muted small">
                            <i class="bi bi-chevron-down ms-1 dropdown-indicator"></i>
                        </div>
                    </div>
                    
                    <div class="progress-wrapper pt-1 w-100 pe-5">
                        <div class="d-flex justify-content-between text-muted mb-1" style="font-size:0.8rem; font-weight: 600;">
                            <span>Process Completion</span>
                            <span>${progress}%</span>
                        </div>
                        <div class="progress" style="height: 6px;">
                            <div class="progress-bar ${progress === 100 ? 'bg-success' : ''}" role="progressbar" style="width: ${progress}%"></div>
                        </div>
                    </div>
                </div>

                <div class="collapse" id="collapseStory-${story.id}">
                    <div class="pt-3 border-top mt-3">
                        <div class="d-flex gap-4 text-muted x-small align-items-center mb-2" style="font-size:0.8rem;">
                            <div><i class="bi bi-code-slash me-1"></i>Dev Target: ${formatDate(story.devDate)}</div>
                            <div><i class="bi bi-rocket-takeoff me-1"></i>Rel Target: ${formatDate(story.releaseDate)}</div>
                        </div>

                        ${checklistHTML}

                        <!-- Meeting Notes / Comments -->
                        <div class="story-comments mt-4 pt-3 border-top border-light">
                            <h6 class="fs-6 fw-bold mb-3 text-primary"><i class="bi bi-chat-text"></i> Meeting Notes</h6>
                            
                            ${(() => {
                                let html = '';
                                if (story.comments && story.comments.length > 0) {
                                    html += '<div class="d-flex flex-column gap-2 mb-3">';
                                    story.comments.forEach((c, cIdx) => {
                                        const cDate = new Date(c.date).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                                        html += `
                                            <div class="comment-bubble d-flex flex-column p-2 rounded border">
                                                <div class="d-flex justify-content-between align-items-center mb-1">
                                                    <span class="x-small text-muted" style="font-size:0.75rem;"><i class="bi bi-clock me-1"></i>${cDate}</span>
                                                    <button class="btn btn-link text-danger p-0 border-0" style="font-size: 0.85rem" onclick="event.stopPropagation(); deleteStoryComment('${story.id}', ${cIdx})"><i class="bi bi-x-circle-fill"></i></button>
                                                </div>
                                                <span class="small" style="font-size:0.875rem; white-space: pre-wrap; word-break: break-word;">${c.text}</span>
                                            </div>
                                        `;
                                    });
                                    html += '</div>';
                                } else {
                                    html += '<div class="text-muted small mb-3 fst-italic">No notes recorded yet.</div>';
                                }
                                return html;
                            })()}

                            <div class="input-group input-group-sm" onclick="event.stopPropagation();">
                                <textarea class="form-control bg-light custom-scrollbar" id="comment-input-${story.id}" rows="1" style="resize: none;" placeholder="Type a note (Shift+Enter for newline)..." onkeydown="if(event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); addStoryComment('${story.id}'); }"></textarea>
                                <button class="btn btn-primary" type="button" onclick="event.stopPropagation(); addStoryComment('${story.id}')">Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

function updateRelatedStoryDropdown() {
    const dropdown = document.getElementById('bugRelatedStory');
    const stories = getStories();
    
    // Retain current selection if possible
    const currentVal = dropdown.value;
    
    dropdown.innerHTML = '<option value="">None</option>';
    stories.forEach(s => {
        dropdown.innerHTML += `<option value="${s.id}">${s.number}</option>`;
    });

    dropdown.value = currentVal;
}

/* ==========================================================================
   Interaction Handlers (Forms)
   ========================================================================== */

function saveStory() {
    const idField = document.getElementById('storyId').value;
    const isNew = !idField;
    
    let num = document.getElementById('storyNumber').value.trim();
    if (!num) return alert('Story Number is required');
    
    // Auto-prefix User Story number if missing
    if (!num.toUpperCase().startsWith('US-')) {
        num = 'US-' + num;
    }

    let stories = getStories();
    
    if (isNew) {
        stories.push({
            id: 'us_' + Date.now(),
            number: num,
            title: document.getElementById('storyTitle').value.trim(),
            rbNumber: document.getElementById('storyRbNumber').value.trim(),
            rbDescription: document.getElementById('storyRbDescription').value.trim(),
            buildNumber: document.getElementById('storyBuildNumber').value.trim(),
            priority: document.getElementById('storyPriority').value,
            status: document.getElementById('storyStatus').value,
            devDate: document.getElementById('storyDevDate').value,
            releaseDate: document.getElementById('storyReleaseDate').value,
            createdAt: Date.now(),
            checklist: Array(STORY_CHECKLIST.length).fill(false)
        });
    } else {
        const index = stories.findIndex(s => s.id === idField);
        if (index > -1) {
            stories[index].number = num;
            stories[index].title = document.getElementById('storyTitle').value.trim();
            stories[index].rbNumber = document.getElementById('storyRbNumber').value.trim();
            stories[index].rbDescription = document.getElementById('storyRbDescription').value.trim();
            stories[index].buildNumber = document.getElementById('storyBuildNumber').value.trim();
            stories[index].priority = document.getElementById('storyPriority').value;
            stories[index].status = document.getElementById('storyStatus').value;
            stories[index].devDate = document.getElementById('storyDevDate').value;
            stories[index].releaseDate = document.getElementById('storyReleaseDate').value;
        }
    }
    
    saveStories(stories);
    
    // Close Modal via BS5 API
    const modalEl = document.getElementById('userStoryModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if(modalInstance) modalInstance.hide();
    
    renderAll();
    resetStoryForm();
}

function editStory(id) {
    const stories = getStories();
    const story = stories.find(s => s.id === id);
    if (!story) return;

    document.getElementById('storyModalTitle').textContent = 'Edit User Story';
    document.getElementById('storyId').value = story.id;
    document.getElementById('storyNumber').value = story.number;
    document.getElementById('storyTitle').value = story.title || '';
    document.getElementById('storyRbNumber').value = story.rbNumber || '';
    document.getElementById('storyRbDescription').value = story.rbDescription || '';
    document.getElementById('storyBuildNumber').value = story.buildNumber || '';
    document.getElementById('storyPriority').value = story.priority;
    document.getElementById('storyStatus').value = story.status;
    document.getElementById('storyDevDate').value = story.devDate || '';
    document.getElementById('storyReleaseDate').value = story.releaseDate || '';

    const modal = new bootstrap.Modal(document.getElementById('userStoryModal'));
    modal.show();
}

function deleteStory(id) {
    showConfirmModal("Are you sure you want to delete this User Story? Actions cannot be undone.", () => {
        let stories = getStories();
        stories = stories.filter(s => s.id !== id);
        saveStories(stories);
        
        // Also cleanup linked bugs or leave them as orphaned as per general behavior
        let bugs = getBugs();
        let bugsModified = false;
        bugs.forEach(b => {
            if(b.relatedStory === id) {
                b.relatedStory = '';
                bugsModified = true;
            }
        });
        if(bugsModified) saveBugs(bugs);
        
        renderAll();
    });
}

function resetStoryForm() {
    document.getElementById('userStoryForm').reset();
    document.getElementById('storyId').value = '';
    document.getElementById('storyTitle').value = '';
    document.getElementById('storyRbNumber').value = '';
    document.getElementById('storyRbDescription').value = '';
    document.getElementById('storyBuildNumber').value = '';
    document.getElementById('storyModalTitle').textContent = 'Create User Story';
}

/* Bug Logic */
function prepareBugModal(statusPrefill = 'Yet to Fix') {
    resetBugForm();
    document.getElementById('bugStatus').value = statusPrefill;
}

function saveBug() {
    const idField = document.getElementById('bugId').value;
    const isNew = !idField;
    
    let num = document.getElementById('bugNumber').value.trim();
    const desc = document.getElementById('bugDescription').value.trim();
    const status = document.getElementById('bugStatus').value;
    
    if (!num || !desc) return alert('Bug Number and Description are required');

    // Auto-prefix Bug number if missing
    if (!num.toUpperCase().startsWith('BUGX')) {
        num = 'BUGX' + num;
    }

    let bugs = getBugs();
    
    if (isNew) {
        bugs.push({
            id: 'bug_' + Date.now(),
            number: num,
            description: desc,
            status: status,
            relatedStory: document.getElementById('bugRelatedStory').value,
            createdAt: Date.now(),
            fixedDate: status === 'Fixed' ? new Date().toISOString().split('T')[0] : '',
            checklist: Array(BUG_CHECKLIST.length).fill(false)
        });
    } else {
        const index = bugs.findIndex(b => b.id === idField);
        if (index > -1) {
            bugs[index].number = num;
            bugs[index].description = desc;
            
            // Re-evaluating dates if status changed from Active to Fixed
            if (status === 'Fixed' && bugs[index].status !== 'Fixed') {
                bugs[index].fixedDate = new Date().toISOString().split('T')[0];
            } else if (status !== 'Fixed') {
                bugs[index].fixedDate = '';
            }
            
            bugs[index].status = status;
            bugs[index].relatedStory = document.getElementById('bugRelatedStory').value;
        }
    }
    
    saveBugs(bugs);
    
    const modalEl = document.getElementById('bugModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if(modalInstance) modalInstance.hide();
    
    renderAll();
}

function editBug(id) {
    const bugs = getBugs();
    const bug = bugs.find(b => b.id === id);
    if (!bug) return;

    document.getElementById('bugModalTitle').textContent = 'Edit Bug';
    document.getElementById('bugId').value = bug.id;
    document.getElementById('bugNumber').value = bug.number;
    document.getElementById('bugDescription').value = bug.description;
    
    const statusField = document.getElementById('bugStatus');
    // Ensure accurate DOM assignment due to select element timing
    setTimeout(() => {
        statusField.value = bug.status === 'Fixed' ? 'Fixed' : 'Yet to Fix';
        document.getElementById('bugRelatedStory').value = bug.relatedStory || '';
    }, 10);

    const modal = new bootstrap.Modal(document.getElementById('bugModal'));
    modal.show();
}

function deleteBug(id) {
    showConfirmModal("Are you sure you want to delete this bug?", () => {
        let bugs = getBugs();
        bugs = bugs.filter(b => b.id !== id);
        saveBugs(bugs);
        renderAll();
    });
}

function resetBugForm() {
    document.getElementById('bugForm').reset();
    document.getElementById('bugId').value = '';
    document.getElementById('bugModalTitle').textContent = 'Report a Bug';
}

/* ==========================================================================
   Comments System
   ========================================================================== */

function addStoryComment(storyId) {
    const inputField = document.getElementById(`comment-input-${storyId}`);
    if(!inputField) return;
    const text = inputField.value.trim();
    if(!text) return;

    let stories = getStories();
    let target = stories.find(s => s.id === storyId);
    if(target) {
        if(!target.comments) target.comments = [];
        target.comments.push({ text: text, date: Date.now() });
        saveStories(stories);
        renderAll();
    }
}

function deleteStoryComment(storyId, commentIdx) {
    showConfirmModal("Are you sure you want to delete this note?", () => {
        let stories = getStories();
        let target = stories.find(s => s.id === storyId);
        if(target && target.comments) {
            target.comments.splice(commentIdx, 1);
            saveStories(stories);
            renderAll();
        }
    });
}

/* ==========================================================================
   Checklist Interactions
   ========================================================================== */

function toggleBugChecklist(bugId, itemIndex) {
    let bugs = getBugs();
    let target = bugs.find(b => b.id === bugId);
    if (target) {
        target.checklist[itemIndex] = !target.checklist[itemIndex];
        saveBugs(bugs);
        renderAll();
    }
}

function toggleStoryChecklist(storyId, itemIndex) {
    let stories = getStories();
    let target = stories.find(s => s.id === storyId);
    if (target) {
        target.checklist[itemIndex] = !target.checklist[itemIndex];
        saveStories(stories);
        renderAll();
    }
}

/* ==========================================================================
   Theme & Startup
   ========================================================================== */

function initTheme() {
    const rootInfo = document.documentElement;
    const themeIcon = document.getElementById('themeIcon');
    let currentTheme = localStorage.getItem(STORAGE_KEYS.THEME);

    if (!currentTheme) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        currentTheme = prefersDark ? 'dark' : 'light';
    }
    
    rootInfo.setAttribute('data-theme', currentTheme);
    themeIcon.className = currentTheme === 'dark' ? 'bi bi-sun-fill text-warning' : 'bi bi-moon-fill text-dark';
    
    document.getElementById('themeToggle').addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
        themeIcon.className = newTheme === 'dark' ? 'bi bi-sun-fill text-warning' : 'bi bi-moon-fill text-dark';
    });
}

// Bootstrap form reset upon modal dismiss
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('userStoryModal').addEventListener('hidden.bs.modal', resetStoryForm);
    document.getElementById('bugModal').addEventListener('hidden.bs.modal', resetBugForm);
    
    document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
        if(pendingConfirmCallback) pendingConfirmCallback();
        const modalEl = document.getElementById('confirmDeleteModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if(modalInstance) modalInstance.hide();
        pendingConfirmCallback = null;
    });

    // Core Init Sequence
    initTheme();
    seedMockData();
    renderAll();
});

/* ==========================================================================
   Email Template logic
   ========================================================================== */

function openEmailTemplate(storyId) {
    const stories = getStories();
    const story = stories.find(s => s.id === storyId);
    if (!story) return;

    const adoRef = extractNumberForADO(story.number);
    
    const title = story.title || 'No description provided';
    const rbNumber = story.rbNumber || '[Pending]';
    const rbDesc = story.rbDescription || '[Pending Description]';
    const buildNum = story.buildNumber || '[Pending]';

    let notesText = '';
    if (story.comments && story.comments.length > 0) {
        notesText = story.comments.map((c, i) => `${i + 1}. ${c.text}`).join('\n');
    } else {
        notesText = 'No specific notes.';
    }

    const emailTemplate = `Hi Team,

Below user story is ready for SQA

User Story ${adoRef || story.number}: ${title}

RB:
Release Baton ${rbNumber}: ${rbDesc}

Build Number: ${buildNum}

Note:
${notesText}

Thanks and Regards
Praveen Bommu`;

    document.getElementById('emailTemplateContent').textContent = emailTemplate;
    
    // Ensure feedback is hidden on open
    const feedback = document.getElementById('copySuccessFeedback');
    feedback.classList.remove('opacity-100');
    feedback.classList.add('opacity-0');
    
    const modal = new bootstrap.Modal(document.getElementById('emailTemplateModal'));
    modal.show();
}

function copyEmailText() {
    const content = document.getElementById('emailTemplateContent').textContent;
    navigator.clipboard.writeText(content).then(() => {
        const feedback = document.getElementById('copySuccessFeedback');
        feedback.classList.remove('opacity-0');
        feedback.classList.add('opacity-100');
        
        setTimeout(() => {
            feedback.classList.remove('opacity-100');
            feedback.classList.add('opacity-0');
        }, 2500);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy to clipboard.');
    });
}
