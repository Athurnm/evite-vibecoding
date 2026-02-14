import './style.css'
import { translations } from './translations.js';
import posthog from 'posthog-js';

// Initialize PostHog
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST;

if (POSTHOG_KEY) {
    posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST || 'https://us.i.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: true
    });
    posthog.register({ product: 'evite-athur' });
}

document.addEventListener('DOMContentLoaded', () => {
    // Language Toggle Logic
    const langBtns = document.querySelectorAll('.lang-btn');
    let currentLang = 'id'; // Default

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
        if (nameInput) {
            nameInput.value = decodedName; // Pre-fill RSVP
            nameInput.disabled = true; // Disable if provided via URL
        }
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

    // Initialize Language (Default ID) which also renders story and time
    updateLanguage('id');


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
        // 11:00 WIB = 04:00 UTC (Resepsi)
        // 08:00 WIB = 01:00 UTC (Akad)
        // 13:00 WIB = 06:00 UTC (End)

        const params = new URLSearchParams(window.location.search);
        const eventType = params.get('type');

        let timeStart = '040000Z'; // Default 11:00 WIB
        if (eventType === 'akad') {
            timeStart = '010000Z'; // 08:00 WIB
        }

        const timeEnd = '060000Z'; // Always 13:00 WIB
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

    // Defaults: Adults 1-2, Children 0-0
    // If param exists, it overrides strict range
    populateDropdown(adultSelect, 2, 'adult', false);
    populateDropdown(childSelect, 0, 'children', true);


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

        // Handle disabled name input: if disabled, formData won't have it, so grab from DOM
        let nameVal = formData.get('name');
        if (!nameVal) {
            nameVal = document.getElementById('name').value;
        }

        const data = {
            name: nameVal,
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

                // Track RSVP
                if (data.name) {
                    posthog.identify(data.name);
                }
                posthog.capture('rsvp_submitted', {
                    attendance: formData.get('attendance'),
                    guests: totalGuests,
                    adults: adults,
                    children: children
                });
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


    // 11. Music Control
    const music = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-toggle');
    if (music && musicBtn) {
        const iconPlay = musicBtn.querySelector('.icon-play');
        const iconMute = musicBtn.querySelector('.icon-mute');
        let isPlaying = false;

        function toggleIcons(playing) {
            if (playing) {
                iconPlay.classList.remove('hidden');
                iconMute.classList.add('hidden');
            } else {
                iconPlay.classList.add('hidden');
                iconMute.classList.remove('hidden');
            }
        }

        function playMusic() {
            music.play().then(() => {
                isPlaying = true;
                toggleIcons(true);
            }).catch((error) => {
                console.log("Auto-play prevented (User must interact first):", error);
                isPlaying = false;
                toggleIcons(false);
            });
        }

        // Attempt Play
        playMusic();

        // Toggle
        musicBtn.addEventListener('click', () => {
            if (isPlaying) {
                music.pause();
                isPlaying = false;
                toggleIcons(false);
            } else {
                playMusic();
            }
        });

        // Fallback Auto-play on first click (if blocked)
        const unlockAudio = () => {
            if (!isPlaying) {
                playMusic();
            }
            document.body.removeEventListener('click', unlockAudio);
        };
        document.body.addEventListener('click', unlockAudio);
    }

    // ---------------------------------------------------------
    // NEW: Persistent State Logic (RSVP & Registry)
    // ---------------------------------------------------------
    async function initializeState() {
        const guestNameVal = params.get('guest') || params.get('to');
        if (!guestNameVal) return;

        try {
            const res = await fetch(`/api/state?name=${guestNameVal}`);
            if (res.ok) {
                const state = await res.json();

                // 1. Restore RSVP State
                if (state.rsvp) {
                    const rsvp = state.rsvp;
                    // Pre-fill fields
                    if (document.getElementById('name')) document.getElementById('name').value = rsvp.name;
                    if (document.getElementById('attendance')) document.getElementById('attendance').value = rsvp.attendance;
                    if (document.getElementById('wishes')) document.getElementById('wishes').value = rsvp.wishes;

                    // Handle dropdowns (adults/children)
                    // We might need to ensure options exist first, but populateDropdown is called locally.
                    // If stored value > current max, it might be an issue, but usually it's fine.
                    if (document.getElementById('adults')) document.getElementById('adults').value = rsvp.adults;
                    if (document.getElementById('children')) document.getElementById('children').value = rsvp.children;

                    // Update UI to show "Update" mode
                    const rsvpBtn = document.querySelector('#rsvp-form button[type="submit"]');
                    if (rsvpBtn) rsvpBtn.textContent = 'Update RSVP';
                }

                // 2. Restore Registry State
                if (state.registry && state.registry.item_name) {
                    const itemName = state.registry.item_name;

                    // User Request: Show Thank You message directly instead of "Change Selection"
                    const giftForm = document.getElementById('gift-form');
                    const successMsg = document.getElementById('gift-success');

                    if (giftForm && successMsg) {
                        giftForm.classList.add('hidden');
                        successMsg.classList.remove('hidden');

                        // Optional: Update success message to mention item?
                        // successMsg.querySelector('p').textContent = `You have selected: ${itemName}. Thank you!`;

                        // Attempt to resolve link (best effort)
                        // logic relies on loadGifts having populated options, which might race.
                        // But we can try to fetch registry again or just accept link might be missing on reload.
                    }
                }
            }
        } catch (e) {
            console.error("Error fetching state:", e);
        }
    }

    // Call it
    initializeState();

    // 12. Gift Registry Logic
    const registryTabs = document.querySelectorAll('.tab-btn');
    const registryPanes = document.querySelectorAll('.tab-pane');

    registryTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            // Deactivate all
            registryTabs.forEach(b => b.classList.remove('active'));
            registryPanes.forEach(p => p.classList.add('hidden'));
            registryPanes.forEach(p => p.classList.remove('active'));

            // Activate clicked
            btn.classList.add('active');
            const targetId = btn.dataset.tab;
            const targetPane = document.getElementById(targetId);
            targetPane.classList.remove('hidden');
            setTimeout(() => targetPane.classList.add('active'), 50); // slight delay for fade

            // Track Registry View
            posthog.capture('registry_viewed', { tab: targetId });
        });
    });

    const giftItemSelect = document.getElementById('gift-item');
    const otherGiftContainer = document.getElementById('other-gift-container');
    const otherGiftInput = document.getElementById('gift-custom-name');

    if (giftItemSelect) {
        giftItemSelect.addEventListener('change', () => {
            if (giftItemSelect.value === 'other') {
                otherGiftContainer.classList.remove('hidden');
                otherGiftInput.setAttribute('required', 'true');
            } else {
                otherGiftContainer.classList.add('hidden');
                otherGiftInput.removeAttribute('required');
            }
        });

        // Load Gifts from API
        loadGifts();

        // 13. Auto-fill "From" in Gift Registry
        // Using existing `guestName` variable which is decoded from URL
        // However, `guestName` might be "Bapak/Ibu..." default if not found.
        // We only pre-fill if it's a specific name.
        const giftSenderInput = document.getElementById('gift-sender');
        const rawName = params.get('guest') || params.get('to');
        if (giftSenderInput && rawName) {
            giftSenderInput.value = decodeURIComponent(rawName);
        }
    }

    async function loadGifts() {
        const select = document.getElementById('gift-item');
        if (!select) return;

        const currentVal = select.value;

        try {
            const res = await fetch('/api/registry');
            if (res.ok) {
                const gifts = await res.json();

                // OPTIMIZATION: Check if data changed to avoid UI flickering/reset
                // Get current option values (excluding placeholder and other)
                const currentOptions = Array.from(select.options)
                    .filter(opt => opt.value && opt.value !== 'other')
                    .map(opt => ({ item: opt.value, link: opt.dataset.link }));

                // Compare lengths
                const changed = gifts.length !== currentOptions.length ||
                    gifts.some((g, i) => g.item !== currentOptions[i].item || g.link !== currentOptions[i].link);

                if (!changed) {
                    // Data matches, do nothing to preserve UI state
                    return;
                }

                // Data changed, rebuild
                select.innerHTML = '<option value="" disabled selected data-i18n="select_gift_placeholder">Select a gift...</option>';

                gifts.forEach(g => {
                    const option = document.createElement('option');
                    option.value = g.item;
                    option.textContent = g.item;
                    if (g.link) {
                        option.dataset.link = g.link;
                    }
                    select.appendChild(option);
                });

                // Add "Other" option
                const otherOption = document.createElement('option');
                otherOption.value = 'other';
                otherOption.textContent = "Other (I'll choose my own...)";
                otherOption.setAttribute('data-i18n', 'option_other');
                select.appendChild(otherOption);

                // Restore selection if valid
                if (currentVal && currentVal !== 'other') {
                    // Check if the previously selected item still exists in the new list
                    const exists = gifts.some(g => g.item === currentVal);
                    if (exists) {
                        select.value = currentVal;
                    }
                } else if (currentVal === 'other') {
                    select.value = 'other';
                }

                // Update translations
                if (typeof updateLanguage === 'function') {
                    updateLanguage(currentLang);
                }

            }
        } catch (error) {
            console.error('Failed to load gifts:', error);
        }
    }

    // Load initially
    loadGifts();

    // Fetch on mousedown (when user clicks to open dropdown)
    if (giftItemSelect) {
        giftItemSelect.addEventListener('mousedown', () => {
            loadGifts();
        });
    }


    const giftForm = document.getElementById('gift-form');
    if (giftForm) {
        giftForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = giftForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(giftForm);
            let selectedItem = formData.get('item');

            // Check if 'other' is selected, then use 'custom_item' input
            if (selectedItem === 'other') {
                const customVal = formData.get('custom_item');
                selectedItem = customVal ? customVal.trim() : '';
            }
            const sender = formData.get('sender');

            // Client-side validation guard
            if (!selectedItem || !sender) {
                alert('Please fill in all required fields.');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
            }

            try {
                const res = await fetch('/api/registry', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ item: selectedItem, sender })
                });

                if (res.ok) {
                    giftForm.classList.add('hidden');
                    document.getElementById('gift-success').classList.remove('hidden');

                    // Handle Product Link Recommendation
                    const productLinkArea = document.getElementById('gift-product-recommendation');
                    const productLinkBtn = document.getElementById('gift-product-link');

                    // Get selected option from the dropdown
                    const selectElement = document.getElementById('gift-item');
                    const selectedOption = selectElement.options[selectElement.selectedIndex];

                    // Track Gift
                    posthog.capture('registry_submitted', {
                        item: selectedItem,
                        type: selectedOption?.dataset?.link ? 'product_link' : 'custom_cash'
                    });

                    if (selectedOption && selectedOption.dataset.link) {
                        productLinkArea.classList.remove('hidden');
                        productLinkBtn.href = selectedOption.dataset.link;
                    } else {
                        productLinkArea.classList.add('hidden');
                    }

                } else {
                    throw new Error('Failed');
                }
            } catch (err) {
                alert('Failed to send gift. Please try again.');
                console.error(err);
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Copy Bank Account
    // Copy Bank Account
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetNumber = btn.dataset.target;
            if (targetNumber) {
                navigator.clipboard.writeText(targetNumber).then(() => {
                    const original = btn.textContent;
                    btn.textContent = 'Copied!';
                    setTimeout(() => btn.textContent = original, 2000);
                });
            }
        });
    });

    // Share to WA
    const shareWaBtn = document.getElementById('share-transfer');
    if (shareWaBtn) {
        shareWaBtn.addEventListener('click', () => {
            // REPLACE WITH BRIDE'S NUMBER
            const phone = "6285721348085";

            const message = encodeURIComponent("Halo Dara!\nSaya sudah kirim hadiah untuk pernikahan Athur & Dara. Berikut buktinya:");
            window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
        });
    }
});
