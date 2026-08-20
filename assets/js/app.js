document.addEventListener('DOMContentLoaded', () => {
    
    // --- Header Scroll Effect ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const closeMobileBtn = document.getElementById('close-mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // Show mobile button only on small screens
    const checkMobile = () => {
        if (window.innerWidth <= 768) {
            mobileBtn.style.display = 'block';
        } else {
            mobileBtn.style.display = 'none';
            mobileDrawer.classList.remove('active');
        }
    };
    window.addEventListener('resize', checkMobile);
    checkMobile();

    mobileBtn.addEventListener('click', () => {
        mobileDrawer.classList.add('active');
    });

    closeMobileBtn.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileDrawer.classList.remove('active');
        });
    });

    // --- Live Status Pill ---
    const liveStatus = document.getElementById('live-status');
    const statusDot = document.querySelector('.status-dot');
    const statusPillBtn = document.getElementById('status-pill-btn');
    
    const updateStatus = () => {
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay(); // 0 is Sunday, 6 is Saturday
        
        let isOpen = false;
        let scheduleText = '';

        // Weekday (Mon-Fri)
        if (day >= 1 && day <= 5) {
            if (hour >= 12 && hour < 22) isOpen = true;
            scheduleText = '12:00 – 22:00 WIB';
        } else {
            // Weekend (Sat-Sun)
            if (hour >= 15 && hour < 24) isOpen = true;
            scheduleText = '15:00 – 00:00 WIB';
        }

        if (isOpen) {
            liveStatus.textContent = `OPEN • ${scheduleText}`;
            statusDot.style.backgroundColor = 'var(--accent-terracotta)';
        } else {
            liveStatus.textContent = `CLOSED • OPENS AT ${day >= 1 && day <= 5 ? '12:00' : '15:00'}`;
            statusDot.style.backgroundColor = 'var(--text-muted)';
        }
    };
    
    updateStatus();
    setInterval(updateStatus, 60000); // Check every minute

    const hoursModal = document.getElementById('hours-modal');
    const closeHoursModal = document.getElementById('close-hours-modal');

    if (statusPillBtn && hoursModal) {
        statusPillBtn.addEventListener('click', (e) => {
            e.preventDefault();
            hoursModal.classList.add('active');
        });
        
        closeHoursModal.addEventListener('click', () => {
            hoursModal.classList.remove('active');
        });

        hoursModal.addEventListener('click', (e) => {
            if (e.target === hoursModal) {
                hoursModal.classList.remove('active');
            }
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Trigger reveal for elements already in viewport on load
    setTimeout(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if(rect.top < window.innerHeight) {
                el.classList.add('active');
            }
        });
    }, 100);

    // --- Menu Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            menuCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    // Slight delay for animation re-trigger if needed
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        });
    });

    // --- Full Menu Modal ---
    const viewFullMenuBtn = document.getElementById('view-full-menu');
    const fullMenuModal = document.getElementById('full-menu-modal');
    const closeMenuModalBtn = document.getElementById('close-menu-modal');

    viewFullMenuBtn.addEventListener('click', () => {
        fullMenuModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });

    closeMenuModalBtn.addEventListener('click', () => {
        fullMenuModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close modal on outside click
    fullMenuModal.addEventListener('click', (e) => {
        if (e.target === fullMenuModal) {
            fullMenuModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });


    // --- Atmosphere Gallery Tabs ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const galleryPanes = document.querySelectorAll('.gallery-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active state
            tabBtns.forEach(b => b.classList.remove('active'));
            galleryPanes.forEach(p => p.classList.remove('active'));

            // Add active state
            btn.classList.add('active');
            const targetId = `spot-${btn.getAttribute('data-spot')}`;
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- Ambient Sound Toggle (Simulated) ---
    // Note: Due to browser auto-play policies, actual audio needs user interaction first.
    // For this demo, we'll just toggle UI states.
    const soundToggle = document.getElementById('sound-toggle');
    const soundIcon = document.getElementById('sound-icon');
    const visualizerDot = document.getElementById('visualizer-dot');
    let isPlaying = false;
    let visualizerTimer;
    
    const animateVisualizer = () => {
        if (!isPlaying) {
            if (visualizerDot) visualizerDot.style.setProperty('--v-scale', 1);
            return;
        }
        
        if (visualizerDot) {
            const scale = 1 + (Math.random() * 1.5);
            visualizerDot.style.setProperty('--v-scale', scale);
        }
        
        visualizerTimer = setTimeout(() => {
            requestAnimationFrame(animateVisualizer);
        }, 80);
    };
    
    // Load the user's ambient sound file
    const ambientAudio = new Audio('assets/sound/New York City Ambience Sound Effect.mp3');
    ambientAudio.loop = true;
    ambientAudio.volume = 0.5; // adjust volume as needed

    const playAmbientNoise = () => {
        ambientAudio.play().catch(e => console.error("Audio play failed:", e));
    };

    const stopAmbientNoise = () => {
        ambientAudio.pause();
    };

    soundToggle.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
            soundIcon.textContent = '🔊';
            soundToggle.classList.add('btn-primary');
            soundToggle.classList.remove('btn-outline');
            playAmbientNoise();
            animateVisualizer();
        } else {
            soundIcon.textContent = '🔈';
            soundToggle.classList.remove('btn-primary');
            soundToggle.classList.add('btn-outline');
            stopAmbientNoise();
            clearTimeout(visualizerTimer);
            if (visualizerDot) visualizerDot.style.setProperty('--v-scale', 1);
        }
    });

    // --- Back to Top ---
    const backToTopBtn = document.getElementById('back-to-top');
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
