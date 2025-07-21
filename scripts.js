
// Hamburger menu toggle
document.querySelector('.nav-toggle').addEventListener('click', () => {
    document.querySelector('.nav-menu').classList.toggle('active');
});

// Contact form submission (basic example)
document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    console.log('Form submitted:', { name, email, message });
    alert('Message sent! (This is a demo, no actual submission occurred.)');
    e.target.reset();
});
