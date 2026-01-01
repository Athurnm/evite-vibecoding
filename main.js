import './style.css'

document.addEventListener('DOMContentLoaded', () => {
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
    const openBtn = document.getElementById('open-btn');
    const cover = document.getElementById('cover');
    const mainContent = document.getElementById('main-content');
    const bgMusic = new Audio(); // Placeholder

    openBtn.addEventListener('click', () => {
        cover.classList.add('hide');
        mainContent.classList.remove('hidden');
        setTimeout(() => {
            // setupIntersectionObserver(); // Removed: Observer is now initialized directly
            loadWishes(); // Load wishes when opened
        }, 100);
    });

    // 5. Story Content
    const storyContainer = document.getElementById('story-container');
    const storyData = [
        {
            title: "The Spark",
            subtitle: "One in a Million",
            date: "Dec 2023",
            desc: "It all started at the TWICE concert. Nervous first impressions turned into excitement amidst the music and lights. We didn't know it yet, but this was literally the prologue"
        },
        {
            title: "The Reconnection",
            subtitle: "Jumping into Love",
            date: "Aug 2024",
            desc: "After some time, we reconnected at Jakarta. We bounced around (pun intended) and realized we wanted to know more about each other"
        },
        {
            title: "The Deep Dive",
            subtitle: "Catching Feelings",
            date: "Oct 2024 - Sep 2025",
            desc: "October was our month. From deep talks to getting emotional over movies, we showed our true colors. Vulnerability became our strength."
        },
        {
            title: "The Commitment",
            subtitle: "Khitbah Day",
            date: "Dec 2025",
            desc: "The families met, the question was popped (officially), and we bridged our two worlds together. A mix of nerves and pure joy as we locked in our future"
        },
        {
            title: "The Beginning",
            subtitle: "The Wedding Day",
            date: "Mar 2026",
            desc: "And here we are. Ready to start our biggest adventure yet"
        }
    ];

    storyData.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.classList.add('timeline-item');
        itemEl.classList.add('fade-in');
        itemEl.style.transitionDelay = `${index * 0.2}s`;

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
    });

    // 6. Add to Calendar Logic
    const calendarBtn = document.getElementById('add-to-calendar');
    calendarBtn.addEventListener('click', () => {
        const timeStart = eventType === 'akad' ? '010000Z' : '040000Z'; // 08:00 WIB (01 UTC) or 11:00 WIB (04 UTC)
        const timeEnd = '070000Z'; // 14:00 WIB
        const eventDate = `20260328T${timeStart}/20260328T${timeEnd}`;

        const title = encodeURIComponent("The Wedding of Athur & Dara");
        const details = encodeURIComponent("Join us in celebrating our wedding!");
        const location = encodeURIComponent("Steikhaus, Bandung");

        const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${eventDate}&details=${details}&location=${location}`;
        window.open(gcalUrl, '_blank');
    });

    // 7. Backend Integration: RSVP Submit
    const rsvpForm = document.getElementById('rsvp-form');

    rsvpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(rsvpForm);
        const data = Object.fromEntries(formData.entries());
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
                // Success: Replace form with Thank You message
                rsvpForm.innerHTML = `
                    <div class="thank-you-message text-center fade-in visible">
                        <h3>Thank You!</h3>
                        <p>Your RSVP has been confirmed.</p>
                        <p>We look forward to seeing you!</p>
                    </div>
                `;
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
