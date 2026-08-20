/* ==========================================================================
   SARAN RAJ K V - DATA ENGINEER PORTFOLIO JAVASCRIPT
   Features: Pure White Background Theme Default,
   Starfield & Constellation Engine (Light/Dark adaptive),
   Theme Switcher, Filter Tabs, Interactive Sandbox, Modal Architecture, Copy Helper.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. THEME TOGGLE HANDLER (Default to Light / White Background)
  const themeToggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('saran_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const nextTheme = activeTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('saran_theme', nextTheme);
    });
  }

  // 2. STARRY SKY & CONSTELLATIONS CANVAS ENGINE (Adaptive Light/Dark Mode)
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Create 150 Twinkling Particles
    const stars = [];
    const starCount = Math.min(Math.floor(width / 10), 150);

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.5,
        alpha: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3
      });
    }

    // Shooting Stars array
    const shootingStars = [];

    function spawnShootingStar() {
      if (Math.random() < 0.03 && shootingStars.length < 3) {
        shootingStars.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * height * 0.4,
          length: Math.random() * 80 + 40,
          speed: Math.random() * 8 + 5,
          angle: Math.PI / 4,
          opacity: 1
        });
      }
    }

    function renderStarfield() {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const particleColor = isDark ? '#3b82f6' : '#2563eb';
      const lineColor = isDark ? '59, 130, 246' : '37, 99, 235';

      // 1. Draw Interconnected Constellation Lines
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 115) {
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            const lineAlpha = (1 - dist / 115) * (isDark ? 0.2 : 0.15);
            ctx.strokeStyle = `rgba(${lineColor}, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // 2. Draw & Update Twinkling Particles
      stars.forEach(s => {
        s.alpha += s.twinkleSpeed;
        if (s.alpha > 1 || s.alpha < 0.15) s.twinkleSpeed *= -1;

        s.x += s.vx;
        s.y += s.vy;

        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = Math.abs(s.alpha);
        ctx.shadowBlur = s.radius > 1.4 ? (isDark ? 6 : 4) : 0;
        ctx.shadowColor = particleColor;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      // 3. Draw & Update Shooting Stars
      spawnShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        const gradient = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
        gradient.addColorStop(0, particleColor);
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.opacity -= 0.015;

        if (ss.opacity <= 0 || ss.x > width || ss.y > height) {
          shootingStars.splice(i, 1);
        }
      }

      requestAnimationFrame(renderStarfield);
    }

    renderStarfield();
  }

  // 3. INTERACTIVE DAG PIPELINE SANDBOX
  const dagSteps = document.querySelectorAll('.dag-step');
  const dagTitle = document.getElementById('dag-info-title');
  const dagBadge = document.getElementById('dag-info-badge');
  const dagBody = document.getElementById('dag-info-body');

  const dagInfoMap = {
    'sources': {
      title: '<i class="fa-solid fa-server text-primary"></i> Stage 1: Data Sources & Extraction',
      badge: 'Multi-Source Integration',
      body: `
        <p>Extracting raw transactional records, continuous metrics, and ERP event payloads from enterprise relational and legacy sources.</p>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:12px; margin-top:14px;">
          <div style="background:var(--bg-card); padding:12px; border-radius:12px; border:1px solid var(--border-color); font-size:0.88rem;"><strong>Source Systems:</strong> Oracle DB, MySQL, PostgreSQL, REST APIs, JSON logs.</div>
          <div style="background:var(--bg-card); padding:12px; border-radius:12px; border:1px solid var(--border-color); font-size:0.88rem;"><strong>Extraction Pattern:</strong> Scheduled batch SQL queries, CTEs, and Change Data Capture (CDC).</div>
          <div style="background:var(--bg-card); padding:12px; border-radius:12px; border:1px solid var(--border-color); font-size:0.88rem;"><strong>Audit & Quality:</strong> Row count validation, primary key deduplication, schema checks.</div>
        </div>
      `
    },
    'ingestion': {
      title: '<i class="fa-brands fa-aws text-primary"></i> Stage 2: AWS Staging & Event Ingestion',
      badge: 'Amazon S3 & AWS Lambda',
      body: `
        <p>Staging raw data landing zones on AWS S3 with automated event notification triggers and continuous micro-batch loaders.</p>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:12px; margin-top:14px;">
          <div style="background:var(--bg-card); padding:12px; border-radius:12px; border:1px solid var(--border-color); font-size:0.88rem;"><strong>Cloud Storage:</strong> Amazon S3 buckets, AWS IAM access policies.</div>
          <div style="background:var(--bg-card); padding:12px; border-radius:12px; border:1px solid var(--border-color); font-size:0.88rem;"><strong>Ingestion Engines:</strong> AWS Lambda event functions, Talend Open Studio, Pentaho.</div>
          <div style="background:var(--bg-card); padding:12px; border-radius:12px; border:1px solid var(--border-color); font-size:0.88rem;"><strong>Security:</strong> KMS encrypted landing storage, strict RBAC policy enforcement.</div>
        </div>
      `
    },
    'orchestration': {
      title: '<i class="fa-solid fa-wind text-primary"></i> Stage 3: Workflow Orchestration & Continuous Delivery',
      badge: 'Airflow & Jenkins CI/CD',
      body: `
        <p>Scheduling and managing complex data dependencies via automated Apache Airflow Directed Acyclic Graphs (DAGs).</p>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:12px; margin-top:14px;">
          <div style="background:var(--bg-card); padding:12px; border-radius:12px; border:1px solid var(--border-color); font-size:0.88rem;"><strong>Orchestration:</strong> Apache Airflow DAGs with custom Python operators & sensors.</div>
          <div style="background:var(--bg-card); padding:12px; border-radius:12px; border:1px solid var(--border-color); font-size:0.88rem;"><strong>Continuous Ingestion:</strong> Snowpipe automated copy trigger on S3 event payloads.</div>
          <div style="background:var(--bg-card); padding:12px; border-radius:12px; border:1px solid var(--border-color); font-size:0.88rem;"><strong>CI/CD Pipelines:</strong> Jenkins automation & GitHub Actions for DAG version control.</div>
        </div>
      `
    },
    'warehouse': {
      title: '<i class="fa-solid fa-snowflake text-primary"></i> Stage 4: Enterprise Snowflake Lakehouse Architecture',
      badge: 'RAW -> STAGING -> CURATED',
      body: `
        <p>Designing multi-layer Snowflake dimensional data warehouses with high performance, zero-copy cloning, and minimal governance overhead.</p>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:12px; margin-top:14px;">
          <div style="background:var(--bg-card); padding:12px; border-radius:12px; border:1px solid var(--border-color); font-size:0.88rem;"><strong>Warehouse Layers:</strong> RAW (landing), STAGING (cleansed), CURATED (Star Schema).</div>
          <div style="background:var(--bg-card); padding:12px; border-radius:12px; border:1px solid var(--border-color); font-size:0.88rem;"><strong>SCD Patterns:</strong> Slowly Changing Dimensions (SCD Type 1 & Type 2).</div>
          <div style="background:var(--bg-card); padding:12px; border-radius:12px; border:1px solid var(--border-color); font-size:0.88rem;"><strong>Performance Tuning:</strong> Clustering keys, warehouse auto-scaling, Streams & Tasks.</div>
        </div>
      `
    },
    'consumption': {
      title: '<i class="fa-solid fa-chart-line text-primary"></i> Stage 5: Analytics Dashboards & AI/ML Models',
      badge: 'Power BI & DP-SGD MLOps',
      body: `
        <p>Delivering analytics-ready datasets for executive reporting dashboards and privacy-preserving AI prediction endpoints.</p>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:12px; margin-top:14px;">
          <div style="background:var(--bg-card); padding:12px; border-radius:12px; border:1px solid var(--border-color); font-size:0.88rem;"><strong>BI Platforms:</strong> Power BI & Tableau executive KPI dashboards.</div>
          <div style="background:var(--bg-card); padding:12px; border-radius:12px; border:1px solid var(--border-color); font-size:0.88rem;"><strong>AI/ML Pipelines:</strong> PyTorch & Opacus DP-SGD Differential Privacy fine-tuning.</div>
          <div style="background:var(--bg-card); padding:12px; border-radius:12px; border:1px solid var(--border-color); font-size:0.88rem;"><strong>Model Tracking:</strong> Docker containerized FastAPI endpoints & MLflow tracking.</div>
        </div>
      `
    }
  };

  dagSteps.forEach(step => {
    step.addEventListener('click', () => {
      dagSteps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');

      const key = step.dataset.dag;
      if (dagInfoMap[key]) {
        dagTitle.innerHTML = dagInfoMap[key].title;
        dagBadge.textContent = dagInfoMap[key].badge;
        dagBody.innerHTML = dagInfoMap[key].body;
      }
    });
  });

  // 4. MODAL POPUP DETAILS
  const modalBackdrop = document.getElementById('details-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalHead = document.getElementById('modal-head');
  const modalBody = document.getElementById('modal-body');
  const viewDetailBtns = document.querySelectorAll('.view-details-btn');

  const modalData = {
    'project-ai': {
      title: 'Privacy-Preserving Intent Classification using Differentially Private Fine-Tuning',
      domain: 'Artificial Intelligence / NLP',
      date: '01/2026 – Present',
      tech: ['Python', 'SQL', 'PyTorch', 'Opacus (DP-SGD)', 'Docker', 'FastAPI', 'MLflow', 'Differential Privacy'],
      summary: 'Fine-tuned a transformer-based NLP model for customer intent classification using DP-SGD to safeguard sensitive training data while maintaining high predictive performance.',
      points: [
        'Implemented end-to-end privacy-aware ML training pipeline with differential privacy guarantees (&epsilon;, &delta; logging).',
        'Containerized services using Docker and FastAPI REST inference endpoints for real-time predictions.',
        'Tracked model versions, privacy budget consumption, latency, and accuracy metrics in MLflow dashboards.'
      ],
      flow: 'Customer Text &rightarrow; Preprocessing &rightarrow; PyTorch (Opacus DP-SGD) &rightarrow; Privacy Budget Logger &rightarrow; Docker REST Endpoint &rightarrow; MLflow'
    },
    'project-finance': {
      title: 'Collaborative Financial Reporting & Investment Analytics Platform (FinVeritas)',
      domain: 'Banking & Financial Services',
      date: '03/2025 – 12/2025',
      tech: ['Snowflake', 'Apache Airflow', 'AWS S3', 'Snowpipe', 'Talend', 'Oracle', 'MySQL', 'Power BI', 'Jenkins'],
      summary: 'Built and optimized an enterprise Snowflake financial data warehouse with RAW, STAGING, and CURATED layers, integrating multi-source transactional databases.',
      points: [
        'Implemented dimensional modeling (Star Schema) and Slowly Changing Dimensions (SCD Type 1 & Type 2).',
        'Automated workflow orchestration using Apache Airflow and Jenkins CI/CD pipelines.',
        'Designed Power BI & Tableau dashboards for executive investment metrics and compliance reporting.'
      ],
      flow: 'Oracle / MySQL &rightarrow; Talend / Airflow &rightarrow; AWS S3 &rightarrow; Snowpipe &rightarrow; Snowflake (RAW &rightarrow; STAGING &rightarrow; CURATED) &rightarrow; Power BI'
    },
    'project-mfg': {
      title: 'Textile Manufacturing Data Pipeline & Analytics Platform',
      domain: 'Manufacturing Industry',
      date: '05/2024 – 02/2025',
      tech: ['Python', 'AWS Lambda', 'Amazon S3', 'Snowflake', 'Snowpipe', 'Power BI', 'SQL'],
      summary: 'Designed an end-to-end automated serverless ETL data pipeline extracting production metrics from ERP systems into AWS S3 and Snowflake.',
      points: [
        'Automated event-driven data ingestion using AWS Lambda triggers and Snowpipe continuous copy.',
        'Performed automated data cleansing, validation, transformation, and deduplication.',
        'Built operational Power BI dashboards tracking factory production output and material yields.'
      ],
      flow: 'ERP Production Sources &rightarrow; S3 Event Trigger &rightarrow; AWS Lambda &rightarrow; Snowpipe &rightarrow; Snowflake Fact/Dim &rightarrow; Power BI'
    },
    'project-hc': {
      title: 'RCM Data Platform Modernization',
      domain: 'Healthcare Revenue Cycle Management',
      date: '07/2023 – 04/2024',
      tech: ['Snowflake', 'SQL', 'Oracle', 'Talend', 'Pentaho', 'Airflow', 'AWS S3', 'Snowpipe', 'CloudWatch', 'Tableau'],
      summary: 'Modernized legacy medical billing and claims data pipelines into a cloud-native Snowflake platform with CloudWatch alerts.',
      points: [
        'Extracted data from CRM, billing, and claims systems with event-driven S3/Lambda processing.',
        'Automated data loading using Snowflake COPY INTO and Snowpipe micro-batching.',
        'Improved SQL query performance through warehouse clustering and custom table partitioning.'
      ],
      flow: 'Billing & Claims &rightarrow; Talend / Python &rightarrow; AWS S3 &rightarrow; Snowpipe &rightarrow; Snowflake Warehouse &rightarrow; CloudWatch Alerts & Tableau'
    }
  };

  viewDetailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.modal;
      const d = modalData[key];
      if (d) {
        modalHead.innerHTML = `
          <span class="period-badge" style="margin-bottom:8px;">${d.domain}</span>
          <h2 style="font-size:1.4rem; margin-bottom:4px; font-weight:800;">${d.title}</h2>
          <span style="font-family:var(--font-mono); font-size:0.8rem; color:var(--text-muted);">${d.date}</span>
        `;

        const techPills = d.tech.map(t => `<span style="font-family:var(--font-mono); font-size:0.75rem; background:var(--bg-muted); padding:4px 12px; border-radius:9999px; margin-right:6px; margin-bottom:6px; inline-block">${t}</span>`).join(' ');
        const pointLis = d.points.map(p => `<li style="font-size:0.9rem; color:var(--text-muted); margin-bottom:6px; position:relative; padding-left:18px;"><span style="position:absolute; left:0; color:var(--color-primary);">▸</span>${p}</li>`).join('');

        modalBody.innerHTML = `
          <p style="font-size:0.95rem; color:var(--text-muted); margin-bottom:18px; margin-top:12px;">${d.summary}</p>
          <div style="background:var(--bg-main); padding:16px; border-radius:18px; border:1px solid var(--border-color); margin-bottom:18px;">
            <h4 style="font-size:0.9rem; font-family:var(--font-mono); color:var(--color-primary); margin-bottom:6px;"><i class="fa-solid fa-diagram-project"></i> Pipeline Flow Architecture</h4>
            <p style="font-family:var(--font-mono); font-size:0.82rem; color:var(--text-main);">${d.flow}</p>
          </div>
          <h4 style="font-size:1rem; margin-bottom:8px; font-weight:800;">Key Technical Deliverables</h4>
          <ul style="list-style:none; margin-bottom:18px;">${pointLis}</ul>
          <h4 style="font-size:1rem; margin-bottom:8px; font-weight:800;">Tech Stack</h4>
          <div style="display:flex; flex-wrap:wrap;">${techPills}</div>
        `;

        modalBackdrop.classList.add('active');
      }
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', () => modalBackdrop.classList.remove('active'));
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) modalBackdrop.classList.remove('active');
    });
  }

  // 5. COPY TO CLIPBOARD HELPER
  window.copyValue = function(val, btn) {
    navigator.clipboard.writeText(val).then(() => {
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check" style="color:var(--color-primary);"></i>';
      setTimeout(() => { btn.innerHTML = orig; }, 2000);
    });
  };

  // 6. FORM SUBMISSION HANDLER
  window.submitContactForm = function(e) {
    e.preventDefault();
    const msg = document.getElementById('form-msg');
    msg.className = 'form-msg success';
    msg.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent successfully. Saran will respond shortly.';
    document.getElementById('contact-form').reset();
    setTimeout(() => { msg.style.display = 'none'; }, 5000);
  };

  // 7. SCROLL TRACKER
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

});
