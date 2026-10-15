/**
 * SOFTLITE DOCUMENT FOMETER - built 100 2027 (Release: 15/10/26)
 * Complete Core Application Engine:
 * - Ribbon Tabs & Office 365 Architecture
 * - 5 Full Templates + File Open/Save
 * - Free Transform (Ctrl+T) & Bounding Box (8 Handles + Rotate)
 * - Digital Ink Canvas (Pen, Highlighter, Marker, Brush, Magical, Eraser)
 * - Fillable PDF Form Builder
 * - Reference Tools (Table of Contents, Footnotes, Watermarks, Captions)
 * - Page Layout Engine (A4, Columns, Margins, Line Numbers)
 * - Keyboard Shortcuts System (Alt+Ctrl+A, Alt+Ctrl+S, Ctrl+T, Ctrl+L/E/R/J, etc.)
 */

document.addEventListener('DOMContentLoaded', () => {
  // ================= STATE MANAGEMENT =================
  const state = {
    activeTab: 'tab-home',
    zoom: 1.0,
    activeObject: null, // Currently selected floating object
    isTransformMode: false,
    copiedStyle: null,
    drawTool: 'select',
    drawColor: '#3b82f6',
    drawThickness: 3,
    isDrawing: false,
    activeCanvas: null,
    activeCtx: null,
    pageCount: 1,
    theme: 'theme-light',
    docTheme: 'modern',
    lineNumbersVisible: false,
    rulerVisible: true
  };

  // DOM Elements
  const editorBody = document.getElementById('editor-body');
  const pagesContainer = document.getElementById('pages-container');
  const boundingBox = document.getElementById('bounding-box-overlay');
  const workspace = document.getElementById('workspace');
  const statusWords = document.getElementById('status-words');
  const statusChars = document.getElementById('status-chars');
  const statusPages = document.getElementById('status-pages');
  const zoomPercent = document.getElementById('zoom-percent');
  const zoomSlider = document.getElementById('zoom-slider');
  const docTitle = document.getElementById('doc-title');

  // Modals
  const modalStart = document.getElementById('modal-start');
  const modalAbout = document.getElementById('modal-about');
  const modalFind = document.getElementById('modal-find-replace');
  const modalTable = document.getElementById('modal-table');
  const modalChart = document.getElementById('modal-chart');
  const modalShape = document.getElementById('modal-shape');
  const modalWordArt = document.getElementById('modal-wordart');
  const modalWatermark = document.getElementById('modal-watermark');
  const modalSymbols = document.getElementById('modal-symbols');
  const modalSignature = document.getElementById('modal-signature');
  const modalShortcuts = document.getElementById('modal-shortcuts');

  // ================= 5 BUILT-IN TEMPLATES =================
  const templates = {
    blank: `
      <h1>Untitled Document</h1>
      <p>Start typing your document content here, or use the <strong>Insert</strong> tab to add tables, shapes, charts, and form fields.</p>
      <p>Use <em>Alt + Ctrl + A</em> to increase font size, and <em>Alt + Ctrl + S</em> to decrease font size.</p>
    `,
    resume: `
      <div style="border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px;">
        <h1 style="margin: 0; color: #1e3a8a; font-size: 32px;">ALEXANDER PIERCE</h1>
        <p style="margin: 4px 0 0; color: #2563eb; font-weight: 600; font-size: 16px;">Senior Software Architect & Full Stack Lead</p>
        <p style="margin: 6px 0 0; font-size: 13px; color: #64748b;">San Francisco, CA • alex.pierce@softlite.org • +1 (555) 349-2810 • github.com/softlite</p>
      </div>

      <h2 style="color: #1e3a8a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Executive Summary</h2>
      <p>Results-driven Technology Architect with over 9 years of experience engineering scalable distributed cloud systems, modern web micro-frontends, and mission-critical open-source software with HTML5, Node.js, and TypeScript.</p>

      <h2 style="color: #1e3a8a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Core Competencies</h2>
      <p><strong>Languages & Stacks:</strong> JavaScript (ES2026), TypeScript, Python, HTML5/CSS3, Go, React, Rust<br>
      <strong>Infrastructure:</strong> Docker, Kubernetes, AWS Cloud, PostgreSQL, Redis, CI/CD Pipelines</p>

      <h2 style="color: #1e3a8a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Professional Experience</h2>
      <p><strong>Lead Software Architect</strong> | HyperScale Technologies (2022 - Present)<br>
      • Spearheaded cloud migration reducing enterprise infrastructure operational costs by 38%.<br>
      • Led a high-velocity engineering team of 18 developers delivering 99.99% uptime services.</p>

      <p><strong>Senior Systems Engineer</strong> | Softlite Open Source Systems (2019 - 2022)<br>
      • Built high-performance document rendering pipelines handling over 5 million PDF exports monthly.</p>

      <h2 style="color: #1e3a8a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Education & Certifications</h2>
      <p><strong>B.S. in Computer Science & Engineering</strong> — Stanford University (2015 - 2019)<br>
      AWS Certified Solutions Architect — Professional</p>
    `,
    letter: `
      <div style="display: flex; justify-content: space-between; border-bottom: 3px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px;">
        <div>
          <h2 style="margin: 0; color: #0f172a; font-size: 24px; letter-spacing: 1px;">SOFTLITE CORPORATION</h2>
          <p style="margin: 4px 0 0; color: #64748b; font-size: 13px;">Innovating Next-Gen Document Technologies</p>
        </div>
        <div style="text-align: right; font-size: 12px; color: #64748b;">
          <p style="margin: 0;">100 Innovation Way, Suite 400</p>
          <p style="margin: 0;">Silicon Valley, CA 94016</p>
          <p style="margin: 0;">contact@softlite.org</p>
        </div>
      </div>

      <p style="color: #64748b; font-size: 13px; margin-bottom: 24px;">October 15, 2026</p>

      <p><strong>To:</strong><br>
      Dr. Evelyn Vance<br>
      Director of Global Partnerships<br>
      Vance International Enterprise</p>

      <p style="margin-top: 20px;"><strong>Subject: Official Partnership Proposal — Softlite Document Formatter v100</strong></p>

      <p>Dear Dr. Vance,</p>

      <p>I am pleased to formally present this partnership proposal on behalf of Softlite Open Source. Our team has engineered the <strong>softlite-document fometer</strong> (Built 100 2027), an advanced web-based graphic document suite featuring full-featured Free Transform manipulation, vector shape geometry, and fillable form standard integration.</p>

      <p>Through this strategic collaboration, your enterprise will gain direct integration capabilities, custom workflow plugins, and prioritized access to our upcoming 2027 digital office roadmap.</p>

      <p>We would appreciate the opportunity to schedule an executive demonstration at your convenience early next week.</p>

      <p style="margin-top: 30px;">Sincerely,</p>
      <div style="margin: 15px 0;">
        <span style="font-family: 'Playfair Display', cursive; font-size: 26px; color: #1e3a8a; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; display: inline-block;">Alexander Pierce</span>
      </div>
      <p style="margin: 0; font-weight: 600;">Alexander Pierce</p>
      <p style="margin: 0; font-size: 13px; color: #64748b;">Chief Executive Officer | Softlite Corp</p>
    `,
    invoice: `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
        <div>
          <h1 style="margin: 0; color: #2563eb; font-size: 32px; font-weight: 800;">INVOICE</h1>
          <p style="margin: 4px 0 0; color: #64748b; font-size: 13px;">Invoice #: <strong>INV-2027-100</strong></p>
          <p style="margin: 2px 0 0; color: #64748b; font-size: 13px;">Date: <strong>October 15, 2026</strong></p>
          <p style="margin: 2px 0 0; color: #64748b; font-size: 13px;">Due Date: <strong>November 15, 2026</strong></p>
        </div>
        <div style="text-align: right;">
          <h3 style="margin: 0; color: #0f172a;">Softlite Systems Inc.</h3>
          <p style="margin: 2px 0; font-size: 12px; color: #64748b;">GST / Tax ID: US-9281749-01</p>
          <p style="margin: 2px 0; font-size: 12px; color: #64748b;">billing@softlite.org</p>
        </div>
      </div>

      <div style="background: #f8fafc; border-radius: 6px; padding: 12px 16px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
        <p style="margin: 0; font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 600;">Billed To:</p>
        <p style="margin: 4px 0 0; font-size: 15px; font-weight: 600; color: #0f172a;">Apex Digital Global Ltd.</p>
        <p style="margin: 2px 0 0; font-size: 13px; color: #475569;">452 Avenue of the Americas, 18th Floor, New York, NY</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr style="background: #2563eb; color: #ffffff;">
            <th style="padding: 10px; text-align: left; border: 1px solid #2563eb;">Description</th>
            <th style="padding: 10px; text-align: center; border: 1px solid #2563eb; width: 80px;">Qty</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #2563eb; width: 120px;">Unit Price</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #2563eb; width: 120px;">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 10px; border: 1px solid #cbd5e1;">Softlite Document Engine Enterprise License (Build 100)</td>
            <td style="padding: 10px; text-align: center; border: 1px solid #cbd5e1;">1</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #cbd5e1;">$1,250.00</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #cbd5e1;">$1,250.00</td>
          </tr>
          <tr style="background: #f8fafc;">
            <td style="padding: 10px; border: 1px solid #cbd5e1;">Custom Blue Theme & Workflow Automation Plugins</td>
            <td style="padding: 10px; text-align: center; border: 1px solid #cbd5e1;">2</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #cbd5e1;">$400.00</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #cbd5e1;">$800.00</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #cbd5e1;">Cloud PDF Compilation & Free Transform Modules</td>
            <td style="padding: 10px; text-align: center; border: 1px solid #cbd5e1;">1</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #cbd5e1;">$350.00</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #cbd5e1;">$350.00</td>
          </tr>
        </tbody>
      </table>

      <div style="display: flex; justify-content: flex-end; margin-bottom: 24px;">
        <div style="width: 260px;">
          <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; color: #64748b;">
            <span>Subtotal:</span>
            <span>$2,400.00</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; color: #64748b;">
            <span>Sales Tax (8.5%):</span>
            <span>$204.00</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 17px; font-weight: 700; color: #0f172a; border-top: 2px solid #0f172a; margin-top: 4px;">
            <span>Amount Due:</span>
            <span>$2,604.00</span>
          </div>
        </div>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 12px; color: #64748b;">
        <p style="margin: 0;"><strong>Payment Terms:</strong> Wire Transfer / ACH / Credit Card accepted within 30 days.</p>
        <p style="margin: 2px 0 0;">Thank you for choosing Softlite Technologies!</p>
      </div>
    `,
    report: `
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px;">
        <span style="background: #dbeafe; color: #1e40af; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 3px 8px; border-radius: 999px;">Technical Research Whitepaper</span>
        <h1 style="font-size: 30px; color: #0f172a; margin: 12px 0 6px;">Next-Generation Document Formatting & Vector Manipulation</h1>
        <p style="font-size: 14px; color: #64748b;">Published: October 15, 2026 | Softlite Document Formatter v100</p>
      </div>

      <h2>1. Executive Summary</h2>
      <p>Modern browser-native document architectures allow responsive, print-perfect generation of digital forms, vector canvas layers, and complex multi-page publications without external heavyweight runtime dependencies. This report outlines performance metrics and layout benchmark comparisons.</p>

      <h2>2. Benchmark Evaluation</h2>
      <p>Below is a comparative breakdown of document processing and vector bounding-box transform latency across contemporary graphics pipelines:</p>

      <table>
        <thead>
          <tr>
            <th>Engine Architecture</th>
            <th>Init Time (ms)</th>
            <th>Transform FPS</th>
            <th>Memory Footprint</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Softlite HTML5 Canvas/DOM (Build 100)</strong></td>
            <td><strong>18 ms</strong></td>
            <td><strong>60 FPS</strong></td>
            <td><strong>14 MB</strong></td>
          </tr>
          <tr>
            <td>Legacy Desktop PDF Wrappers</td>
            <td>420 ms</td>
            <td>32 FPS</td>
            <td>180 MB</td>
          </tr>
          <tr>
            <td>Serverless Headless Renderers</td>
            <td>850 ms</td>
            <td>N/A</td>
            <td>240 MB</td>
          </tr>
        </tbody>
      </table>

      <h2>3. Interactive Vector Free Transform</h2>
      <p>By leveraging an 8-handle bounding box with pivot-based affine matrix rotation, users can manipulate images, shapes, and typography directly with immediate visual feedback.</p>

      <h2>4. Strategic Recommendations</h2>
      <p>1. Adopt client-side vector bounding box calculations for interactive editing.<br>
      2. Utilize standard fillable PDF form schemas for interoperability.<br>
      3. Maintain full offline availability with zero third-party telemetry.</p>
    `
  };

  // ================= LOAD INITIAL TEMPLATE =================
  function loadTemplate(templateKey) {
    const content = templates[templateKey] || templates.blank;
    editorBody.innerHTML = content;
    updateCounts();
    closeAllModals();
    docTitle.textContent = templateKey === 'blank' ? 'Untitled Document - Softlite' : `${templateKey.toUpperCase()} - Softlite`;
  }

  // Load blank initially behind modal, and keep start modal open
  loadTemplate('blank');
  modalStart.classList.remove('hidden');

  // ================= RIBBON TABS SWITCHING =================
  const ribbonTabs = document.querySelectorAll('.ribbon-tab');
  const ribbonPanels = document.querySelectorAll('.ribbon-panel');

  ribbonTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPanelId = tab.getAttribute('data-tab');
      if (!targetPanelId) return; // e.g. File menu button

      ribbonTabs.forEach(t => t.classList.remove('active-tab'));
      ribbonPanels.forEach(p => p.classList.remove('active-panel'));

      tab.classList.add('active-tab');
      const targetPanel = document.getElementById(targetPanelId);
      if (targetPanel) {
        targetPanel.classList.add('active-panel');
        state.activeTab = targetPanelId;
      }
    });
  });

  // File / Templates Ribbon Button opens start modal
  document.getElementById('btn-file-menu').addEventListener('click', () => {
    modalStart.classList.remove('hidden');
  });
  document.getElementById('qa-new').addEventListener('click', () => {
    modalStart.classList.remove('hidden');
  });

  // Template Cards Click Handler
  document.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', () => {
      const templateKey = card.getAttribute('data-template');
      loadTemplate(templateKey);
    });
  });

  document.getElementById('btn-start-blank').addEventListener('click', () => {
    loadTemplate('blank');
  });

  document.getElementById('btn-close-start-modal').addEventListener('click', () => {
    modalStart.classList.add('hidden');
  });

  // Open File (HTML, JSON, TXT)
  const inputOpenFile = document.getElementById('input-open-file');
  inputOpenFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      if (file.name.endsWith('.json')) {
        try {
          const parsed = JSON.parse(content);
          editorBody.innerHTML = parsed.content || content;
          if (parsed.title) docTitle.textContent = parsed.title;
        } catch {
          editorBody.innerHTML = content;
        }
      } else {
        editorBody.innerHTML = content;
      }
      docTitle.textContent = file.name.replace(/\.[^/.]+$/, "");
      updateCounts();
      modalStart.classList.add('hidden');
    };
    reader.readAsText(file);
  });

  // ================= ABOUT MODAL & SOFTLITE LICENSE =================
  const btnOpenAbout = document.getElementById('btn-open-about');
  const btnCloseAbout = document.getElementById('btn-close-about-modal');
  const btnAckAbout = document.getElementById('btn-ack-about');
  const btnShowAboutSettings = document.getElementById('btn-show-about-settings');

  function openAbout() {
    modalAbout.classList.remove('hidden');
  }

  btnOpenAbout.addEventListener('click', openAbout);
  if (btnShowAboutSettings) btnShowAboutSettings.addEventListener('click', openAbout);
  btnCloseAbout.addEventListener('click', () => modalAbout.classList.add('hidden'));
  btnAckAbout.addEventListener('click', () => modalAbout.classList.add('hidden'));

  // Shortcuts hint modal
  const btnShortcuts = document.getElementById('btn-shortcuts-hint');
  btnShortcuts.addEventListener('click', () => modalShortcuts.classList.remove('hidden'));
  document.getElementById('btn-close-shortcuts-modal').addEventListener('click', () => modalShortcuts.classList.add('hidden'));
  document.getElementById('btn-ack-shortcuts').addEventListener('click', () => modalShortcuts.classList.add('hidden'));

  // ================= HOME TAB: FONT & FORMATTING =================
  // Font Family
  const fontFamilySel = document.getElementById('font-family');
  fontFamilySel.addEventListener('change', () => {
    document.execCommand('fontName', false, fontFamilySel.value);
    editorBody.focus();
  });

  // Font Size
  const fontSizeSel = document.getElementById('font-size');
  fontSizeSel.addEventListener('change', () => {
    applyFontSize(fontSizeSel.value + 'px');
  });

  function applyFontSize(sizeInPx) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const span = document.createElement('span');
    span.style.fontSize = sizeInPx;
    const range = selection.getRangeAt(0);
    try {
      range.surroundContents(span);
    } catch {
      document.execCommand('fontSize', false, '3');
    }
    editorBody.focus();
  }

  // Increment Font Size (Alt+Ctrl+A)
  function incrementFontSize() {
    let currentSize = parseInt(fontSizeSel.value, 10) || 16;
    currentSize = Math.min(72, currentSize + 2);
    fontSizeSel.value = currentSize.toString();
    applyFontSize(currentSize + 'px');
  }

  // Decrement Font Size (Alt+Ctrl+S)
  function decrementFontSize() {
    let currentSize = parseInt(fontSizeSel.value, 10) || 16;
    currentSize = Math.max(8, currentSize - 2);
    fontSizeSel.value = currentSize.toString();
    applyFontSize(currentSize + 'px');
  }

  document.getElementById('btn-font-inc').addEventListener('click', incrementFontSize);
  document.getElementById('btn-font-dec').addEventListener('click', decrementFontSize);

  // Bold (Ctrl+B), Italic (Ctrl+I), Underline (Ctrl+U), Strikethrough
  document.getElementById('btn-bold').addEventListener('click', () => {
    document.execCommand('bold', false, null);
    editorBody.focus();
  });
  document.getElementById('btn-italic').addEventListener('click', () => {
    document.execCommand('italic', false, null);
    editorBody.focus();
  });
  document.getElementById('btn-underline').addEventListener('click', () => {
    document.execCommand('underline', false, null);
    editorBody.focus();
  });
  document.getElementById('btn-strikethrough').addEventListener('click', () => {
    document.execCommand('strikeThrough', false, null);
    editorBody.focus();
  });

  // Font Color & Highlight Color
  const fontColorPicker = document.getElementById('font-color-picker');
  const fontColorBar = document.getElementById('font-color-bar');
  fontColorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    fontColorBar.style.backgroundColor = color;
    document.execCommand('foreColor', false, color);
    editorBody.focus();
  });

  const highlightPicker = document.getElementById('highlight-color-picker');
  const highlightBar = document.getElementById('highlight-color-bar');
  highlightPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    highlightBar.style.backgroundColor = color;
    document.execCommand('hiliteColor', false, color);
    editorBody.focus();
  });

  // Clear Styling
  document.getElementById('btn-clear-style').addEventListener('click', () => {
    document.execCommand('removeFormat', false, null);
    editorBody.focus();
  });

  // Alignments: Left (Ctrl+L), Center (Ctrl+E), Right (Ctrl+R), Justify (Ctrl+J)
  document.getElementById('btn-align-left').addEventListener('click', () => {
    document.execCommand('justifyLeft', false, null);
    editorBody.focus();
  });
  document.getElementById('btn-align-center').addEventListener('click', () => {
    document.execCommand('justifyCenter', false, null);
    editorBody.focus();
  });
  document.getElementById('btn-align-right').addEventListener('click', () => {
    document.execCommand('justifyRight', false, null);
    editorBody.focus();
  });
  document.getElementById('btn-align-justify').addEventListener('click', () => {
    document.execCommand('justifyFull', false, null);
    editorBody.focus();
  });

  // Lists
  document.getElementById('btn-list-bullet').addEventListener('click', () => {
    document.execCommand('insertUnorderedList', false, null);
    editorBody.focus();
  });
  document.getElementById('btn-list-num').addEventListener('click', () => {
    document.execCommand('insertOrderedList', false, null);
    editorBody.focus();
  });

  // Shading (Paragraph background)
  const shadingPicker = document.getElementById('shading-color-picker');
  shadingPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    let node = sel.anchorNode;
    if (node && node.nodeType === 3) node = node.parentNode;
    if (node && node !== editorBody) {
      node.style.backgroundColor = color;
      node.style.padding = '6px 10px';
      node.style.borderRadius = '4px';
    }
  });

  // Borders
  const borderPicker = document.getElementById('border-picker');
  borderPicker.addEventListener('change', (e) => {
    const val = e.target.value;
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    let node = sel.anchorNode;
    if (node && node.nodeType === 3) node = node.parentNode;
    if (node && node !== editorBody) {
      if (val === 'none') {
        node.style.border = 'none';
      } else if (val === 'all') {
        node.style.border = '1px solid #94a3b8';
        node.style.padding = '8px 12px';
      } else if (val === 'box') {
        node.style.border = '2px solid #2563eb';
        node.style.borderRadius = '6px';
        node.style.padding = '10px 14px';
      } else if (val === 'bottom') {
        node.style.borderBottom = '2px solid #2563eb';
        node.style.paddingBottom = '4px';
      } else if (val === 'left-callout') {
        node.style.borderLeft = '4px solid #2563eb';
        node.style.paddingLeft = '12px';
        node.style.background = '#f8fafc';
      }
    }
  });

  // Indents
  document.getElementById('btn-indent').addEventListener('click', () => {
    document.execCommand('indent', false, null);
  });
  document.getElementById('btn-outdent').addEventListener('click', () => {
    document.execCommand('outdent', false, null);
  });

  // Format Painter (Copy Style)
  const btnCopyStyle = document.getElementById('btn-copy-style');
  btnCopyStyle.addEventListener('click', () => {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    let node = sel.anchorNode;
    if (node && node.nodeType === 3) node = node.parentNode;
    if (node) {
      const computed = window.getComputedStyle(node);
      state.copiedStyle = {
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        fontStyle: computed.fontStyle,
        textDecoration: computed.textDecoration
      };
      btnCopyStyle.classList.add('active');
    }
  });

  // Apply copied style on next click
  editorBody.addEventListener('mouseup', () => {
    if (state.copiedStyle) {
      const sel = window.getSelection();
      if (!sel.isCollapsed && sel.rangeCount) {
        const span = document.createElement('span');
        Object.assign(span.style, state.copiedStyle);
        const range = sel.getRangeAt(0);
        try {
          range.surroundContents(span);
        } catch {}
      }
      state.copiedStyle = null;
      btnCopyStyle.classList.remove('active');
    }
  });

  // Cut, Copy, Paste
  document.getElementById('btn-cut').addEventListener('click', () => document.execCommand('cut'));
  document.getElementById('btn-copy').addEventListener('click', () => document.execCommand('copy'));
  document.getElementById('btn-paste').addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      document.execCommand('insertText', false, text);
    } catch {
      alert('Clipboard read permission denied. Use Ctrl+V instead.');
    }
  });

  // Quick Heading Styles
  document.querySelectorAll('.quick-style-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.getAttribute('data-tag');
      document.execCommand('formatBlock', false, tag);
      editorBody.focus();
    });
  });

  // Find & Replace
  const btnFind = document.getElementById('btn-find');
  const btnReplace = document.getElementById('btn-replace');
  const btnCloseFind = document.getElementById('btn-close-find-modal');
  const findInput = document.getElementById('find-input');
  const replaceInput = document.getElementById('replace-input');
  const findMatchesCount = document.getElementById('find-matches-count');

  function openFindReplace() {
    modalFind.classList.remove('hidden');
    findInput.focus();
  }

  btnFind.addEventListener('click', openFindReplace);
  btnReplace.addEventListener('click', openFindReplace);
  btnCloseFind.addEventListener('click', () => modalFind.classList.add('hidden'));

  document.getElementById('btn-find-next').addEventListener('click', () => {
    const query = findInput.value;
    if (!query) return;
    if (window.find) {
      const found = window.find(query, false, false, true, false, false, false);
      findMatchesCount.textContent = found ? 'Match found' : 'No further matches';
    }
  });

  document.getElementById('btn-replace-one').addEventListener('click', () => {
    const sel = window.getSelection();
    if (sel.rangeCount && sel.toString().toLowerCase() === findInput.value.toLowerCase()) {
      document.execCommand('insertText', false, replaceInput.value);
      if (window.find) window.find(findInput.value);
    } else {
      if (window.find) window.find(findInput.value);
    }
  });

  document.getElementById('btn-replace-all').addEventListener('click', () => {
    const findStr = findInput.value;
    const repStr = replaceInput.value;
    if (!findStr) return;
    const re = new RegExp(escapeRegExp(findStr), 'gi');
    editorBody.innerHTML = editorBody.innerHTML.replace(re, repStr);
    findMatchesCount.textContent = 'All matches replaced!';
    updateCounts();
  });

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Save Document
  function saveDocument() {
    const docData = {
      title: docTitle.textContent,
      content: editorBody.innerHTML,
      savedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(docData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docTitle.textContent.trim().replace(/\s+/g, '_')}.softlite`;
    a.click();
    URL.revokeObjectURL(url);
    const saveIndicator = document.getElementById('status-save');
    saveIndicator.textContent = 'Saved just now';
    setTimeout(() => { saveIndicator.textContent = 'Saved'; }, 2500);
  }

  document.getElementById('qa-save').addEventListener('click', saveDocument);
  document.getElementById('btn-save-ribbon').addEventListener('click', saveDocument);

  // Print / PDF Export
  function printDocument() {
    window.print();
  }
  document.getElementById('qa-print').addEventListener('click', printDocument);
  document.getElementById('btn-print-ribbon').addEventListener('click', printDocument);

  // Undo / Redo
  document.getElementById('qa-undo').addEventListener('click', () => document.execCommand('undo'));
  document.getElementById('qa-redo').addEventListener('click', () => document.execCommand('redo'));

  // ================= INSERT TAB: TABLE, CHART, SHAPES, MEDIA =================
  // Table Insertion
  const btnInsertTable = document.getElementById('btn-insert-table');
  btnInsertTable.addEventListener('click', () => modalTable.classList.remove('hidden'));
  document.getElementById('btn-close-table-modal').addEventListener('click', () => modalTable.classList.add('hidden'));

  document.getElementById('btn-confirm-table').addEventListener('click', () => {
    const cols = parseInt(document.getElementById('tbl-cols').value, 10) || 3;
    const rows = parseInt(document.getElementById('tbl-rows').value, 10) || 3;
    const hasHeader = document.getElementById('tbl-header-check').checked;

    let html = '<table>';
    if (hasHeader) {
      html += '<thead><tr>';
      for (let c = 0; c < cols; c++) {
        html += `<th>Header ${c + 1}</th>`;
      }
      html += '</tr></thead>';
    }
    html += '<tbody>';
    for (let r = 0; r < rows; r++) {
      html += '<tr>';
      for (let c = 0; c < cols; c++) {
        html += `<td>Row ${r + 1}, Col ${c + 1}</td>`;
      }
      html += '</tr>';
    }
    html += '</tbody></table><p><br></p>';

    document.execCommand('insertHTML', false, html);
    modalTable.classList.add('hidden');
    updateCounts();
  });

  // Chart Insertion
  const btnInsertChart = document.getElementById('btn-insert-chart');
  btnInsertChart.addEventListener('click', () => modalChart.classList.remove('hidden'));
  document.getElementById('btn-close-chart-modal').addEventListener('click', () => modalChart.classList.add('hidden'));

  document.getElementById('btn-confirm-chart').addEventListener('click', () => {
    const chartType = document.getElementById('chart-type-sel').value;
    const title = document.getElementById('chart-title-input').value;
    const labels = document.getElementById('chart-labels-input').value.split(',').map(s => s.trim());
    const values = document.getElementById('chart-values-input').value.split(',').map(s => parseFloat(s.trim()) || 0);

    const chartSvg = generateSVGChart(chartType, title, labels, values);
    createFloatingObject(chartSvg, 420, 240, 100, 150);
    modalChart.classList.add('hidden');
  });

  function generateSVGChart(type, title, labels, values) {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    const maxVal = Math.max(...values, 10);
    let chartBody = '';

    if (type === 'bar') {
      const barWidth = 40;
      const spacing = 20;
      const startX = 50;
      const baseY = 190;
      values.forEach((val, i) => {
        const height = (val / maxVal) * 130;
        const x = startX + i * (barWidth + spacing);
        const y = baseY - height;
        const color = colors[i % colors.length];
        chartBody += `
          <rect x="${x}" y="${y}" width="${barWidth}" height="${height}" fill="${color}" rx="4"/>
          <text x="${x + barWidth / 2}" y="${y - 6}" font-size="11" text-anchor="middle" fill="#475569" font-weight="bold">${val}</text>
          <text x="${x + barWidth / 2}" y="${baseY + 16}" font-size="11" text-anchor="middle" fill="#64748b">${labels[i] || ''}</text>
        `;
      });
      chartBody += `<line x1="40" y1="${baseY}" x2="380" y2="${baseY}" stroke="#cbd5e1" stroke-width="1.5"/>`;
    } else if (type === 'pie' || type === 'doughnut') {
      const cx = 140, cy = 120, r = 70;
      const total = values.reduce((a, b) => a + b, 0) || 1;
      let startAngle = 0;
      let legend = '';

      values.forEach((val, i) => {
        const sliceAngle = (val / total) * 2 * Math.PI;
        const endAngle = startAngle + sliceAngle;
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        const largeArc = sliceAngle > Math.PI ? 1 : 0;
        const color = colors[i % colors.length];

        chartBody += `
          <path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${color}" stroke="#fff" stroke-width="2"/>
        `;

        legend += `
          <rect x="240" y="${60 + i * 24}" width="14" height="14" fill="${color}" rx="2"/>
          <text x="262" y="${72 + i * 24}" font-size="12" fill="#334155">${labels[i] || ''} (${Math.round((val/total)*100)}%)</text>
        `;

        startAngle = endAngle;
      });

      if (type === 'doughnut') {
        chartBody += `<circle cx="${cx}" cy="${cy}" r="38" fill="#ffffff"/>`;
      }
      chartBody += legend;
    } else {
      // Line Chart
      const points = [];
      const startX = 60, stepX = 65, baseY = 190;
      values.forEach((val, i) => {
        const height = (val / maxVal) * 130;
        const x = startX + i * stepX;
        const y = baseY - height;
        points.push(`${x},${y}`);
        chartBody += `<circle cx="${x}" cy="${y}" r="5" fill="#3b82f6" stroke="#fff" stroke-width="2"/>`;
        chartBody += `<text x="${x}" y="${y - 8}" font-size="11" text-anchor="middle" fill="#1e40af" font-weight="bold">${val}</text>`;
        chartBody += `<text x="${x}" y="${baseY + 16}" font-size="11" text-anchor="middle" fill="#64748b">${labels[i] || ''}</text>`;
      });
      chartBody += `<polyline fill="none" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" points="${points.join(' ')}"/>`;
      chartBody += `<line x1="40" y1="${baseY}" x2="380" y2="${baseY}" stroke="#cbd5e1" stroke-width="1.5"/>`;
    }

    return `
      <div class="generated-chart-box" style="width: 100%; height: 100%; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); user-select: none;">
        <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #1e293b; text-align: center;">${title}</h4>
        <svg width="390" height="190" viewBox="0 0 400 210" style="overflow: visible;">
          ${chartBody}
        </svg>
      </div>
    `;
  }

  // Insert Image (Upload or URL)
  const btnInsertImage = document.getElementById('btn-insert-image');
  btnInsertImage.addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imgHtml = `<img src="${event.target.result}" alt="Inserted Image">`;
          createFloatingObject(imgHtml, 280, 200, 120, 100);
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  });

  // Insert Shape
  const btnInsertShape = document.getElementById('btn-insert-shape');
  btnInsertShape.addEventListener('click', () => modalShape.classList.remove('hidden'));
  document.getElementById('btn-close-shape-modal').addEventListener('click', () => modalShape.classList.add('hidden'));

  let selectedShapeType = 'rect';
  document.querySelectorAll('.shape-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.shape-opt').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      selectedShapeType = opt.getAttribute('data-shape');
    });
  });

  document.getElementById('btn-confirm-shape').addEventListener('click', () => {
    const color = document.getElementById('shape-fill-color').value;
    let shapeSvg = '';

    if (selectedShapeType === 'rect') {
      shapeSvg = `<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"><rect width="100" height="100" fill="${color}" rx="2"/></svg>`;
    } else if (selectedShapeType === 'round-rect') {
      shapeSvg = `<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"><rect width="100" height="100" fill="${color}" rx="16"/></svg>`;
    } else if (selectedShapeType === 'circle') {
      shapeSvg = `<svg width="100%" height="100%" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="${color}"/></svg>`;
    } else if (selectedShapeType === 'triangle') {
      shapeSvg = `<svg width="100%" height="100%" viewBox="0 0 100 100"><polygon points="50,4 4,96 96,96" fill="${color}"/></svg>`;
    } else if (selectedShapeType === 'star') {
      shapeSvg = `<svg width="100%" height="100%" viewBox="0 0 100 100"><polygon points="50,5 64,36 98,36 70,57 81,90 50,70 19,90 30,57 2,36 36,36" fill="${color}"/></svg>`;
    } else if (selectedShapeType === 'arrow-right') {
      shapeSvg = `<svg width="100%" height="100%" viewBox="0 0 100 100"><polygon points="5,30 60,30 60,10 95,50 60,90 60,70 5,70" fill="${color}"/></svg>`;
    } else if (selectedShapeType === 'diamond') {
      shapeSvg = `<svg width="100%" height="100%" viewBox="0 0 100 100"><polygon points="50,5 95,50 50,95 5,50" fill="${color}"/></svg>`;
    } else if (selectedShapeType === 'heart') {
      shapeSvg = `<svg width="100%" height="100%" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="${color}"/></svg>`;
    }

    createFloatingObject(shapeSvg, 160, 160, 150, 150);
    modalShape.classList.add('hidden');
  });

  // Insert Movable Text Box
  document.getElementById('btn-insert-textbox').addEventListener('click', () => {
    const textHtml = `
      <div class="floating-textbox" contenteditable="true" spellcheck="true" style="width: 100%; height: 100%;">
        <strong>Text Box</strong>
        <p>Type custom floating content here. Drag with Selection Tool or press Ctrl+T to Transform.</p>
      </div>
    `;
    createFloatingObject(textHtml, 220, 120, 140, 180);
  });

  // Insert SmartArt
  document.getElementById('btn-insert-smartart').addEventListener('click', () => {
    const smartArtHtml = `
      <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: space-around; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; gap: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.04);">
        <div style="background: #2563eb; color: #fff; padding: 8px 12px; border-radius: 6px; text-align: center; flex: 1;">
          <strong style="display: block; font-size: 13px;">1. Plan</strong>
          <span style="font-size: 10px;">Requirement</span>
        </div>
        <div style="font-size: 18px; color: #94a3b8;">➔</div>
        <div style="background: #3b82f6; color: #fff; padding: 8px 12px; border-radius: 6px; text-align: center; flex: 1;">
          <strong style="display: block; font-size: 13px;">2. Build</strong>
          <span style="font-size: 10px;">Execution</span>
        </div>
        <div style="font-size: 18px; color: #94a3b8;">➔</div>
        <div style="background: #10b981; color: #fff; padding: 8px 12px; border-radius: 6px; text-align: center; flex: 1;">
          <strong style="display: block; font-size: 13px;">3. Deploy</strong>
          <span style="font-size: 10px;">Production</span>
        </div>
      </div>
    `;
    createFloatingObject(smartArtHtml, 420, 110, 100, 200);
  });

  // Insert WordArt
  const btnInsertWordArt = document.getElementById('btn-insert-wordart');
  btnInsertWordArt.addEventListener('click', () => modalWordArt.classList.remove('hidden'));
  document.getElementById('btn-close-wordart-modal').addEventListener('click', () => modalWordArt.classList.add('hidden'));

  let selectedWordArtStyle = 'wa-neon';
  document.querySelectorAll('.wordart-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.wordart-card').forEach(c => c.classList.remove('active-wordart'));
      card.classList.add('active-wordart');
      selectedWordArtStyle = card.getAttribute('data-style');
    });
  });

  document.getElementById('btn-confirm-wordart').addEventListener('click', () => {
    const text = document.getElementById('wordart-text-input').value || 'SOFTLITE';
    const waHtml = `
      <div class="wordart-render ${selectedWordArtStyle}" style="font-size: 26px; white-space: nowrap; user-select: none;">
        ${text}
      </div>
    `;
    createFloatingObject(waHtml, 260, 70, 120, 140);
    modalWordArt.classList.add('hidden');
  });

  // Insert World Map
  document.getElementById('btn-insert-map').addEventListener('click', () => {
    const mapSvg = `
      <div style="width: 100%; height: 100%; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 8px; text-align: center;">
        <span style="font-size: 11px; font-weight: 700; color: #1e40af; display: block; margin-bottom: 4px;">Global Enterprise Operations</span>
        <svg viewBox="0 0 1000 500" width="100%" height="80%" style="display: block;">
          <!-- North America -->
          <path d="M120 110 L190 70 L280 90 L260 170 L220 230 L160 210 Z" fill="#93c5fd" stroke="#2563eb" stroke-width="1.5"/>
          <!-- South America -->
          <path d="M250 240 L320 260 L310 370 L260 440 L230 350 Z" fill="#93c5fd" stroke="#2563eb" stroke-width="1.5"/>
          <!-- Europe -->
          <path d="M460 100 L550 80 L560 150 L470 160 Z" fill="#60a5fa" stroke="#2563eb" stroke-width="1.5"/>
          <!-- Africa -->
          <path d="M460 180 L570 180 L590 320 L520 400 L440 290 Z" fill="#93c5fd" stroke="#2563eb" stroke-width="1.5"/>
          <!-- Asia -->
          <path d="M570 80 L840 80 L860 220 L720 270 L580 180 Z" fill="#60a5fa" stroke="#2563eb" stroke-width="1.5"/>
          <!-- Australia -->
          <path d="M780 320 L890 320 L880 410 L780 400 Z" fill="#93c5fd" stroke="#2563eb" stroke-width="1.5"/>
          <!-- Pin Markers -->
          <circle cx="210" cy="150" r="7" fill="#ef4444" stroke="#fff" stroke-width="2"/>
          <circle cx="510" cy="120" r="7" fill="#ef4444" stroke="#fff" stroke-width="2"/>
          <circle cx="740" cy="180" r="7" fill="#ef4444" stroke="#fff" stroke-width="2"/>
        </svg>
      </div>
    `;
    createFloatingObject(mapSvg, 440, 240, 90, 160);
  });

  // Symbols & Currency
  const symbolsContainer = document.getElementById('symbols-container');
  const symbolsTitle = document.getElementById('symbols-modal-title');
  const currencyList = ['₹', '$', '€', '£', '¥', '₿', '₩', '₽', '₺', '¢', 'Fr', 'R$', 'zł', '₪', '₫', '₱'];
  const symbolsList = ['©', '®', '™', '§', '¶', '±', '≠', '≤', '≥', '÷', '×', '√', '∞', 'π', '∆', 'Ω', 'α', 'β', 'γ', 'λ', '★', '✔', '✖', '❤', '⚡', '➔', '➜', '➤'];

  function openSymbolsModal(isCurrency) {
    symbolsTitle.textContent = isCurrency ? 'Insert Currency Symbol' : 'Insert Special Symbol';
    const list = isCurrency ? currencyList : symbolsList;
    symbolsContainer.innerHTML = '';
    list.forEach(sym => {
      const btn = document.createElement('button');
      btn.className = 'sym-btn';
      btn.textContent = sym;
      btn.addEventListener('click', () => {
        document.execCommand('insertText', false, sym);
        modalSymbols.classList.add('hidden');
        editorBody.focus();
      });
      symbolsContainer.appendChild(btn);
    });
    modalSymbols.classList.remove('hidden');
  }

  document.getElementById('btn-insert-currency').addEventListener('click', () => openSymbolsModal(true));
  document.getElementById('btn-insert-symbol').addEventListener('click', () => openSymbolsModal(false));
  document.getElementById('btn-close-symbols-modal').addEventListener('click', () => modalSymbols.classList.add('hidden'));

  // ================= OBJECT SELECTION & FREE TRANSFORM (Ctrl+T) ENGINE =================
  /**
   * 1. Selection Tool (ya Move Tool)
   * 2. Bounding Box (ya Transform Box)
   * 3. Resize Handles (8 Corner & Edge dots)
   * 4. Free Transform (Shortcut: Ctrl + T) - scale & rotate
   */
  const objectsLayer = document.getElementById('objects-layer-1');

  function createFloatingObject(contentHtml, width, height, left, top) {
    const obj = document.createElement('div');
    obj.className = 'floating-object';
    obj.style.width = width + 'px';
    obj.style.height = height + 'px';
    obj.style.left = left + 'px';
    obj.style.top = top + 'px';
    obj.dataset.rotation = '0';
    obj.innerHTML = contentHtml;

    objectsLayer.appendChild(obj);
    selectObject(obj);
    attachObjectDragEvents(obj);
    return obj;
  }

  function selectObject(obj) {
    if (state.activeObject && state.activeObject !== obj) {
      state.activeObject.classList.remove('selected');
    }
    state.activeObject = obj;
    if (obj) {
      obj.classList.add('selected');
      updateBoundingBox();
    } else {
      boundingBox.classList.add('hidden');
    }
  }

  // Click outside to deselect
  workspace.addEventListener('mousedown', (e) => {
    if (!e.target.closest('.floating-object') &&
        !e.target.closest('#bounding-box-overlay') &&
        !e.target.closest('#ribbon-tabs') &&
        !e.target.closest('#ribbon-content')) {
      selectObject(null);
    }
  });

  function updateBoundingBox() {
    if (!state.activeObject) {
      boundingBox.classList.add('hidden');
      return;
    }

    const obj = state.activeObject;
    const page = obj.closest('.paper-page');
    if (!page) return;

    const pageRect = page.getBoundingClientRect();
    const objRect = obj.getBoundingClientRect();

    // Position relative to page
    const left = obj.offsetLeft;
    const top = obj.offsetTop;
    const width = obj.offsetWidth;
    const height = obj.offsetHeight;
    const rotation = parseFloat(obj.dataset.rotation || 0);

    boundingBox.style.width = width + 'px';
    boundingBox.style.height = height + 'px';
    boundingBox.style.left = (page.offsetLeft + left) + 'px';
    boundingBox.style.top = (page.offsetTop + top) + 'px';
    boundingBox.style.transform = `rotate(${rotation}deg)`;
    boundingBox.classList.remove('hidden');

    document.getElementById('obj-dimensions').textContent = `W: ${Math.round(width)}px H: ${Math.round(height)}px`;
  }

  // Object Dragging (Move Tool)
  function attachObjectDragEvents(obj) {
    let isDragging = false;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;

    obj.addEventListener('mousedown', (e) => {
      // If clicking inside contenteditable textbox, don't drag immediately
      if (e.target.isContentEditable && e.detail > 1) return;

      selectObject(obj);
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = obj.offsetLeft;
      initialTop = obj.offsetTop;
      e.stopPropagation();

      const onMouseMove = (moveEvent) => {
        if (!isDragging) return;
        const dx = (moveEvent.clientX - startX) / state.zoom;
        const dy = (moveEvent.clientY - startY) / state.zoom;
        obj.style.left = (initialLeft + dx) + 'px';
        obj.style.top = (initialTop + dy) + 'px';
        updateBoundingBox();
      };

      const onMouseUp = () => {
        isDragging = false;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });
  }

  // 8 Resize Handles (nw, n, ne, e, se, s, sw, w)
  document.querySelectorAll('.resize-handle').forEach(handle => {
    handle.addEventListener('mousedown', (e) => {
      if (!state.activeObject) return;
      e.stopPropagation();

      const handleType = handle.getAttribute('data-handle');
      const obj = state.activeObject;
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = obj.offsetWidth;
      const startHeight = obj.offsetHeight;
      const startLeft = obj.offsetLeft;
      const startTop = obj.offsetTop;

      const onMouseMove = (moveEvent) => {
        const dx = (moveEvent.clientX - startX) / state.zoom;
        const dy = (moveEvent.clientY - startY) / state.zoom;

        let newW = startWidth;
        let newH = startHeight;
        let newL = startLeft;
        let newT = startTop;

        if (handleType.includes('e')) newW = Math.max(30, startWidth + dx);
        if (handleType.includes('s')) newH = Math.max(20, startHeight + dy);
        if (handleType.includes('w')) {
          newW = Math.max(30, startWidth - dx);
          newL = startLeft + (startWidth - newW);
        }
        if (handleType.includes('n')) {
          newH = Math.max(20, startHeight - dy);
          newT = startTop + (startHeight - newH);
        }

        obj.style.width = newW + 'px';
        obj.style.height = newH + 'px';
        obj.style.left = newL + 'px';
        obj.style.top = newT + 'px';
        updateBoundingBox();
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });
  });

  // Rotation Handle
  const handleRotate = document.getElementById('handle-rotate');
  handleRotate.addEventListener('mousedown', (e) => {
    if (!state.activeObject) return;
    e.stopPropagation();

    const obj = state.activeObject;
    const rect = obj.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const onMouseMove = (moveEvent) => {
      const radians = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX);
      let degrees = radians * (180 / Math.PI) + 90; // offset so top is 0
      obj.dataset.rotation = degrees.toFixed(1);
      obj.style.transform = `rotate(${degrees}deg)`;
      updateBoundingBox();
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  });

  // Free Transform (Shortcut: Ctrl + T)
  function toggleFreeTransform() {
    if (!state.activeObject) {
      // Find first floating object if exists
      const firstObj = document.querySelector('.floating-object');
      if (firstObj) selectObject(firstObj);
      else {
        alert('Please select or insert a photo, shape, or text box first to transform (Ctrl + T).');
        return;
      }
    }
    state.isTransformMode = !state.isTransformMode;
    const btn = document.getElementById('btn-free-transform');
    if (state.isTransformMode) {
      btn.classList.add('active');
      boundingBox.style.border = '2px solid #ef4444';
    } else {
      btn.classList.remove('active');
      boundingBox.style.border = '2px dashed var(--primary)';
    }
  }

  document.getElementById('btn-free-transform').addEventListener('click', toggleFreeTransform);
  document.getElementById('btn-selection-tool').addEventListener('click', () => {
    // Switch to move/selection tool mode
    setDrawTool('select');
  });

  // Quick Object Actions: Delete, Front, Back
  document.getElementById('obj-delete').addEventListener('click', () => {
    if (state.activeObject) {
      state.activeObject.remove();
      selectObject(null);
    }
  });

  document.getElementById('obj-front').addEventListener('click', () => {
    if (state.activeObject) {
      objectsLayer.appendChild(state.activeObject);
      updateBoundingBox();
    }
  });

  document.getElementById('obj-back').addEventListener('click', () => {
    if (state.activeObject && objectsLayer.firstChild) {
      objectsLayer.insertBefore(state.activeObject, objectsLayer.firstChild);
      updateBoundingBox();
    }
  });

  // ================= DRAW TAB: DIGITAL INK & MAGICAL BRUSH =================
  const drawCanvas = document.getElementById('canvas-draw-1');
  const drawCtx = drawCanvas.getContext('2d');
  state.activeCanvas = drawCanvas;
  state.activeCtx = drawCtx;

  function resizeCanvas() {
    const page = document.getElementById('page-1');
    drawCanvas.width = page.offsetWidth;
    drawCanvas.height = page.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function setDrawTool(toolName) {
    state.drawTool = toolName;
    document.querySelectorAll('.draw-tool-btn').forEach(btn => {
      btn.classList.toggle('active-tool', btn.getAttribute('data-tool') === toolName);
    });

    if (toolName === 'select') {
      drawCanvas.classList.remove('drawing-active');
    } else {
      drawCanvas.classList.add('drawing-active');
      selectObject(null);
    }
  }

  document.querySelectorAll('.draw-tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setDrawTool(btn.getAttribute('data-tool'));
    });
  });

  const drawColorPicker = document.getElementById('draw-color-picker');
  drawColorPicker.addEventListener('input', (e) => state.drawColor = e.target.value);

  const drawThicknessSlider = document.getElementById('draw-thickness');
  const drawThicknessVal = document.getElementById('draw-thickness-val');
  drawThicknessSlider.addEventListener('input', (e) => {
    state.drawThickness = parseInt(e.target.value, 10);
    drawThicknessVal.textContent = state.drawThickness + 'px';
  });

  document.getElementById('btn-clear-drawings').addEventListener('click', () => {
    drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  });

  // Drawing event listeners
  let lastX = 0, lastY = 0;
  let hue = 0;

  drawCanvas.addEventListener('mousedown', (e) => {
    if (state.drawTool === 'select') return;
    state.isDrawing = true;
    const rect = drawCanvas.getBoundingClientRect();
    lastX = (e.clientX - rect.left) / state.zoom;
    lastY = (e.clientY - rect.top) / state.zoom;
  });

  drawCanvas.addEventListener('mousemove', (e) => {
    if (!state.isDrawing || state.drawTool === 'select') return;
    const rect = drawCanvas.getBoundingClientRect();
    const currentX = (e.clientX - rect.left) / state.zoom;
    const currentY = (e.clientY - rect.top) / state.zoom;

    drawCtx.beginPath();
    drawCtx.moveTo(lastX, lastY);
    drawCtx.lineTo(currentX, currentY);

    if (state.drawTool === 'pen') {
      drawCtx.strokeStyle = state.drawColor;
      drawCtx.lineWidth = state.drawThickness;
      drawCtx.lineCap = 'round';
      drawCtx.lineJoin = 'round';
      drawCtx.globalAlpha = 1.0;
      drawCtx.globalCompositeOperation = 'source-over';
      drawCtx.stroke();
    } else if (state.drawTool === 'highlighter') {
      drawCtx.strokeStyle = state.drawColor;
      drawCtx.lineWidth = Math.max(16, state.drawThickness * 3);
      drawCtx.lineCap = 'square';
      drawCtx.globalAlpha = 0.35;
      drawCtx.globalCompositeOperation = 'multiply';
      drawCtx.stroke();
    } else if (state.drawTool === 'marker') {
      drawCtx.strokeStyle = state.drawColor;
      drawCtx.lineWidth = Math.max(8, state.drawThickness * 2);
      drawCtx.lineCap = 'round';
      drawCtx.globalAlpha = 0.9;
      drawCtx.globalCompositeOperation = 'source-over';
      drawCtx.stroke();
    } else if (state.drawTool === 'brush') {
      drawCtx.strokeStyle = state.drawColor;
      drawCtx.lineWidth = state.drawThickness * 1.5;
      drawCtx.lineCap = 'round';
      drawCtx.shadowBlur = 6;
      drawCtx.shadowColor = state.drawColor;
      drawCtx.globalAlpha = 0.8;
      drawCtx.globalCompositeOperation = 'source-over';
      drawCtx.stroke();
      drawCtx.shadowBlur = 0;
    } else if (state.drawTool === 'magical') {
      // Rainbow hue cycle + star sparkle particles!
      hue = (hue + 8) % 360;
      drawCtx.strokeStyle = `hsl(${hue}, 100%, 55%)`;
      drawCtx.lineWidth = Math.max(6, state.drawThickness);
      drawCtx.lineCap = 'round';
      drawCtx.shadowBlur = 12;
      drawCtx.shadowColor = `hsl(${hue}, 100%, 70%)`;
      drawCtx.globalAlpha = 1.0;
      drawCtx.globalCompositeOperation = 'source-over';
      drawCtx.stroke();
      drawCtx.shadowBlur = 0;

      // Sparkle dots
      drawCtx.fillStyle = '#ffffff';
      drawCtx.beginPath();
      drawCtx.arc(currentX + (Math.random() * 16 - 8), currentY + (Math.random() * 16 - 8), Math.random() * 2.5 + 1, 0, Math.PI * 2);
      drawCtx.fill();
    } else if (state.drawTool === 'eraser') {
      drawCtx.globalCompositeOperation = 'destination-out';
      drawCtx.lineWidth = Math.max(20, state.drawThickness * 4);
      drawCtx.lineCap = 'round';
      drawCtx.stroke();
    }

    lastX = currentX;
    lastY = currentY;
  });

  window.addEventListener('mouseup', () => {
    state.isDrawing = false;
  });

  // ================= FORMS TAB: FILLABLE DOCUMENT INPUTS =================
  function insertAtCursor(html) {
    document.execCommand('insertHTML', false, html);
    editorBody.focus();
    updateCounts();
  }

  document.getElementById('btn-form-textfield').addEventListener('click', () => {
    insertAtCursor(`<span class="form-field-badge"><input type="text" class="doc-form-input" placeholder="Type answer here..." style="width: 180px;"></span> `);
  });

  document.getElementById('btn-form-combobox').addEventListener('click', () => {
    insertAtCursor(`
      <span class="form-field-badge">
        <input list="combo-options" class="doc-form-input" placeholder="Select or type..." style="width: 160px;">
        <datalist id="combo-options">
          <option value="Option Alpha">
          <option value="Option Beta">
          <option value="Option Gamma">
        </datalist>
      </span> `
    );
  });

  document.getElementById('btn-form-dropdown').addEventListener('click', () => {
    insertAtCursor(`
      <span class="form-field-badge">
        <select class="doc-form-input">
          <option>-- Select Choice --</option>
          <option>Choice 1</option>
          <option>Choice 2</option>
          <option>Choice 3</option>
        </select>
      </span> `
    );
  });

  document.getElementById('btn-form-checkbox').addEventListener('click', () => {
    insertAtCursor(`<span class="form-field-badge"><label><input type="checkbox"> Agree / Verified</label></span> `);
  });

  document.getElementById('btn-form-radio').addEventListener('click', () => {
    const radioName = 'radio_' + Date.now();
    insertAtCursor(`
      <span class="form-field-badge">
        <label><input type="radio" name="${radioName}" checked> Yes</label>
        <label style="margin-left:8px;"><input type="radio" name="${radioName}"> No</label>
      </span> `
    );
  });

  document.getElementById('btn-form-image').addEventListener('click', () => {
    insertAtCursor(`
      <div style="display: inline-block; border: 2px dashed #93c5fd; padding: 16px; border-radius: 8px; text-align: center; background: #eff6ff; margin: 8px 0;">
        <span style="font-size: 12px; color: #1e40af; display: block; font-weight: 600;">📷 Image Upload Placeholder</span>
        <input type="file" accept="image/*" style="font-size: 11px; margin-top: 6px;">
      </div><p></p>
    `);
  });

  // Interactive Signature Pad Modal
  const btnFormSig = document.getElementById('btn-form-signature');
  const sigCanvas = document.getElementById('sig-pad-canvas');
  const sigCtx = sigCanvas.getContext('2d');
  let isSigDrawing = false;
  let lastSigX = 0, lastSigY = 0;

  btnFormSig.addEventListener('click', () => {
    sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
    modalSignature.classList.remove('hidden');
  });
  document.getElementById('btn-close-sig-modal').addEventListener('click', () => modalSignature.classList.add('hidden'));

  document.getElementById('btn-sig-clear').addEventListener('click', () => {
    sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
  });

  sigCanvas.addEventListener('mousedown', (e) => {
    isSigDrawing = true;
    const r = sigCanvas.getBoundingClientRect();
    lastSigX = e.clientX - r.left;
    lastSigY = e.clientY - r.top;
  });

  sigCanvas.addEventListener('mousemove', (e) => {
    if (!isSigDrawing) return;
    const r = sigCanvas.getBoundingClientRect();
    const curX = e.clientX - r.left;
    const curY = e.clientY - r.top;
    sigCtx.beginPath();
    sigCtx.moveTo(lastSigX, lastSigY);
    sigCtx.lineTo(curX, curY);
    sigCtx.strokeStyle = '#1e3a8a';
    sigCtx.lineWidth = 2.5;
    sigCtx.lineCap = 'round';
    sigCtx.stroke();
    lastSigX = curX;
    lastSigY = curY;
  });

  window.addEventListener('mouseup', () => isSigDrawing = false);

  document.getElementById('btn-sig-insert').addEventListener('click', () => {
    const dataUrl = sigCanvas.toDataURL('image/png');
    insertAtCursor(`
      <span class="doc-signature-badge">
        <img src="${dataUrl}" alt="Digital Signature">
        <span style="font-size: 10px; color: #64748b; margin-top: 2px;">Digitally Signed & Verified</span>
      </span> `
    );
    modalSignature.classList.add('hidden');
  });

  document.getElementById('btn-form-email').addEventListener('click', () => {
    insertAtCursor(`<span class="form-field-badge"><input type="email" class="doc-form-input" placeholder="user@company.com" style="width: 200px;"></span> `);
  });

  document.getElementById('btn-form-phone').addEventListener('click', () => {
    insertAtCursor(`<span class="form-field-badge"><input type="tel" class="doc-form-input" placeholder="+1 (555) 000-0000" style="width: 160px;"></span> `);
  });

  document.getElementById('btn-form-datetime').addEventListener('click', () => {
    insertAtCursor(`<span class="form-field-badge"><input type="datetime-local" class="doc-form-input"></span> `);
  });

  document.getElementById('btn-form-zip').addEventListener('click', () => {
    insertAtCursor(`<span class="form-field-badge"><input type="text" class="doc-form-input" placeholder="ZIP: 94016" style="width: 100px;"></span> `);
  });

  document.getElementById('btn-form-cc').addEventListener('click', () => {
    insertAtCursor(`
      <span class="doc-credit-card-field">
        <span>💳</span>
        <input type="text" class="doc-form-input" placeholder="•••• •••• •••• ••••" maxlength="19" style="width: 160px; font-family: monospace;">
        <input type="text" class="doc-form-input" placeholder="MM/YY" maxlength="5" style="width: 60px; font-family: monospace;">
      </span> `
    );
  });

  // ================= REFERENCES TAB =================
  // Table of Contents Generator
  document.getElementById('btn-ref-toc').addEventListener('click', () => {
    const headings = editorBody.querySelectorAll('h1, h2, h3');
    if (!headings.length) {
      alert('Please add headings (Heading 1, 2, or 3) in your document first!');
      return;
    }

    let tocHtml = `
      <div class="toc-container" contenteditable="false">
        <div class="toc-title">Table of Contents</div>
    `;

    headings.forEach((h, idx) => {
      const id = 'toc-anchor-' + idx;
      h.id = id;
      const tag = h.tagName.toLowerCase();
      tocHtml += `
        <div class="toc-item toc-${tag}" onclick="document.getElementById('${id}').scrollIntoView({behavior:'smooth'})">
          <span>${h.textContent.trim()}</span>
          <span style="border-bottom: 1px dotted #cbd5e1; flex: 1; margin: 0 8px 4px 8px;"></span>
          <span>p. 1</span>
        </div>
      `;
    });

    tocHtml += '</div><p><br></p>';

    // Check if an existing TOC exists
    const existing = editorBody.querySelector('.toc-container');
    if (existing) {
      existing.outerHTML = tocHtml;
    } else {
      editorBody.insertAdjacentHTML('afterbegin', tocHtml);
    }
  });

  document.getElementById('btn-ref-addtext').addEventListener('click', () => {
    document.execCommand('formatBlock', false, 'h2');
  });

  // Footnote
  let footnoteCounter = 1;
  document.getElementById('btn-ref-footnote').addEventListener('click', () => {
    const num = footnoteCounter++;
    insertAtCursor(`<sup>[${num}]</sup>`);
    const fnArea = document.getElementById('footnotes-1');
    const entry = document.createElement('div');
    entry.className = 'footnote-entry';
    entry.innerHTML = `<strong>[${num}]</strong> <span contenteditable="true">Type footnote reference note here...</span>`;
    fnArea.appendChild(entry);
  });

  // Watermark Modal
  const btnWatermark = document.getElementById('btn-ref-watermark');
  btnWatermark.addEventListener('click', () => modalWatermark.classList.remove('hidden'));
  document.getElementById('btn-close-wm-modal').addEventListener('click', () => modalWatermark.classList.add('hidden'));

  const wmOpacitySlider = document.getElementById('wm-opacity-slider');
  const wmOpacityVal = document.getElementById('wm-opacity-val');
  wmOpacitySlider.addEventListener('input', (e) => {
    wmOpacityVal.textContent = e.target.value + '%';
  });

  document.getElementById('btn-wm-apply').addEventListener('click', () => {
    const text = document.getElementById('wm-text-input').value;
    const opacity = (parseInt(wmOpacitySlider.value, 10) / 100).toFixed(2);
    const wmEl = document.getElementById('watermark-overlay');
    wmEl.textContent = text;
    wmEl.style.color = `rgba(148, 163, 184, ${opacity})`;
    modalWatermark.classList.add('hidden');
  });

  document.getElementById('btn-wm-remove').addEventListener('click', () => {
    document.getElementById('watermark-overlay').textContent = '';
    modalWatermark.classList.add('hidden');
  });

  // Captions & Table of Figures
  let figureCounter = 1;
  document.getElementById('btn-ref-caption').addEventListener('click', () => {
    const figNum = figureCounter++;
    insertAtCursor(`<p class="doc-caption" style="font-size: 12px; color: #64748b; font-style: italic; text-align: center;"><strong>Figure ${figNum}:</strong> Enter description here</p><p></p>`);
  });

  document.getElementById('btn-ref-tof').addEventListener('click', () => {
    const captions = editorBody.querySelectorAll('.doc-caption');
    let tofHtml = '<div style="background:#f8fafc; border:1px solid #e2e8f0; padding:12px; border-radius:6px; margin: 1em 0;"><strong>Table of Figures</strong><ul style="margin-left: 20px; font-size: 13px; color: #2563eb;">';
    captions.forEach(c => {
      tofHtml += `<li>${c.textContent}</li>`;
    });
    if (!captions.length) tofHtml += '<li>No figure captions present in document.</li>';
    tofHtml += '</ul></div><p></p>';
    insertAtCursor(tofHtml);
  });

  // ================= LAYOUT TAB =================
  // Margins
  document.getElementById('layout-margins').addEventListener('change', (e) => {
    const page = document.getElementById('page-1');
    const val = e.target.value;
    if (val === 'normal') page.style.padding = '60px 70px';
    else if (val === 'narrow') page.style.padding = '30px 35px';
    else if (val === 'moderate') page.style.padding = '45px 50px';
    else if (val === 'wide') page.style.padding = '80px 100px';
  });

  // Page Size
  document.getElementById('layout-pagesize').addEventListener('change', (e) => {
    const page = document.getElementById('page-1');
    const val = e.target.value;
    if (val === 'a4') {
      page.style.width = '794px';
      page.style.minHeight = '1123px';
    } else if (val === 'letter') {
      page.style.width = '816px';
      page.style.minHeight = '1056px';
    } else if (val === 'legal') {
      page.style.width = '816px';
      page.style.minHeight = '1344px';
    } else if (val === 'a3') {
      page.style.width = '1123px';
      page.style.minHeight = '1587px';
    }
    resizeCanvas();
  });

  // Columns
  document.getElementById('layout-columns').addEventListener('change', (e) => {
    editorBody.style.columnCount = e.target.value;
    editorBody.style.columnGap = '30px';
  });

  // Insert Page Break
  document.getElementById('btn-insert-page').addEventListener('click', () => {
    state.pageCount++;
    const newPage = document.createElement('div');
    newPage.className = 'paper-page';
    newPage.id = `page-${state.pageCount}`;
    newPage.dataset.pageNum = state.pageCount;
    newPage.innerHTML = `
      <div class="line-numbers-gutter" id="gutter-${state.pageCount}"></div>
      <div class="page-content" contenteditable="true" spellcheck="true">
        <p>New Page ${state.pageCount}</p>
      </div>
      <div class="floating-objects-layer" id="objects-layer-${state.pageCount}"></div>
      <div class="page-footer">
        <div class="footnotes-area" id="footnotes-${state.pageCount}"></div>
        <div class="page-num-display">Page ${state.pageCount}</div>
      </div>
    `;
    pagesContainer.appendChild(newPage);
    updateCounts();
  });

  // Toggle Line Numbers
  document.getElementById('btn-toggle-linenums').addEventListener('click', () => {
    state.lineNumbersVisible = !state.lineNumbersVisible;
    document.querySelectorAll('.paper-page').forEach(p => {
      p.classList.toggle('show-line-numbers', state.lineNumbersVisible);
    });
    if (state.lineNumbersVisible) renderLineNumbers();
  });

  function renderLineNumbers() {
    const gutter = document.getElementById('gutter-1');
    if (!gutter) return;
    let linesHtml = '';
    for (let i = 1; i <= 60; i++) {
      linesHtml += `<div>${i}</div>`;
    }
    gutter.innerHTML = linesHtml;
  }

  // Left & Right Indent
  document.getElementById('input-left-indent').addEventListener('input', (e) => {
    editorBody.style.paddingLeft = e.target.value + 'px';
  });
  document.getElementById('input-right-indent').addEventListener('input', (e) => {
    editorBody.style.paddingRight = e.target.value + 'px';
  });

  // ================= DESIGN TAB =================
  document.querySelectorAll('.theme-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.theme-preset-btn').forEach(b => b.classList.remove('active-preset'));
      btn.classList.add('active-preset');
      const preset = btn.getAttribute('data-theme-preset');
      state.docTheme = preset;

      const titleEl = editorBody.querySelector('h1');
      if (preset === 'modern' && titleEl) titleEl.style.color = '#2563eb';
      else if (preset === 'executive' && titleEl) titleEl.style.color = '#334155';
      else if (preset === 'emerald' && titleEl) titleEl.style.color = '#059669';
      else if (preset === 'purple' && titleEl) titleEl.style.color = '#7c3aed';
      else if (preset === 'crimson' && titleEl) titleEl.style.color = '#e11d48';
    });
  });

  const pageBgColor = document.getElementById('page-bg-color');
  pageBgColor.addEventListener('input', (e) => {
    document.querySelectorAll('.paper-page').forEach(p => p.style.backgroundColor = e.target.value);
  });

  document.getElementById('btn-open-templates-design').addEventListener('click', () => {
    modalStart.classList.remove('hidden');
  });

  // ================= VIEW TAB =================
  // Fullscreen
  document.getElementById('btn-fullscreen').addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  // Zoom Controls
  function setZoom(factor) {
    state.zoom = Math.max(0.5, Math.min(2.0, factor));
    document.documentElement.style.setProperty('--zoom-level', state.zoom);
    zoomPercent.textContent = Math.round(state.zoom * 100) + '%';
    zoomSlider.value = Math.round(state.zoom * 100);
    updateBoundingBox();
  }

  document.getElementById('btn-zoom-in').addEventListener('click', () => setZoom(state.zoom + 0.1));
  document.getElementById('btn-zoom-out').addEventListener('click', () => setZoom(state.zoom - 0.1));
  document.getElementById('btn-fit-page').addEventListener('click', () => setZoom(1.0));
  zoomSlider.addEventListener('input', (e) => setZoom(parseInt(e.target.value, 10) / 100));

  // Ruler Toggle
  document.getElementById('btn-toggle-ruler').addEventListener('click', () => {
    state.rulerVisible = !state.rulerVisible;
    document.getElementById('ruler-container').classList.toggle('ruler-visible', state.rulerVisible);
  });

  // ================= PLUGINS TAB & BLUE THEME =================
  const btnPluginBlue = document.getElementById('btn-plugin-bluetheme');
  const btnBlueQuick = document.getElementById('btn-blue-plugin-quick');

  function toggleBlueTheme() {
    const isBlue = document.body.classList.contains('theme-blue');
    if (isBlue) {
      document.body.classList.remove('theme-blue');
      document.body.classList.add('theme-light');
      btnPluginBlue.style.background = 'transparent';
    } else {
      document.body.classList.remove('theme-light', 'theme-dark', 'theme-slate');
      document.body.classList.add('theme-blue');
      btnPluginBlue.style.background = '#dbeafe';
    }
  }

  btnPluginBlue.addEventListener('click', toggleBlueTheme);
  btnBlueQuick.addEventListener('click', toggleBlueTheme);

  // ================= SETTINGS TAB =================
  const appThemeSel = document.getElementById('app-theme-selector');
  appThemeSel.addEventListener('change', (e) => {
    document.body.className = e.target.value;
  });

  const settingDefaultFont = document.getElementById('setting-default-font');
  settingDefaultFont.addEventListener('change', (e) => {
    editorBody.style.fontFamily = e.target.value;
  });

  // ================= KEYBOARD SHORTCUTS ENGINE =================
  window.addEventListener('keydown', (e) => {
    // Increment font size: Alt + Ctrl + A
    if (e.altKey && e.ctrlKey && (e.key === 'a' || e.key === 'A')) {
      e.preventDefault();
      incrementFontSize();
      return;
    }

    // Decrement font size: Alt + Ctrl + S
    if (e.altKey && e.ctrlKey && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      decrementFontSize();
      return;
    }

    // Free Transform: Ctrl + T
    if (e.ctrlKey && !e.altKey && (e.key === 't' || e.key === 'T')) {
      e.preventDefault();
      toggleFreeTransform();
      return;
    }

    // Alignments
    if (e.ctrlKey && !e.altKey) {
      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        document.execCommand('justifyLeft', false, null);
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        document.execCommand('justifyCenter', false, null);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        document.execCommand('justifyRight', false, null);
      } else if (e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        document.execCommand('justifyFull', false, null);
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        saveDocument();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        printDocument();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        openFindReplace();
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        openFindReplace();
      }
    }
  });

  // ================= REAL-TIME COUNTS (WORDS, CHARS) =================
  function updateCounts() {
    const text = editorBody.innerText || '';
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    statusWords.textContent = `${words} words`;
    statusChars.textContent = `${chars} characters`;
    statusPages.textContent = `Page 1 of ${state.pageCount}`;
  }

  editorBody.addEventListener('input', updateCounts);

  // Close all open modals helper
  function closeAllModals() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.add('hidden'));
  }

  // Click on modal backdrop outside dialog closes it
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.add('hidden');
      }
    });
  });

  // Initial update
  updateCounts();
});
