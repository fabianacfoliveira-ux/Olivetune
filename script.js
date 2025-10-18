// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Booking form handling
const bookingForm = document.getElementById('bookingForm');
const formMessage = document.getElementById('formMessage');

bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        type: document.getElementById('type').value,
        date: document.getElementById('date').value,
        message: document.getElementById('message').value
    };

        try {
            // Send data to server
            const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            // Success
            formMessage.textContent = 'Booking received successfully! We will get in touch soon.';
            formMessage.classList.remove('error');
            formMessage.classList.add('success');
            
            // Clear form
            bookingForm.reset();
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.classList.remove('success');
            }, 5000);
        } else {
            // Error
            formMessage.textContent = 'An error occurred while processing your booking. Please try again.';
            formMessage.classList.remove('success');
            formMessage.classList.add('error');
        }
    } catch (error) {
        console.error('Error:', error);
        formMessage.textContent = 'Connection error. Please try again later.';
        formMessage.classList.remove('success');
        formMessage.classList.add('error');
    }
});

// Date validation (prevent past dates)
const dateInput = document.getElementById('date');
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);

// Entry animation for cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply observer to cards
document.querySelectorAll('.service-card, .testimonial-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

