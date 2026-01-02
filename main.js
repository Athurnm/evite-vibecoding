import './style.css'
import { translations } from './translations.js';

document.addEventListener('DOMContentLoaded', () => {
    // Language Toggle Logic
    const langBtns = document.querySelectorAll('.lang-btn');
    let currentLang = 'en'; // Default

    function updateLanguage(lang) {
        currentLang = lang;
        const t = translations[lang];

        // Update active button state
        langBtns.forEach(btn => {
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update Text Content
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (t[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    if (key.startsWith('placeholder_')) {
                        el.placeholder = t[key];
                    }
                } else if (el.tagName === 'OPTION') {
                    el.textContent = t[key];
                } else {
                    el.innerHTML = t[key];
                }
            }
        });

        // Update placeholders specifically if keys differ
        const wishesTextarea = document.getElementById('wishes');
        if (wishesTextarea && t.placeholder_wishes) {
            wishesTextarea.placeholder = t.placeholder_wishes;
        }

        // Re-render Story
        if (t.story) {
            renderStory(t.story);
        }

        // Re-render Akad Time Logic
        updateAkadTime(t);
    }

    function renderStory(storyData) {
        const storyContainer = document.getElementById('story-container');
        if (!storyContainer) return;

        storyContainer.innerHTML = ''; // Clear existing

        storyData.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.classList.add('timeline-item');
            itemEl.classList.add('fade-in');

            itemEl.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <span class="timeline-date">${item.date}</span>
                    <h3>${item.title}</h3>
                    <h4 class="timeline-subtitle">"${item.subtitle}"</h4>
                    <p>${item.desc}</p>
                </div>
            `;
            storyContainer.appendChild(itemEl);

            setTimeout(() => {
                itemEl.classList.add('visible');
            }, 100 + (index * 200));
        });
    }

    // Extracted Time Variant Logic to update on language switch
    function updateAkadTime(t) {
        const eventType = params.get('type') || 'resepsi';
        const akadTimeElement = document.getElementById('akad-time');

        if (akadTimeElement) {
            if (eventType === 'akad') {
                akadTimeElement.textContent = t ? t.akad_time_default : "08:00 - 10:00 WIB";
            } else {
                akadTimeElement.textContent = t ? t.akad_time_resepsi : "Done in the morning";
            }
        }
    }

    // Initialize listeners
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            updateLanguage(lang);
        });
    });


    const params = new URLSearchParams(window.location.search);

    // 1. Guest Name Logic & Pre-fill
    const guestName = params.get('guest') || params.get('to');
    const guestNameElement = document.getElementById('guest-name');
    const nameInput = document.getElementById('name');

    if (guestName) {
        const decodedName = decodeURIComponent(guestName);
        guestNameElement.textContent = decodedName;
        if (nameInput) nameInput.value = decodedName; // Pre-fill RSVP
    } else {
        guestNameElement.textContent = "Bapak/Ibu/Saudara/i";
    }

    // 2. Time Variant Logic
    const eventType = params.get('type') || 'resepsi'; // Default to resepsi
    const akadTimeElement = document.getElementById('akad-time');

    if (akadTimeElement) {
        if (eventType === 'akad') {
            akadTimeElement.textContent = "08:00 - 10:00 WIB";
        } else {
            // Resepsi (Default)
            akadTimeElement.textContent = "Done in the morning";
            // Optional: You could hide the entire Akad block if desired
            // document.querySelector('.event-block:first-child').style.display = 'none';
        }
    }

    // 3. Open Invitation Logic
    const openBtn = document.getElementById('open-invitation');
    const cover = document.getElementById('cover');
    const mainContent = document.getElementById('main-content');

    // Initialize Language (Default EN) which also renders story and time
    updateLanguage('en');


    openBtn.addEventListener('click', () => {
        cover.classList.add('hide');
        mainContent.classList.remove('hidden');
        setTimeout(() => {
            // setupIntersectionObserver(); // Removed: Observer is now initialized directly
            loadWishes(); // Load wishes when opened
        }, 100);
    });

    // 5. Story Content
    // Initial render is handled by updateLanguage('en') call below or manual init
    // Removing static storyData


    // 6. Add to Calendar Logic
    const calendarBtn = document.getElementById('add-to-calendar');
    calendarBtn.addEventListener('click', () => {
        // 11:00 WIB = 04:00 UTC
        // 13:00 WIB = 06:00 UTC
        const timeStart = '040000Z';
        const timeEnd = '060000Z';
        const eventDate = `20260328T${timeStart}/20260328T${timeEnd}`;

        const title = encodeURIComponent("The Wedding of Athur & Dara");
        const details = encodeURIComponent("Join us in celebrating our wedding!");
        const location = encodeURIComponent("Steikhaus, Bandung");

        const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${eventDate}&details=${details}&location=${location}`;
        window.open(gcalUrl, '_blank');
    });

    // 7. Backend Integration: RSVP Submit
    const rsvpForm = document.getElementById('rsvp-form');

    // Populate Guests Dropdowns with URL Logic
    const adultSelect = document.getElementById('adults');
    const childSelect = document.getElementById('children');

    function populateDropdown(selectElement, maxOption, paramName, allowZero = false) {
        const paramValue = params.get(paramName);
        selectElement.innerHTML = ''; // Clear existing

        let start = allowZero ? 0 : 1;
        let end = maxOption;

        // If URL param exists, restrict options (act as MAX limit)
        if (paramValue !== null) {
            const val = parseInt(paramValue);
            if (!isNaN(val)) {
                // User requirement: param acts as MAX option
                // start remains as default (1 for adult, 0 for child), end becomes val
                end = val;
            }
        }

        for (let i = start; i <= end; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            selectElement.appendChild(option);
        }
    }

    // Defaults: Adults 1-8, Children 0-4
    // If param exists, it overrides strict range
    populateDropdown(adultSelect, 8, 'adult', false);
    populateDropdown(childSelect, 4, 'children', true);


    rsvpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(rsvpForm);
        // Combine adults + children into total guests string or number for DB
        // The DB has 'guests' column. We can save "X Adults, Y Children" or just total.
        // Let's save total number for simplicity in existing column, 
        // OR extend schema? User didn't ask for schema change. 
        // Let's store total int, but maybe append details to 'wishes' or just assume 'guests' = total.
        // Actually, let's keep 'guests' as total count for now to avoid breaking DB schema.

        const adults = parseInt(formData.get('adults'));
        const children = parseInt(formData.get('children'));
        const totalGuests = adults + children;

        const data = {
            name: formData.get('name'),
            guests: totalGuests, // Saving total count as well
            adults: adults,
            children: children,
            attendance: formData.get('attendance'),
            wishes: formData.get('wishes')
        };

        const submitBtn = rsvpForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        try {
            const response = await fetch('/api/rsvp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Success: Toggle visibility
                rsvpForm.classList.add('hidden');
                const successMsg = document.getElementById('rsvp-success');
                successMsg.classList.remove('hidden');
                successMsg.classList.add('fade-in', 'visible');

                loadWishes(); // Refresh wishes
            } else {
                throw new Error('Failed to submit');
            }
        } catch (error) {
            alert('There was an error submitting your RSVP. Please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    // 8. Backend Integration: Wishes Carousel
    let wishes = [];
    let currentWishIndex = 0;
    let wishInterval;

    async function loadWishes() {
        try {
            const res = await fetch('/api/wishes');
            if (res.ok) {
                wishes = await res.json();
                if (wishes.length > 0) {
                    document.getElementById('wishes-section').classList.remove('hidden-initially');
                    renderWish(0);
                    startWishCarousel();
                }
            }
        } catch (e) {
            console.error("Failed to load wishes", e);
        }
    }

    function renderWish(index) {
        if (wishes.length === 0) return;

        const wishDisplay = document.getElementById('wish-display');
        const wish = wishes[index];

        // Simple fade effect
        wishDisplay.style.opacity = 0;
        setTimeout(() => {
            wishDisplay.innerHTML = `
                <p class="wish-text">"${wish.wishes}"</p>
                <span class="wish-author">- ${wish.name}</span>
            `;
            wishDisplay.style.opacity = 1;
        }, 300);

        currentWishIndex = index;
    }

    function startWishCarousel() {
        if (wishInterval) clearInterval(wishInterval);
        wishInterval = setInterval(() => {
            const nextIndex = (currentWishIndex + 1) % wishes.length;
            renderWish(nextIndex);
        }, 10000); // 10 seconds
    }

    document.getElementById('prev-wish').addEventListener('click', (e) => {
        e.preventDefault(); // Prevent form submit if inside form (though it's outside)
        if (wishInterval) clearInterval(wishInterval);
        const prevIndex = (currentWishIndex - 1 + wishes.length) % wishes.length;
        renderWish(prevIndex);
        startWishCarousel(); // Restart timer
    });

    document.getElementById('next-wish').addEventListener('click', (e) => {
        e.preventDefault();
        if (wishInterval) clearInterval(wishInterval);
        const nextIndex = (currentWishIndex + 1) % wishes.length;
        renderWish(nextIndex);
        startWishCarousel(); // Restart timer
    });
    // 9. Intersection Observer for Fade-in
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // 10. Vine Scroll Animation
    const eventSection = document.getElementById('event-details');
    const vineImg = document.getElementById('scroll-vine');

    if (eventSection && vineImg) {
        window.addEventListener('scroll', () => {
            const rect = eventSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const sectionHeight = rect.height;
            const scrollPosition = windowHeight - rect.top;

            // Calculate progress: 0% when entering, 100% when fully traversed
            // Adjusted formula for better visual timing
            let percentage = (scrollPosition / (sectionHeight + (windowHeight * 0.2))) * 100;
            percentage = Math.max(0, Math.min(100, percentage));

            vineImg.style.height = `${percentage}%`;
        });
    }
});
