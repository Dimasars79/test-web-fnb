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
    const updateStatus = () => {
        const now = new Date();
        const hour = now.getHours();
        // Assuming open from 17:00 to 24:00 (00:00)
        if (hour >= 17 || hour === 0) {
            liveStatus.textContent = 'OPEN TONIGHT • 17:00 – 00:00 WIB';
        } else {
            liveStatus.textContent = 'CLOSED • OPENS AT 17:00 WIB';
        }
    };
    updateStatus();
    setInterval(updateStatus, 60000); // Check every minute

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
    let isPlaying = false;
    
    // Create a synthesized ambient noise just for effect
    let audioCtx;
    let oscillator;
    let gainNode;

    const playAmbientNoise = () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const bufferSize = audioCtx.sampleRate * 2; // 2 seconds of noise
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Brown noise generation for a warm cafe hum
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            let white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5; // (roughly) compensate for gain
        }
        
        oscillator = audioCtx.createBufferSource();
        oscillator.buffer = buffer;
        oscillator.loop = true;
        
        // Apply lowpass filter
        let filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400; // Muffled, warm sound
        
        gainNode = audioCtx.createGain();
        gainNode.gain.value = 0.05; // Very subtle volume
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
    };

    const stopAmbientNoise = () => {
        if (oscillator) {
            oscillator.stop();
            oscillator.disconnect();
        }
    };

    soundToggle.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
            soundIcon.textContent = '🔊';
            soundToggle.classList.add('btn-primary');
            soundToggle.classList.remove('btn-outline');
            playAmbientNoise();
        } else {
            soundIcon.textContent = '🔈';
            soundToggle.classList.remove('btn-primary');
            soundToggle.classList.add('btn-outline');
            stopAmbientNoise();
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
