/**
 * IT Systems Review - Interactive Study Platform
 * State Management & Application Controller (QuizApp)
 */

/**
 * Glassmorphism UI/UX Modal Utilities replacing standard browser alert & confirm
 */
function showGlassAlert(message, title = 'Notification', icon = '✨', callback = null) {
  let modal = document.getElementById('custom-glass-alert-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'custom-glass-alert-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content glass-panel" style="border-radius: 30px; padding: 36px; max-width: 500px; animation: slideInUp 0.3s cubic-bezier(0.3, 0, 0.2, 1);">
        <div class="modal-header" style="display: flex; align-items: center; gap: 16px;">
          <div id="glass-alert-icon" class="modal-icon" style="width: 52px; height: 52px; font-size: 1.8rem; border-radius: 16px; background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">✨</div>
          <h2 id="glass-alert-title" style="font-size: 1.4rem; font-weight: 700; color: var(--text-primary); margin: 0;">Notification</h2>
        </div>
        <div class="modal-body" style="font-size: 1.02rem; line-height: 1.6; color: var(--text-secondary); margin: 8px 0;">
          <p id="glass-alert-message" style="margin: 0;"></p>
        </div>
        <div class="modal-footer" id="glass-alert-footer" style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 10px;">
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const iconEl = modal.querySelector('#glass-alert-icon');
  const titleEl = modal.querySelector('#glass-alert-title');
  const msgEl = modal.querySelector('#glass-alert-message');
  const footerEl = modal.querySelector('#glass-alert-footer');

  iconEl.innerHTML = icon;
  titleEl.textContent = title;
  msgEl.textContent = message;

  footerEl.innerHTML = '';
  const okBtn = document.createElement('button');
  okBtn.className = 'primary-btn';
  okBtn.style.cssText = 'padding: 12px 30px; border-radius: 30px; font-weight: 700; font-size: 0.95rem; cursor: pointer; border: none;';
  okBtn.textContent = 'Got it';

  const closeModal = () => {
    modal.classList.add('hidden');
    document.removeEventListener('keydown', keyHandler);
    if (typeof callback === 'function') callback();
  };

  const keyHandler = (e) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      e.preventDefault();
      closeModal();
    }
  };

  okBtn.onclick = closeModal;
  footerEl.appendChild(okBtn);

  modal.classList.remove('hidden');
  document.addEventListener('keydown', keyHandler);
  okBtn.focus();
}

function showGlassConfirm(message, title = 'Confirmation', icon = '❓', onConfirm = null, onCancel = null) {
  let modal = document.getElementById('custom-glass-confirm-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'custom-glass-confirm-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content glass-panel" style="border-radius: 30px; padding: 36px; max-width: 500px; animation: slideInUp 0.3s cubic-bezier(0.3, 0, 0.2, 1);">
        <div class="modal-header" style="display: flex; align-items: center; gap: 16px;">
          <div id="glass-confirm-icon" class="modal-icon" style="width: 52px; height: 52px; font-size: 1.8rem; border-radius: 16px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #f59e0b;">❓</div>
          <h2 id="glass-confirm-title" style="font-size: 1.4rem; font-weight: 700; color: var(--text-primary); margin: 0;">Confirmation</h2>
        </div>
        <div class="modal-body" style="font-size: 1.02rem; line-height: 1.6; color: var(--text-secondary); margin: 8px 0;">
          <p id="glass-confirm-message" style="margin: 0;"></p>
        </div>
        <div class="modal-footer" id="glass-confirm-footer" style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 10px;">
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const iconEl = modal.querySelector('#glass-confirm-icon');
  const titleEl = modal.querySelector('#glass-confirm-title');
  const msgEl = modal.querySelector('#glass-confirm-message');
  const footerEl = modal.querySelector('#glass-confirm-footer');

  iconEl.innerHTML = icon;
  titleEl.textContent = title;
  msgEl.textContent = message;

  footerEl.innerHTML = '';
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'secondary-btn';
  cancelBtn.style.cssText = 'padding: 12px 24px; border-radius: 30px; font-weight: 600; font-size: 0.95rem; cursor: pointer;';
  cancelBtn.textContent = 'Cancel';

  const yesBtn = document.createElement('button');
  yesBtn.className = 'primary-btn';
  yesBtn.style.cssText = 'padding: 12px 30px; border-radius: 30px; font-weight: 700; font-size: 0.95rem; cursor: pointer; border: none;';
  yesBtn.textContent = 'Confirm';

  const closeModal = (confirmed) => {
    modal.classList.add('hidden');
    document.removeEventListener('keydown', keyHandler);
    if (confirmed && typeof onConfirm === 'function') onConfirm();
    else if (!confirmed && typeof onCancel === 'function') onCancel();
  };

  const keyHandler = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      closeModal(true);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeModal(false);
    }
  };

  cancelBtn.onclick = () => closeModal(false);
  yesBtn.onclick = () => closeModal(true);

  footerEl.appendChild(cancelBtn);
  footerEl.appendChild(yesBtn);

  modal.classList.remove('hidden');
  document.addEventListener('keydown', keyHandler);
  yesBtn.focus();
}

class QuizApp {
  constructor() {
    // Core Application State
    this.state = {
      questions: [],
      filteredQuestions: [],
      currentQuestionIndex: 0, // Index inside filteredQuestions
      currentMode: 'practice', // 'practice' or 'exam'
      currentFilter: 'all',    // 'all', 'true_false', 'single_choice', 'fill_blank', 'favorites'
      searchQuery: '',
      quizProgress: {},        // Map: { [questionId]: { answered: boolean, isCorrect: boolean, userAnswer: any, revealed: boolean } }
      favorites: [],           // Array of question IDs
      darkMode: true,
      examState: {
        active: false,
        timeRemaining: 2700,   // 45 minutes in seconds
        timerId: null,
        questions: [],         // 30 randomly selected questions for exam session
        answers: {},           // Map: { [questionId]: userAnswer }
        submitted: false
      }
    };

    // DOM Elements Cache
    this.dom = {
      // Header & Stats
      statReviewed: document.getElementById('stat-reviewed'),
      statAccuracy: document.getElementById('stat-accuracy'),
      modePracticeBtn: document.getElementById('mode-practice-btn'),
      modeExamBtn: document.getElementById('mode-exam-btn'),
      resetProgressBtn: document.getElementById('reset-progress-btn'),
      themeToggleBtn: document.getElementById('theme-toggle-btn'),
      themeIconSun: document.getElementById('theme-icon-sun'),
      themeIconMoon: document.getElementById('theme-icon-moon'),

      // Sidebar & Filters
      filteredCountBadge: document.getElementById('filtered-count-badge'),
      searchInput: document.getElementById('question-search-input'),
      clearSearchBtn: document.getElementById('clear-search-btn'),
      filterPills: document.querySelectorAll('.filter-pill'),
      favoriteFilterCount: document.getElementById('favorite-filter-count'),
      questionGrid: document.getElementById('question-grid'),

      // Question Card
      questionCard: document.getElementById('question-card'),
      questionNumberBadge: document.getElementById('question-number-badge'),
      questionTypeBadge: document.getElementById('question-type-badge'),
      favoriteToggleBtn: document.getElementById('favorite-toggle-btn'),
      noteToggleBtn: document.getElementById('note-toggle-btn'),
      questionText: document.getElementById('question-text'),
      noteContainer: document.getElementById('note-container'),
      noteTextarea: document.getElementById('note-textarea'),
      optionsContainer: document.getElementById('options-container'),
      feedbackBox: document.getElementById('feedback-box'),
      feedbackStatusIcon: document.getElementById('feedback-status-icon'),
      feedbackTitle: document.getElementById('feedback-title'),
      feedbackExplanation: document.getElementById('feedback-explanation'),

      // Card Navigation & Actions
      prevQuestionBtn: document.getElementById('prev-question-btn'),
      nextQuestionBtn: document.getElementById('next-question-btn'),
      revealAnswerBtn: document.getElementById('reveal-answer-btn'),

      // Exam Mode
      examControls: document.getElementById('exam-controls'),
      examTimerDisplay: document.getElementById('exam-timer-display'),
      examAnsweredCount: document.getElementById('exam-answered-count'),
      submitExamBtn: document.getElementById('submit-exam-btn'),
      examResultsCard: document.getElementById('exam-results-card'),
      examScorePercentage: document.getElementById('exam-score-percentage'),
      resTotal: document.getElementById('res-total'),
      resCorrect: document.getElementById('res-correct'),
      resIncorrect: document.getElementById('res-incorrect'),
      reviewExamBtn: document.getElementById('review-exam-btn'),
      retakeExamBtn: document.getElementById('retake-exam-btn'),

      // File Selector Modal (CORS Mitigation)
      fileSelectorModal: document.getElementById('file-selector-modal'),
      csvFileInput: document.getElementById('csv-file-input'),
      loadCsvBtn: document.getElementById('load-csv-btn'),
      fileDropArea: document.querySelector('.file-drop-area'),
      fileUploadLabel: document.getElementById('file-upload-label')
    };

    // Initialize the App
    this.init();
  }

  /**
   * Initialize LocalStorage, Event Bindings, and Load Question Bank
   */
  async init() {
    this.loadStateFromStorage();
    this.applyTheme();
    this.bindEvents();
    await this.loadQuestionBank();
  }

  /**
   * Load stored progress, favorites, and theme preference from LocalStorage
   */
  loadStateFromStorage() {
    try {
      const storedProgress = localStorage.getItem('ita301_review_progress');
      if (storedProgress) {
        this.state.quizProgress = JSON.parse(storedProgress);
      }

      const storedFavorites = localStorage.getItem('ita301_review_favorites');
      if (storedFavorites) {
        this.state.favorites = JSON.parse(storedFavorites);
      }

      const storedTheme = localStorage.getItem('it_review_dark_mode');
      if (storedTheme !== null) {
        this.state.darkMode = JSON.parse(storedTheme);
      }
    } catch (error) {
      console.warn('LocalStorage not available or corrupted. Resetting local state.', error);
      this.state.quizProgress = {};
      this.state.favorites = [];
    }
  }

  /**
   * Save progress and favorites to LocalStorage
   */
  saveStateToStorage() {
    try {
      localStorage.setItem('ita301_review_progress', JSON.stringify(this.state.quizProgress));
      localStorage.setItem('ita301_review_favorites', JSON.stringify(this.state.favorites));
      localStorage.setItem('it_review_dark_mode', JSON.stringify(this.state.darkMode));
    } catch (error) {
      console.error('Failed to save state to LocalStorage:', error);
    }
  }

  /**
   * Apply Dark/Light theme class to body and update toggle icons
   */
  applyTheme() {
    if (this.state.darkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
      this.dom.themeIconSun.classList.remove('hidden');
      this.dom.themeIconMoon.classList.add('hidden');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
      this.dom.themeIconSun.classList.add('hidden');
      this.dom.themeIconMoon.classList.remove('hidden');
    }
  }

  /**
   * Bind all event listeners
   */
  bindEvents() {
    // Theme & Reset
    this.dom.themeToggleBtn.addEventListener('click', () => {
      this.state.darkMode = !this.state.darkMode;
      this.applyTheme();
      this.saveStateToStorage();
    });

    this.dom.resetProgressBtn.addEventListener('click', () => this.handleResetProgress());

    // Mode Switchers
    this.dom.modePracticeBtn.addEventListener('click', () => this.switchMode('practice'));
    this.dom.modeExamBtn.addEventListener('click', () => this.switchMode('exam'));

    // Search & Debounce
    let searchTimeout = null;
    this.dom.searchInput.addEventListener('input', (e) => {
      const query = e.target.value;
      if (query.length > 0) {
        this.dom.clearSearchBtn.classList.remove('hidden');
      } else {
        this.dom.clearSearchBtn.classList.add('hidden');
      }

      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.state.searchQuery = query.trim().toLowerCase();
        this.filterQuestions();
      }, 200);
    });

    this.dom.clearSearchBtn.addEventListener('click', () => {
      this.dom.searchInput.value = '';
      this.state.searchQuery = '';
      this.dom.clearSearchBtn.classList.add('hidden');
      this.filterQuestions();
    });

    // Filter Pills
    this.dom.filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        this.dom.filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.state.currentFilter = pill.getAttribute('data-filter');
        this.filterQuestions();
      });
    });

    // Sidebar Grid Event Delegation
    this.dom.questionGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.grid-btn');
      if (btn) {
        const questionId = parseInt(btn.getAttribute('data-id'), 10);
        this.navigateToQuestionById(questionId);
      }
    });

    this.dom.prevQuestionBtn.addEventListener('click', () => this.navigateRelative(-1));
    this.dom.nextQuestionBtn.addEventListener('click', () => this.navigateRelative(1));
    this.dom.favoriteToggleBtn.addEventListener('click', () => this.toggleFavoriteCurrent());

    // Note Toggle & Input
    this.dom.noteToggleBtn.addEventListener('click', () => {
       const isHidden = this.dom.noteContainer.classList.contains('hidden');
       if (isHidden) {
          this.dom.noteContainer.classList.remove('hidden');
          this.dom.noteToggleBtn.classList.add('active');
          this.dom.noteTextarea.focus();
       } else {
          this.dom.noteContainer.classList.add('hidden');
          this.dom.noteToggleBtn.classList.remove('active');
       }
    });

    this.dom.noteTextarea.addEventListener('input', (e) => {
       const q = this.state.filteredQuestions[this.state.currentQuestionIndex];
       if (!q) return;
       const note = e.target.value.trim();
       if (!this.state.quizProgress[q.id]) {
           this.state.quizProgress[q.id] = { answered: false, isCorrect: false, userAnswer: null, revealed: false, note: '' };
       }
       this.state.quizProgress[q.id].note = note;
       this.saveStateToStorage();
       this.renderSidebar(); // Update grid indicators
       this.updateStats(); // Update note count badge
    });

    this.dom.revealAnswerBtn.addEventListener('click', () => this.revealAnswer());

    // Exam Mode Controls
    this.dom.submitExamBtn.addEventListener('click', () => this.submitExam());
    this.dom.reviewExamBtn.addEventListener('click', () => this.reviewExamIncorrect());
    this.dom.retakeExamBtn.addEventListener('click', () => this.startExamSession());

    // Fallback File Selector (Drag/Drop and Change)
    this.dom.csvFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        this.dom.fileUploadLabel.textContent = `Selected: ${e.target.files[0].name}`;
        this.dom.loadCsvBtn.disabled = false;
      }
    });

    this.dom.fileDropArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.dom.fileDropArea.style.borderColor = 'var(--accent-primary)';
    });

    this.dom.fileDropArea.addEventListener('dragleave', () => {
      this.dom.fileDropArea.style.borderColor = 'var(--glass-border-highlight)';
    });

    this.dom.fileDropArea.addEventListener('drop', (e) => {
      e.preventDefault();
      this.dom.fileDropArea.style.borderColor = 'var(--glass-border-highlight)';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        this.dom.csvFileInput.files = e.dataTransfer.files;
        this.dom.fileUploadLabel.textContent = `Selected: ${e.dataTransfer.files[0].name}`;
        this.dom.loadCsvBtn.disabled = false;
      }
    });

    this.dom.loadCsvBtn.addEventListener('click', () => {
      const file = this.dom.csvFileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.dom.fileSelectorModal.classList.add('hidden');
          this.processCSVData(e.target.result);
        };
        reader.readAsText(file);
      }
    });

    // Global Keyboard Navigation (Skip/Next, Previous, Option Selection Up/Down, and Enter to Confirm)
    document.addEventListener('keydown', (e) => {
      // Ignore if user is typing inside an input, textarea, or contenteditable element
      const activeEl = document.activeElement;
      const isInputActive = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable);

      if (isInputActive) {
        return;
      }

      // 1. Up / Down arrows for selecting among options
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const options = Array.from(this.dom.optionsContainer.querySelectorAll('.option-item:not(.disabled)'));
        if (options.length === 0) return;

        e.preventDefault();
        const currentIndex = options.findIndex(opt => opt.classList.contains('selected'));
        let newIndex;

        if (e.key === 'ArrowDown') {
          newIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % options.length;
        } else {
          newIndex = currentIndex === -1 ? options.length - 1 : (currentIndex - 1 + options.length) % options.length;
        }

        options.forEach(opt => opt.classList.remove('selected'));
        const targetOption = options[newIndex];
        targetOption.classList.add('selected');
        targetOption.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

        // If in Exam mode, immediately record selected option
        if (this.state.currentMode === 'exam') {
          const q = this.state.filteredQuestions[this.state.currentQuestionIndex];
          if (q) {
            const idx = parseInt(targetOption.getAttribute('data-index'), 10);
            this.state.examState.answers[q.id] = idx;
            this.updateExamProgressDisplay();
          }
        }
        return;
      }

      // 2. Enter to confirm and select the highlighted option
      if (e.key === 'Enter') {
        const selectedOption = this.dom.optionsContainer.querySelector('.option-item.selected:not(.disabled)');
        if (selectedOption) {
          e.preventDefault();
          selectedOption.click();
        }
        return;
      }

      // 3. Next / Skip question: ArrowRight, 'n', 'N', 's', 'S'
      if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        this.navigateRelative(1);
      }
      // 4. Previous question: ArrowLeft, 'p', 'P', 'b', 'B'
      else if (e.key === 'ArrowLeft' || e.key === 'p' || e.key === 'P' || e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        this.navigateRelative(-1);
      }
    });
  }

  /**
   * Attempt to load questions.csv automatically via fetch
   * If blocked by CORS (file://), open fallback selector modal
   */
  async loadQuestionBank() {
    try {
      let response = await fetch('questions_ita.csv');
      if (!response.ok) {
        response = await fetch('ita301/questions_ita.csv');
      }
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      const csvText = await response.text();
      this.processCSVData(csvText);
    } catch (error) {
      console.info('Direct fetch of questions_ita.csv failed (likely opened via file:// protocol or CORS). Showing local file selector modal.', error);
      this.dom.fileSelectorModal.classList.remove('hidden');
    }
  }

  /**
   * Process and parse raw CSV string into structured question objects
   */
  processCSVData(csvText) {
    const questions = this.parseCSV(csvText);
    if (questions.length === 0) {
      showGlassAlert('Could not parse any valid questions from questions_ita.csv. Please verify file structure.', 'Parsing Error', '⚠️');
      return;
    }

    this.state.questions = questions;
    this.state.filteredQuestions = [...questions];
    this.state.currentQuestionIndex = 0;

    this.updateStats();
    this.renderSidebar();
    this.renderQuestionCard();
  }

  /**
   * Robust RFC 4180 CSV parser handling quoted fields, commas inside options, and multi-line values
   */
  parseCSV(text) {
    const lines = [];
    let currentField = '';
    let currentRow = [];
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (inQuotes) {
        if (char === '"') {
          if (nextChar === '"') {
            currentField += '"';
            i++; // Skip escaped double quote
          } else {
            inQuotes = false;
          }
        } else {
          currentField += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          currentRow.push(currentField);
          currentField = '';
        } else if (char === '\r' || char === '\n') {
          if (char === '\r' && nextChar === '\n') {
            i++;
          }
          currentRow.push(currentField);
          currentField = '';
          if (currentRow.length > 1 || currentRow[0] !== '') {
            lines.push(currentRow);
          }
          currentRow = [];
        } else {
          currentField += char;
        }
      }
    }

    // Push any trailing row data
    if (currentField || currentRow.length > 0) {
      currentRow.push(currentField);
      if (currentRow.length > 1 || currentRow[0] !== '') {
        lines.push(currentRow);
      }
    }

    if (lines.length <= 1) return [];

    const parsedQuestions = [];
    // Start from line index 1 to skip header: id,type,question,options,correctAnswer
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i];
      if (row.length < 5) continue;

      const id = parseInt(row[0].trim(), 10);
      if (isNaN(id)) continue;

      const type = row[1].trim();
      const question = row[2].trim();
      const optionsStr = row[3] || '';
      const options = optionsStr ? optionsStr.split('|').map(o => o.trim()) : [];
      let correctAnswer = row[4] ? row[4].trim() : '';

      // For multiple choice and true/false, convert answer index string to integer
      if (type === 'true_false' || type === 'single_choice') {
        const idx = parseInt(correctAnswer, 10);
        if (!isNaN(idx)) {
          correctAnswer = idx;
        }
      }

      parsedQuestions.push({
        id,
        type,
        question,
        options,
        correctAnswer
      });
    }

    return parsedQuestions;
  }

  /**
   * Filter questions based on current active tab and search input query
   */
  filterQuestions() {
    const { questions, currentFilter, searchQuery, favorites, quizProgress } = this.state;

    this.state.filteredQuestions = questions.filter(q => {
      // Category Filter
      if (currentFilter === 'true_false' && q.type !== 'true_false') return false;
      if (currentFilter === 'single_choice' && q.type !== 'single_choice') return false;
      if (currentFilter === 'fill_blank' && q.type !== 'fill_blank') return false;
      if (currentFilter === 'favorites' && !favorites.includes(q.id)) return false;

      if (currentFilter === 'correct') {
        const prog = quizProgress[q.id];
        if (!prog || !prog.isCorrect) return false;
      }

      if (currentFilter === 'incorrect') {
        const prog = quizProgress[q.id];
        if (!prog || prog.isCorrect) return false;
      }
      
      if (currentFilter === 'notes') {
        const prog = quizProgress[q.id];
        if (!prog || !prog.note || prog.note.trim().length === 0) return false;
      }

      // Search Query Match (across question text and options)
      if (searchQuery) {
        const matchQuestion = q.question.toLowerCase().includes(searchQuery);
        const matchOptions = q.options.some(opt => opt.toLowerCase().includes(searchQuery));
        const matchId = `question #${q.id}`.includes(searchQuery) || q.id.toString() === searchQuery;
        if (!matchQuestion && !matchOptions && !matchId) {
          return false;
        }
      }

      return true;
    });

    // Ensure currentQuestionIndex remains valid
    if (this.state.currentQuestionIndex >= this.state.filteredQuestions.length) {
      this.state.currentQuestionIndex = Math.max(0, this.state.filteredQuestions.length - 1);
    }

    this.renderSidebar();
    if (this.state.filteredQuestions.length > 0) {
      this.renderQuestionCard();
    } else {
      this.renderEmptyState();
    }
  }

  /**
   * Update header progress indicators and sidebar category counts
   */
  updateStats() {
    const { questions, quizProgress, favorites } = this.state;
    const totalCount = questions.length;

    let answeredCount = 0;
    let correctCount = 0;

    Object.values(quizProgress).forEach(prog => {
      if (prog.answered) {
        answeredCount++;
        if (prog.isCorrect) {
          correctCount++;
        }
      }
    });

    const accuracyRate = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

    this.dom.statReviewed.textContent = `${answeredCount} / ${totalCount}`;
    this.dom.statAccuracy.textContent = `${accuracyRate}%`;
    this.dom.favoriteFilterCount.textContent = favorites.length;

    // Update filter count numbers inside pills
    const countTF = questions.filter(q => q.type === 'true_false').length;
    const countChoice = questions.filter(q => q.type === 'single_choice').length;
    const countFill = questions.filter(q => q.type === 'fill_blank').length;

    const pills = this.dom.filterPills;
    pills.forEach(pill => {
      const filter = pill.getAttribute('data-filter');
      const badge = pill.querySelector('.filter-count');
      if (!badge) return;
      if (filter === 'all') badge.textContent = totalCount;
      if (filter === 'true_false') badge.textContent = countTF;
      if (filter === 'single_choice') badge.textContent = countChoice;
      if (filter === 'fill_blank') badge.textContent = countFill;
      if (filter === 'favorites') badge.textContent = favorites.length;
      if (filter === 'correct') badge.textContent = correctCount;
      if (filter === 'incorrect') badge.textContent = answeredCount - correctCount;
      if (filter === 'notes') {
         const countNotes = questions.filter(q => quizProgress[q.id] && quizProgress[q.id].note && quizProgress[q.id].note.trim().length > 0).length;
         badge.textContent = countNotes;
      }
    });
  }

  /**
   * Render Sidebar Question Grid using DocumentFragment
   */
  renderSidebar() {
    const { filteredQuestions, currentQuestionIndex, quizProgress, favorites } = this.state;
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    const currentId = currentQuestion ? currentQuestion.id : -1;

    this.dom.filteredCountBadge.textContent = filteredQuestions.length;
    this.dom.questionGrid.innerHTML = '';

    if (filteredQuestions.length === 0) {
      this.dom.questionGrid.innerHTML = '<div class="grid-loading">No matching questions found.</div>';
      return;
    }

    const fragment = document.createDocumentFragment();

    filteredQuestions.forEach(q => {
      const btn = document.createElement('button');
      btn.className = 'grid-btn';
      btn.setAttribute('data-id', q.id);
      btn.textContent = q.id;

      // Check active state
      if (q.id === currentId) {
        btn.classList.add('active');
      }

      // Check progress status
      const prog = quizProgress[q.id];
      if (prog && prog.answered) {
        if (prog.isCorrect) {
          btn.classList.add('status-correct');
        } else {
          btn.classList.add('status-incorrect');
        }
      }

      // Check favorite star
      if (favorites.includes(q.id)) {
        btn.classList.add('is-favorite');
      }

      // Check notes
      if (prog && prog.note && prog.note.trim().length > 0) {
        btn.classList.add('has-note');
      }

      fragment.appendChild(btn);
    });

    this.dom.questionGrid.appendChild(fragment);
  }

  /**
   * Render Main Question Card based on current active question and mode
   */
  renderQuestionCard() {
    const { filteredQuestions, currentQuestionIndex, currentMode, quizProgress, favorites, examState } = this.state;
    const q = filteredQuestions[currentQuestionIndex];

    if (!q) {
      this.renderEmptyState();
      return;
    }

    // Hide empty states & feedback boxes initially when rendering new card
    this.dom.questionCard.classList.remove('hidden');
    this.dom.feedbackBox.classList.add('hidden');
    this.dom.feedbackBox.className = 'feedback-box hidden';

    // Set Card Metadata
    this.dom.questionNumberBadge.textContent = `Question #${q.id}`;

    let typeLabel = 'MULTIPLE CHOICE';
    if (q.type === 'true_false') typeLabel = 'TRUE / FALSE';
    if (q.type === 'fill_blank') typeLabel = 'FILL IN THE BLANK';
    this.dom.questionTypeBadge.textContent = typeLabel;

    // Favorite Button State
    const isFav = favorites.includes(q.id);
    this.dom.favoriteToggleBtn.classList.toggle('active', isFav);
    this.dom.favoriteToggleBtn.querySelector('.star-icon').textContent = isFav ? '★' : '☆';

    // Question Text
    this.dom.questionText.textContent = q.question;

    // Note State
    const prog = quizProgress[q.id];
    if (prog && prog.note && prog.note.trim().length > 0) {
       this.dom.noteTextarea.value = prog.note;
       this.dom.noteContainer.classList.remove('hidden');
       this.dom.noteToggleBtn.classList.add('active');
    } else {
       this.dom.noteTextarea.value = '';
       this.dom.noteContainer.classList.add('hidden');
       this.dom.noteToggleBtn.classList.remove('active');
    }

    // Render Options / Input Container
    this.dom.optionsContainer.innerHTML = '';

    const isAnsweredOrRevealed = prog && (prog.answered || prog.revealed);

    if (q.type === 'true_false' || q.type === 'single_choice') {
      const markers = ['A', 'B', 'C', 'D', 'E', 'F'];

      q.options.forEach((optText, idx) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option-item';
        optionDiv.setAttribute('data-index', idx);

        const markerSpan = document.createElement('span');
        markerSpan.className = 'option-marker';
        markerSpan.textContent = markers[idx] || (idx + 1);

        const textSpan = document.createElement('span');
        textSpan.className = 'option-text';
        textSpan.textContent = optText;

        optionDiv.appendChild(markerSpan);
        optionDiv.appendChild(textSpan);

        // Styling based on Practice vs Exam Mode
        if (currentMode === 'practice') {
          if (isAnsweredOrRevealed) {
            optionDiv.classList.add('disabled');
            // Highlight user answer
            if (prog.userAnswer === idx) {
              optionDiv.classList.add('selected');
              if (!prog.isCorrect) {
                optionDiv.classList.add('status-incorrect');
              }
            }
            // Highlight correct answer
            if (q.correctAnswer === idx) {
              optionDiv.classList.add('status-correct');
            }
          } else {
            // Interactive Selection and Instant Auto-Check
            optionDiv.addEventListener('click', () => {
              this.dom.optionsContainer.querySelectorAll('.option-item').forEach(el => el.classList.remove('selected'));
              optionDiv.classList.add('selected');
              this.checkAnswer(idx);
            });
          }
        } else if (currentMode === 'exam') {
          // Exam mode: reflect selected answer without feedback
          const examAns = examState.answers[q.id];
          if (examAns === idx) {
            optionDiv.classList.add('selected');
          }
          optionDiv.addEventListener('click', () => {
            this.dom.optionsContainer.querySelectorAll('.option-item').forEach(el => el.classList.remove('selected'));
            optionDiv.classList.add('selected');
            this.state.examState.answers[q.id] = idx;
            this.updateExamProgressDisplay();
          });
        }

        this.dom.optionsContainer.appendChild(optionDiv);
      });
    } else if (q.type === 'fill_blank') {
      const container = document.createElement('div');
      container.className = 'fill-blank-container';

      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'fill-blank-input';
      input.placeholder = 'Type your exact answer here...';

      if (currentMode === 'practice' && isAnsweredOrRevealed) {
        input.value = prog.userAnswer || '';
        input.disabled = true;
      } else if (currentMode === 'practice' && !isAnsweredOrRevealed) {
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && input.value.trim() !== '') {
            this.checkAnswer(input.value.trim());
          }
        });
        const hint = document.createElement('p');
        hint.style.cssText = 'font-size: 0.8rem; color: var(--text-muted); margin-top: 8px;';
        hint.textContent = 'Press Enter to check your answer immediately.';
        container.appendChild(hint);
      } else if (currentMode === 'exam') {
        input.value = examState.answers[q.id] || '';
        input.addEventListener('input', (e) => {
          this.state.examState.answers[q.id] = e.target.value.trim();
          this.updateExamProgressDisplay();
        });
      }

      container.appendChild(input);
      this.dom.optionsContainer.appendChild(container);
    }

    // Show Feedback if in Practice Mode and question was previously answered/revealed
    if (currentMode === 'practice' && isAnsweredOrRevealed) {
      this.showFeedbackBox(prog.isCorrect, q, prog.revealed);
      this.dom.revealAnswerBtn.disabled = true;
    } else {
      this.dom.revealAnswerBtn.disabled = false;
    }

    // Update Navigation Button States
    this.dom.prevQuestionBtn.disabled = (currentQuestionIndex === 0);
    this.dom.nextQuestionBtn.disabled = (currentQuestionIndex === filteredQuestions.length - 1);

    // Update Grid active state without rebuilding entire DOM
    const gridBtns = this.dom.questionGrid.querySelectorAll('.grid-btn');
    gridBtns.forEach(btn => {
      const btnId = parseInt(btn.getAttribute('data-id'), 10);
      btn.classList.toggle('active', btnId === q.id);
    });
  }

  /**
   * Render empty state when search/filter returns no results
   */
  renderEmptyState() {
    this.dom.questionNumberBadge.textContent = 'No Results';
    this.dom.questionTypeBadge.textContent = 'FILTER';
    this.dom.questionText.textContent = 'No questions match your current search query or filter selection.';
    this.dom.optionsContainer.innerHTML = '<p style="color: var(--text-muted);">Try clearing your search input or switching to the "All" filter tab.</p>';
    this.dom.feedbackBox.classList.add('hidden');
    this.dom.prevQuestionBtn.disabled = true;
    this.dom.nextQuestionBtn.disabled = true;
  }

  /**
   * Practice Mode: Check selected answer against correct answer instantly
   */
  checkAnswer(directAnswer) {
    const { filteredQuestions, currentQuestionIndex } = this.state;
    const q = filteredQuestions[currentQuestionIndex];
    if (!q) return;

    let userAnswer = directAnswer !== undefined ? directAnswer : null;
    let isCorrect = false;

    if (q.type === 'true_false' || q.type === 'single_choice') {
      if (userAnswer === null) {
        const selectedEl = this.dom.optionsContainer.querySelector('.option-item.selected');
        if (!selectedEl) return;
        userAnswer = parseInt(selectedEl.getAttribute('data-index'), 10);
      }
      isCorrect = (userAnswer === q.correctAnswer);
    } else if (q.type === 'fill_blank') {
      if (userAnswer === null) {
        const inputEl = this.dom.optionsContainer.querySelector('.fill-blank-input');
        if (!inputEl || !inputEl.value.trim()) return;
        userAnswer = inputEl.value.trim();
      }
      isCorrect = (userAnswer.toString().trim().toLowerCase() === q.correctAnswer.toString().trim().toLowerCase());
    }

    // Save progress
    this.state.quizProgress[q.id] = {
      answered: true,
      isCorrect,
      userAnswer,
      revealed: false
    };

    this.saveStateToStorage();
    this.updateStats();
    this.renderSidebar();
    this.renderQuestionCard();
  }

  /**
   * Practice Mode: Reveal correct answer immediately
   */
  revealAnswer() {
    const { filteredQuestions, currentQuestionIndex } = this.state;
    const q = filteredQuestions[currentQuestionIndex];
    if (!q) return;

    this.state.quizProgress[q.id] = {
      answered: true,
      isCorrect: false,
      userAnswer: null,
      revealed: true
    };

    this.saveStateToStorage();
    this.updateStats();
    this.renderSidebar();
    this.renderQuestionCard();
  }

  /**
   * Show feedback box with explanation and correct answer details
   */
  showFeedbackBox(isCorrect, q, isRevealed = false) {
    this.dom.feedbackBox.classList.remove('hidden');

    if (isRevealed) {
      this.dom.feedbackBox.className = 'feedback-box correct';
      this.dom.feedbackStatusIcon.textContent = 'i';
      this.dom.feedbackTitle.textContent = 'Answer Revealed';
    } else if (isCorrect) {
      this.dom.feedbackBox.className = 'feedback-box correct';
      this.dom.feedbackStatusIcon.textContent = '✓';
      this.dom.feedbackTitle.textContent = 'Correct Answer!';
    } else {
      this.dom.feedbackBox.className = 'feedback-box incorrect';
      this.dom.feedbackStatusIcon.textContent = '✕';
      this.dom.feedbackTitle.textContent = 'Incorrect Answer';
    }

    let explanationText = '';
    if (q.type === 'true_false' || q.type === 'single_choice') {
      const correctOptionText = q.options[q.correctAnswer] || 'Unknown';
      explanationText = `The correct answer is: "${correctOptionText}".`;
    } else if (q.type === 'fill_blank') {
      explanationText = `The exact answer expected is: "${q.correctAnswer}".`;
    }

    this.dom.feedbackExplanation.textContent = explanationText;
  }

  /**
   * Navigate relative to current question index (+1 or -1)
   */
  navigateRelative(offset) {
    const newIndex = this.state.currentQuestionIndex + offset;
    if (newIndex >= 0 && newIndex < this.state.filteredQuestions.length) {
      this.state.currentQuestionIndex = newIndex;
      this.renderQuestionCard();
      this.scrollToActiveGridButton();
    }
  }

  /**
   * Navigate directly to a question by ID
   */
  navigateToQuestionById(questionId) {
    const idx = this.state.filteredQuestions.findIndex(q => q.id === questionId);
    if (idx !== -1) {
      this.state.currentQuestionIndex = idx;
      this.renderQuestionCard();
    }
  }

  /**
   * Scroll active grid button into view smoothly inside sidebar
   */
  scrollToActiveGridButton() {
    const activeBtn = this.dom.questionGrid.querySelector('.grid-btn.active');
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /**
   * Toggle favorite (star) status for current question
   */
  toggleFavoriteCurrent() {
    const q = this.state.filteredQuestions[this.state.currentQuestionIndex];
    if (!q) return;

    const idx = this.state.favorites.indexOf(q.id);
    if (idx === -1) {
      this.state.favorites.push(q.id);
    } else {
      this.state.favorites.splice(idx, 1);
    }

    this.saveStateToStorage();
    this.updateStats();
    this.renderSidebar();
    this.renderQuestionCard();
  }

  /**
   * Handle resetting all quiz progress and local storage
   */
  handleResetProgress() {
    showGlassConfirm(
      'Are you sure you want to reset all quiz progress, scores, and statistics? Favorites will be preserved.',
      'Reset Progress',
      '🔄',
      () => {
        this.state.quizProgress = {};
        this.saveStateToStorage();
        this.updateStats();
        this.renderSidebar();
        this.renderQuestionCard();
      }
    );
  }

  /**
   * Switch between Practice Mode and Exam Mode
   */
  switchMode(mode) {
    if (this.state.currentMode === mode) return;

    if (mode === 'exam') {
      showGlassConfirm(
        'Switching to Exam Mode will start a timed 45-minute mock exam session (30 random questions). Ready to begin?',
        'Start Mock Exam',
        '📝',
        () => {
          this.state.currentMode = mode;
          this.dom.modePracticeBtn.classList.toggle('active', mode === 'practice');
          this.dom.modeExamBtn.classList.toggle('active', mode === 'exam');
          this.startExamSession();
        }
      );
      return;
    }

    this.state.currentMode = mode;
    this.dom.modePracticeBtn.classList.toggle('active', mode === 'practice');
    this.dom.modeExamBtn.classList.toggle('active', mode === 'exam');

    if (mode === 'practice') {
      this.dom.practiceActions.classList.remove('hidden');
      this.dom.examControls.classList.add('hidden');
      this.dom.examResultsCard.classList.add('hidden');
      this.dom.questionCard.classList.remove('hidden');
      if (this.state.examState.timerId) {
        clearInterval(this.state.examState.timerId);
      }
      this.filterQuestions();
    } else if (mode === 'exam') {
      this.startExamSession();
    }
  }

  /**
   * Start a fresh Exam Mode Session (30 random questions, 45:00 countdown)
   */
  startExamSession() {
    const { questions } = this.state;
    if (questions.length === 0) return;

    // Shuffle and pick 30 random questions
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    const examQuestions = shuffled.slice(0, Math.min(30, questions.length));

    this.state.examState = {
      active: true,
      timeRemaining: 2700, // 45 minutes
      timerId: null,
      questions: examQuestions,
      answers: {},
      submitted: false
    };

    // Set filtered questions to the 30 exam questions
    this.state.filteredQuestions = examQuestions;
    this.state.currentQuestionIndex = 0;

    // Update UI
    this.dom.practiceActions.classList.add('hidden');
    this.dom.examControls.classList.remove('hidden');
    this.dom.examResultsCard.classList.add('hidden');
    this.dom.questionCard.classList.remove('hidden');

    this.updateExamProgressDisplay();
    this.renderSidebar();
    this.renderQuestionCard();

    // Start Timer
    if (this.state.examState.timerId) clearInterval(this.state.examState.timerId);
    this.state.examState.timerId = setInterval(() => {
      this.state.examState.timeRemaining--;
      this.updateExamTimerDisplay();
      if (this.state.examState.timeRemaining <= 0) {
        clearInterval(this.state.examState.timerId);
        this.submitExam();
        showGlassAlert('Time is up! Your exam session has been submitted automatically.', '⏰ Time Expired!', '⏱️');
      }
    }, 1000);

    this.updateExamTimerDisplay();
  }

  /**
   * Update Exam Timer Countdown Display (MM:SS)
   */
  updateExamTimerDisplay() {
    const totalSecs = Math.max(0, this.state.examState.timeRemaining);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    this.dom.examTimerDisplay.textContent = formatted;
  }

  /**
   * Update answered count indicator inside Exam Mode controls
   */
  updateExamProgressDisplay() {
    const answeredCount = Object.keys(this.state.examState.answers).length;
    const totalExam = this.state.examState.questions.length;
    this.dom.examAnsweredCount.textContent = `${answeredCount} / ${totalExam}`;
  }

  /**
   * Submit Exam and Calculate Final Score
   */
  submitExam() {
    if (this.state.examState.timerId) {
      clearInterval(this.state.examState.timerId);
    }
    this.state.examState.active = false;
    this.state.examState.submitted = true;

    const { questions, answers } = this.state.examState;
    let correctCount = 0;
    const incorrectQuestionIds = [];

    questions.forEach(q => {
      const userAns = answers[q.id];
      let isCorrect = false;
      if (userAns !== undefined && userAns !== null) {
        if (q.type === 'true_false' || q.type === 'single_choice') {
          isCorrect = (userAns === q.correctAnswer);
        } else if (q.type === 'fill_blank') {
          isCorrect = (userAns.toString().trim().toLowerCase() === q.correctAnswer.toString().trim().toLowerCase());
        }
      }

      if (isCorrect) {
        correctCount++;
      } else {
        incorrectQuestionIds.push(q.id);
      }

      // Record into long-term practice progress as well
      if (userAns !== undefined && userAns !== null) {
        this.state.quizProgress[q.id] = {
          answered: true,
          isCorrect,
          userAnswer,
          revealed: false
        };
      }
    });

    this.saveStateToStorage();
    this.updateStats();

    const totalCount = questions.length;
    const incorrectCount = totalCount - correctCount;
    const scorePercentage = Math.round((correctCount / totalCount) * 100);

    // Show Results Card
    this.dom.questionCard.classList.add('hidden');
    this.dom.examControls.classList.add('hidden');
    this.dom.examResultsCard.classList.remove('hidden');

    this.dom.examScorePercentage.textContent = `${scorePercentage}%`;
    this.dom.resTotal.textContent = totalCount;
    this.dom.resCorrect.textContent = correctCount;
    this.dom.resIncorrect.textContent = incorrectCount;

    // Save incorrect IDs for review
    this.state.examState.incorrectQuestionIds = incorrectQuestionIds;
  }

  /**
   * Review only the incorrect questions from the completed exam session
   */
  reviewExamIncorrect() {
    const incorrectIds = this.state.examState.incorrectQuestionIds || [];
    if (incorrectIds.length === 0) {
      showGlassAlert('Congratulations! You answered every question correctly in this exam session.', '🎉 Perfect Score!', '👑');
      return;
    }

    this.state.currentMode = 'practice';
    this.dom.modePracticeBtn.classList.add('active');
    this.dom.modeExamBtn.classList.remove('active');

    this.dom.practiceActions.classList.remove('hidden');
    this.dom.examResultsCard.classList.add('hidden');
    this.dom.questionCard.classList.remove('hidden');

    // Filter questions to only the incorrect ones from exam
    this.state.filteredQuestions = this.state.questions.filter(q => incorrectIds.includes(q.id));
    this.state.currentQuestionIndex = 0;

    this.renderSidebar();
    this.renderQuestionCard();
  }
}

// Launch application once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new QuizApp();
});
