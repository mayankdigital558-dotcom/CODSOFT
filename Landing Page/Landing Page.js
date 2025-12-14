// Function to handle the intersection of elements
const handleIntersection = (entries, observer) => {
    entries.forEach(entry => {
        // Check if the element is in the viewport
        if (entry.isIntersecting) {
            // Add the class that triggers the CSS animation
            entry.target.classList.add('is-visible'); 
            // Stop observing once it's visible to save performance
            observer.unobserve(entry.target);
        }
    });
};

// Set up the Intersection Observer
const observerOptions = {
    root: null, // relative to the viewport
    rootMargin: '0px',
    threshold: 0.1 // 10% of the element must be visible
};

const observer = new IntersectionObserver(handleIntersection, observerOptions);

// Select all elements we want to animate on scroll
const featureCards = document.querySelectorAll('.feature-card');

featureCards.forEach(card => {
    // We remove the initial animation class defined in the HTML
    // to prevent the animation from firing before the Intersection Observer starts.
    card.classList.remove('slide-in-left'); 
    
    // Start observing the card
    observer.observe(card);
});