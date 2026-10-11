/* =========================================================
   RoLab Academy — main interactions
   ========================================================= */
(() => {
    'use strict';

    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => [...c.querySelectorAll(s)];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;

    /* ---------------------------------------------------------
       DATA — редактируйте здесь
       --------------------------------------------------------- */

    // Филиалы. Чтобы добавить новый филиал — добавьте объект в массив,
    // переключатель вкладок появится автоматически.
    const BRANCHES = [
        {
            id: 'bayzak',
            tab: 'Байзак',
            title: 'Головной офис «Байзак»',
            address: 'пр. Абая 52в, БЦ Bayzak, 6 этаж, офис 616',
            schedule: [
                ['Суббота', '11:00 – 18:00'],
                ['Воскресенье', '11:00 – 18:00'],
                ['Будни (вечер)', 'группы для взрослых'],
            ],
            badge: 'Детские группы — по выходным',
            phone: '+7 777 041 80 41',
            tel: '+77770418041',
            wa: '77770418041',
            gis: 'https://2gis.kz/almaty/geo/70000001103500803',
            mapQuery: 'проспект Абая 52в, Алматы',
        },
    ];

    // Проекты учеников. TODO: заменить фото и подписи на реальные работы.
    const PROJECTS = [
        {
            title: 'Робот-сортировщик',
            age: '11 лет',
            tech: 'LEGO Robotics',
            img: 'pic/new/project_sorter_robot.jpg',
            text: 'Робот с конвейером и датчиком цвета, который сам раскладывает детали по лоткам. Ученик спроектировал механику и написал алгоритм сортировки.',
        },
        {
            title: 'Умная метеостанция',
            age: '13 лет',
            tech: 'Arduino · C++',
            img: 'pic/new/project_arduino_station.jpg',
            text: 'Измеряет температуру и влажность, выводит данные на дисплей и подаёт сигнал, если в комнате слишком душно.',
        },
        {
            title: 'Обби «Neon Run»',
            age: '10 лет',
            tech: 'Roblox Studio · Lua',
            img: 'pic/new/project_game.jpg',
            text: 'Полоса препятствий с неоновыми платформами, лавой и чекпоинтами. Скрипты на Lua отвечают за ловушки и таблицу рекордов.',
        },
        {
            title: 'Космобот',
            age: '12 лет',
            tech: '3D-моделирование',
            img: 'pic/new/project_3d_model.jpg',
            text: 'Персонаж и космический корабль, смоделированные с нуля: от эскиза на бумаге до готовой 3D-модели.',
        },
        {
            title: 'Робот для FLL',
            age: 'команда 10–14 лет',
            tech: 'FIRST LEGO League',
            img: 'pic/fll.jpg',
            text: 'Соревновательный робот для выполнения миссий на поле турнира FIRST LEGO League. Команда сама спроектировала навесное оборудование.',
        },
        {
            title: 'Игра «Змейка»',
            age: '14 лет',
            tech: 'Python',
            img: 'pic/new/course_python.jpg',
            text: 'Классическая игра на Python с уровнями сложности, подсчётом очков и сохранением рекорда.',
        },
    ];

    /* ---------------------------------------------------------
       Init
       --------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', () => {
        requestAnimationFrame(() => document.body.classList.add('loaded'));
        $('#year').textContent = new Date().getFullYear();

        initNav();
        initReveal();
        initParticles();
        initHero3D();
        initCourseDetails();
        initFilters();
        initProjects();
        initBranches();
        initForm();
        initStickyCta();
    });

    /* ---------------------------------------------------------
       NAV
       --------------------------------------------------------- */
    function initNav() {
        const nav = $('#nav');
        const burger = $('#burger');
        const menu = $('#mobile-menu');

        const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        const outside = [$('main'), $('.footer'), $('#sticky-cta')].filter(Boolean);
        const setMenu = (open) => {
            nav.classList.toggle('open', open);
            menu.classList.toggle('open', open);
            burger.setAttribute('aria-expanded', String(open));
            burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
            menu.setAttribute('aria-hidden', String(!open));
            document.body.style.overflow = open ? 'hidden' : '';
            document.body.classList.toggle('menu-open', open);
            // Keep keyboard / screen-reader focus in the header + drawer while it is open
            outside.forEach((el) => { el.inert = open; });
        };
        burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
        $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); burger.focus(); }
        });
        window.addEventListener('resize', () => { if (isDesktop()) setMenu(false); });

        // Active link highlighting
        const links = $$('.nav-links a');
        const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
        const io = new IntersectionObserver((entries) => {
            entries.forEach((en) => {
                if (en.isIntersecting) {
                    links.forEach((l) => l.classList.remove('active'));
                    map.get(en.target.id)?.classList.add('active');
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
    }

    /* ---------------------------------------------------------
       REVEAL ON SCROLL
       --------------------------------------------------------- */
    function initReveal() {
        const items = $$('.reveal');
        if (reduceMotion || !('IntersectionObserver' in window)) {
            items.forEach((el) => el.classList.add('in'));
            return;
        }
        const io = new IntersectionObserver((entries) => {
            entries.forEach((en) => {
                if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        items.forEach((el) => io.observe(el));
    }

    /* ---------------------------------------------------------
       HERO PARTICLES (2D canvas, paused off-screen)
       --------------------------------------------------------- */
    function initParticles() {
        const canvas = $('#particles');
        if (!canvas || reduceMotion || window.innerWidth < 768) return;
        const ctx = canvas.getContext('2d');
        const hero = $('#hero');
        let w, h, dpr, pts = [], running = false, raf;

        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = hero.clientWidth; h = hero.clientHeight;
            canvas.width = w * dpr; canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const count = Math.round(Math.min(70, (w * h) / 22000));
            pts = Array.from({ length: count }, () => ({
                x: Math.random() * w, y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
                r: Math.random() * 1.6 + 0.4,
            }));
        };

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            for (let i = 0; i < pts.length; i++) {
                const p = pts[i];
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(34,211,238,.7)';
                ctx.fill();
                for (let j = i + 1; j < pts.length; j++) {
                    const q = pts[j];
                    const dx = p.x - q.x, dy = p.y - q.y;
                    const d = dx * dx + dy * dy;
                    if (d < 12000) {
                        ctx.strokeStyle = `rgba(21,155,255,${0.14 * (1 - d / 12000)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
                    }
                }
            }
            raf = requestAnimationFrame(draw);
        };

        resize();
        window.addEventListener('resize', resize);
        new IntersectionObserver(([en]) => {
            if (en.isIntersecting && !running) { running = true; draw(); }
            else if (!en.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
        }).observe(hero);
    }

    /* ---------------------------------------------------------
       HERO 3D — optional, lazy-loaded, desktop only
       --------------------------------------------------------- */
    function initHero3D() {
        const visual = $('#hero-visual');
        const mount = $('#hero-3d');
        if (!visual || !mount) return;

        const webgl = (() => {
            try {
                const c = document.createElement('canvas');
                return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
            } catch { return false; }
        })();
        const saveData = navigator.connection && navigator.connection.saveData;
        const weakCpu = (navigator.hardwareConcurrency || 4) < 4;
        if (!isDesktop() || reduceMotion || !webgl || saveData || weakCpu) return; // static fallback stays

        const load = () => {
            import('./hero3d.js')
                .then((m) => m.initHero3D(mount))
                .then(() => visual.classList.add('is-3d'))
                .catch((err) => console.warn('[RoLab] 3D scene skipped, using static fallback:', err));
        };
        const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 600));
        if (document.readyState === 'complete') idle(load);
        else window.addEventListener('load', () => idle(load), { once: true });
    }

    /* ---------------------------------------------------------
       COURSE DETAILS — on phones "Что создаст" + schedule collapse
       behind a toggle (CSS shows everything from 640px up)
       --------------------------------------------------------- */
    function initCourseDetails() {
        const chevron = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
        $$('#course-grid .course-card').forEach((card, i) => {
            const items = [$('.cc-build', card), $('.cc-meta', card)].filter(Boolean);
            if (!items.length) return;
            const label = `${$('.cc-build small', card)?.textContent || 'Подробнее'} и расписание`;
            const more = document.createElement('div');
            more.className = 'cc-more';
            more.id = `cc-more-${i}`;
            items[0].before(more);
            items.forEach((el) => more.append(el));

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'cc-toggle';
            btn.setAttribute('aria-expanded', 'false');
            btn.setAttribute('aria-controls', more.id);
            btn.innerHTML = `<span>${label}</span>${chevron}`;
            more.before(btn);
            btn.addEventListener('click', () => {
                const open = btn.getAttribute('aria-expanded') !== 'true';
                btn.setAttribute('aria-expanded', String(open));
                card.classList.toggle('details-open', open);
            });
        });
    }

    /* ---------------------------------------------------------
       COURSE FILTERS
       --------------------------------------------------------- */
    function initFilters() {
        const btns = $$('.filter-btn');
        const cards = $$('#course-grid .course-card');
        const match = (card, f) => f === 'all' || card.dataset.ages.split(' ').includes(f);

        btns.forEach((b) => {
            const n = cards.filter((c) => match(c, b.dataset.filter)).length;
            $('.count', b).textContent = n;
        });

        // Fade hint on the scrollable filter bar (mobile) — removed at the end / when it fits
        const bar = $('.filters');
        const syncFade = () => {
            const max = bar.scrollWidth - bar.clientWidth;
            bar.classList.toggle('no-scroll', max <= 2);
            bar.classList.toggle('at-end', bar.scrollLeft >= max - 2);
        };
        bar.addEventListener('scroll', syncFade, { passive: true });
        window.addEventListener('resize', syncFade);
        syncFade();

        // 2-column tablet grid: if the visible cards leave one alone in the last row, widen it
        const balance = () => {
            const visible = cards.filter((c) => !c.classList.contains('is-hidden'));
            const regular = visible.filter((c) => !c.classList.contains('featured'));
            cards.forEach((c) => c.classList.remove('wide'));
            if (regular.length % 2 === 1) regular[regular.length - 1].classList.add('wide');
        };
        balance();

        btns.forEach((btn) => btn.addEventListener('click', () => {
            const f = btn.dataset.filter;
            btns.forEach((b) => { b.classList.toggle('active', b === btn); b.setAttribute('aria-selected', String(b === btn)); });
            cards.forEach((c, i) => {
                const show = match(c, f);
                c.classList.toggle('is-hidden', !show);
                c.classList.remove('fade-in');
                if (show) {
                    c.classList.add('in');
                    void c.offsetWidth; // restart animation
                    c.style.animationDelay = `${i * 40}ms`;
                    c.classList.add('fade-in');
                }
            });
            balance();
        }));
    }

    /* ---------------------------------------------------------
       PROJECTS — gallery, drag, controls, lightbox
       --------------------------------------------------------- */
    function initProjects() {
        const track = $('#project-track');
        if (!track) return;

        track.innerHTML = PROJECTS.map((p, i) => `
            <article class="project-card" data-index="${i}">
                <img src="${p.img}" alt="${p.title} — проект ученика" loading="lazy" draggable="false">
                <div class="pc-top"><span class="tag-pill dark">${p.tech}</span></div>
                <div class="pc-info">
                    <h3>${p.title}</h3>
                    <div class="pc-meta">Ученик · ${p.age}</div>
                    <div class="pc-details"><div>
                        <p>${p.text}</p>
                        <button class="btn btn-primary btn-sm js-project" data-index="${i}" id="project-btn-${i}">Смотреть проект</button>
                    </div></div>
                </div>
            </article>`).join('');

        const prev = $('#proj-prev');
        const next = $('#proj-next');
        const bar = $('#proj-progress');
        const step = () => (track.querySelector('.project-card')?.offsetWidth || 300) + 22;

        const update = () => {
            const max = track.scrollWidth - track.clientWidth;
            const ratio = max > 0 ? track.scrollLeft / max : 0;
            const visible = track.clientWidth / track.scrollWidth;
            bar.style.width = `${Math.max(visible * 100, 12)}%`;
            bar.style.transform = `translateX(${ratio * (100 / Math.max(visible, 0.12) - 100)}%)`;
            prev.disabled = track.scrollLeft < 4;
            next.disabled = track.scrollLeft > max - 4;
        };
        prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
        next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
        track.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        update();

        // Mouse drag-to-scroll
        let down = false, startX = 0, startLeft = 0, moved = false;
        track.addEventListener('pointerdown', (e) => {
            if (e.pointerType !== 'mouse') return;
            down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft;
        });
        window.addEventListener('pointermove', (e) => {
            if (!down) return;
            const dx = e.clientX - startX;
            if (Math.abs(dx) > 5) { moved = true; track.classList.add('dragging'); }
            track.scrollLeft = startLeft - dx;
        });
        window.addEventListener('pointerup', () => { down = false; track.classList.remove('dragging'); });
        track.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);

        // Keyboard
        track.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); next.click(); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); prev.click(); }
        });

        // Lightbox
        const lb = $('#lightbox');
        const open = (i) => {
            const p = PROJECTS[i];
            $('#lb-img').src = p.img;
            $('#lb-img').alt = p.title;
            $('#lb-title').textContent = p.title;
            $('#lb-text').textContent = p.text;
            $('#lb-tags').innerHTML = `<span class="tag-pill">${p.tech}</span><span class="tag-pill dark">Ученик · ${p.age}</span>`;
            if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
        };
        track.addEventListener('click', (e) => {
            const btn = e.target.closest('.js-project');
            if (btn) open(+btn.dataset.index);
        });
        $('#lb-close').addEventListener('click', () => lb.close());
        lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
        $('#lb-cta').addEventListener('click', () => lb.close());
    }

    /* ---------------------------------------------------------
       BRANCHES
       --------------------------------------------------------- */
    function initBranches() {
        const tabs = $('#branch-tabs');
        const info = $('#branch-info');
        const map = $('#branch-map');
        if (!tabs) return;

        const icon = {
            pin: '<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
            clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
            phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
        };
        const svg = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;

        const render = (b) => {
            info.innerHTML = `
                <div class="branch-info">
                    <h3>${b.title}</h3>
                    <div class="bi-row"><span class="bi-ic">${svg(icon.pin)}</span><div><small>Адрес</small><b>${b.address}</b></div></div>
                    <div class="bi-row"><span class="bi-ic">${svg(icon.clock)}</span><div style="flex:1"><small>Расписание</small>
                        <div class="sched-list">${b.schedule.map(([d, t]) => `<div><span>${d}</span><b>${t}</b></div>`).join('')}</div></div></div>
                    <div class="bi-row"><span class="bi-ic">${svg(icon.phone)}</span><div><small>Телефон</small><a class="val" href="tel:${b.tel}">${b.phone}</a></div></div>
                </div>
                <div class="branch-actions" style="margin-top:24px">
                    <a href="tel:${b.tel}" class="btn btn-outline btn-sm" id="branch-call-${b.id}">Позвонить</a>
                    <a href="https://wa.me/${b.wa}" target="_blank" rel="noopener" class="btn btn-wa btn-sm" id="branch-wa-${b.id}">WhatsApp</a>
                    <a href="${b.gis}" target="_blank" rel="noopener" class="btn btn-primary btn-sm btn-2gis" id="branch-2gis-${b.id}">
                        Открыть в 2GIS
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M7 7h10v10"/></svg>
                    </a>
                </div>`;
            $('#map-badge-text').textContent = b.badge;
            const src = `https://maps.google.com/maps?q=${encodeURIComponent(b.mapQuery)}&z=16&hl=ru&output=embed`;
            if (map.dataset.src !== src) { map.dataset.src = src; lazyMap(src); }
        };

        // Load the map iframe only when the section is near the viewport
        let mapVisible = false, pending = null;
        const lazyMap = (src) => { if (mapVisible) map.src = src; else pending = src; };
        new IntersectionObserver(([en], obs) => {
            if (en.isIntersecting) { mapVisible = true; if (pending) map.src = pending; obs.disconnect(); }
        }, { rootMargin: '300px' }).observe(map);

        if (BRANCHES.length > 1) {
            tabs.innerHTML = BRANCHES.map((b, i) =>
                `<button class="branch-tab${i === 0 ? ' active' : ''}" role="tab" aria-selected="${i === 0}" data-id="${b.id}" id="branch-tab-${b.id}">${b.tab}</button>`
            ).join('');
            tabs.addEventListener('click', (e) => {
                const t = e.target.closest('.branch-tab');
                if (!t) return;
                $$('.branch-tab', tabs).forEach((x) => { x.classList.toggle('active', x === t); x.setAttribute('aria-selected', String(x === t)); });
                render(BRANCHES.find((b) => b.id === t.dataset.id));
            });
        } else {
            tabs.remove();
        }
        render(BRANCHES[0]);
    }

    /* ---------------------------------------------------------
       FORM
       --------------------------------------------------------- */
    function initForm() {
        const form = $('#trial-form');
        if (!form) return;
        const card = $('#form-card');
        const phone = $('#phone');
        const select = $('#course-selection');
        const category = $('#category-hidden');
        const consent = $('#consent');
        const consentLabel = $('#consent-label');
        const bar = $('#fp-bar');
        const submit = $('#submit-btn');
        const iframe = $('#hidden_iframe');
        const required = ['parent-name', 'phone', 'child-name', 'course'];

        // Phone mask: +7 (777) 041-80-41
        const formatPhone = (v) => {
            let d = v.replace(/\D/g, '');
            if (d.startsWith('8')) d = '7' + d.slice(1);
            if (!d.startsWith('7')) d = '7' + d;
            d = d.slice(0, 11);
            const p = d.slice(1);
            let out = '+7';
            if (p.length) out += ' (' + p.slice(0, 3);
            if (p.length >= 3) out += ')';
            if (p.length > 3) out += ' ' + p.slice(3, 6);
            if (p.length > 6) out += '-' + p.slice(6, 8);
            if (p.length > 8) out += '-' + p.slice(8, 10);
            return out;
        };
        phone.addEventListener('input', () => { phone.value = formatPhone(phone.value); });
        phone.addEventListener('focus', () => { if (!phone.value) phone.value = '+7 ('; });
        phone.addEventListener('blur', () => { if (phone.value.replace(/\D/g, '').length <= 1) phone.value = ''; });

        const isValid = (id) => {
            const el = document.getElementById(id);
            if (id === 'phone') return el.value.replace(/\D/g, '').length === 11;
            if (id === 'course') return !!select.value;
            return el.value.trim().length >= 2;
        };
        const fieldOf = (id) => (id === 'course' ? select : document.getElementById(id)).closest('.field');

        const updateProgress = () => {
            let done = 0;
            required.forEach((id) => {
                const ok = isValid(id);
                if (ok) done++;
                $(`.fp-steps [data-step="${id}"]`).classList.toggle('done', ok);
                const f = fieldOf(id);
                f.classList.toggle('valid', ok);
                if (ok) f.classList.remove('invalid');
            });
            bar.style.width = `${(done / required.length) * 100}%`;
        };
        form.addEventListener('input', updateProgress);
        form.addEventListener('change', updateProgress);
        consent.addEventListener('change', () => consentLabel.classList.remove('invalid'));

        select.addEventListener('change', () => {
            const opt = select.selectedOptions[0];
            category.value = opt?.parentElement?.dataset.category || '';
        });

        // "Записаться" buttons on course cards → prefill course
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.js-enroll');
            if (!btn) return;
            e.preventDefault();
            const value = btn.dataset.course;
            const opt = [...select.options].find((o) => o.value === value || o.text === value);
            if (opt) { select.value = opt.value; select.dispatchEvent(new Event('change', { bubbles: true })); }
            $('#contact').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
            setTimeout(() => {
                const firstEmpty = required.map((id) => document.getElementById(id === 'course' ? 'course-selection' : id)).find((el) => !el.value);
                (firstEmpty || $('#parent-name')).focus({ preventScroll: true });
            }, 700);
        });

        let submitting = false;
        form.addEventListener('submit', (e) => {
            let ok = true;
            required.forEach((id) => {
                const valid = isValid(id);
                fieldOf(id).classList.toggle('invalid', !valid);
                if (!valid) ok = false;
            });
            if (!consent.checked) { consentLabel.classList.add('invalid'); ok = false; }
            if (!ok || submitting) {
                e.preventDefault();
                const first = $('.field.invalid input, .field.invalid select', form) || (!consent.checked && consent);
                first && first.focus();
                return;
            }
            // Let the form submit naturally into the hidden iframe (Google Sheets)
            submitting = true;
            submit.disabled = true;
            submit.innerHTML = '<span class="spinner"></span><span>Отправляем…</span>';

            const name = $('#parent-name').value.trim().split(' ')[0];
            let finished = false;
            const done = () => {
                if (finished) return;
                finished = true;
                $('#success-name').textContent = name ? `Спасибо, ${name}` : 'Спасибо';
                card.classList.add('sent');
                card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
                if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead', { course: select.value });
                if (typeof window.fbq === 'function') window.fbq('track', 'Lead');
            };
            const start = Date.now();
            iframe.addEventListener('load', () => setTimeout(done, Math.max(0, 900 - (Date.now() - start))), { once: true });
            setTimeout(done, 3500); // fallback
        });

        $('#form-reset').addEventListener('click', () => {
            form.reset();
            category.value = '';
            submitting = false;
            submit.disabled = false;
            submit.innerHTML = '<span class="btn-label">Записаться бесплатно</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
            $$('.field', form).forEach((f) => f.classList.remove('valid', 'invalid'));
            card.classList.remove('sent');
            updateProgress();
        });

        updateProgress();
    }

    /* ---------------------------------------------------------
       MOBILE STICKY CTA
       --------------------------------------------------------- */
    function initStickyCta() {
        const el = $('#sticky-cta');
        if (!el) return;
        let heroOut = false, contactIn = false, branchesIn = false;
        const sync = () => el.classList.toggle('show', heroOut && !contactIn && !branchesIn);
        new IntersectionObserver(([en]) => { heroOut = !en.isIntersecting; sync(); }).observe($('#hero'));
        new IntersectionObserver(([en]) => { contactIn = en.isIntersecting; sync(); }, { threshold: 0.05 }).observe($('#contact'));
        new IntersectionObserver(([en]) => { branchesIn = en.isIntersecting; sync(); }, { threshold: 0.3 }).observe($('#branches'));
        const footer = $('.footer');
        new IntersectionObserver(([en]) => { if (en.isIntersecting) el.classList.remove('show'); else sync(); }).observe(footer);
    }
})();
