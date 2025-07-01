document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.presentation-container');
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.getElementById('prev-slide');
    const nextButton = document.getElementById('next-slide');
    let currentSlide = 0;

    const nativeWidth = 1280;
    const nativeHeight = 720;

    function scalePresentation() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const scale = Math.min(
            viewportWidth / nativeWidth,
            viewportHeight / nativeHeight
        );
        container.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }

    function updateNavButtons() {
        prevButton.classList.toggle('hidden', currentSlide === 0);
        nextButton.classList.toggle('hidden', currentSlide === slides.length - 1);
    }

    function showSlide(index) {
        if (index < 0 || index >= slides.length) {
            return;
        }
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
        currentSlide = index;
        updateNavButtons();
    }

    function nextSlide() {
        if (currentSlide < slides.length - 1) {
            showSlide(currentSlide + 1);
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            showSlide(currentSlide - 1);
        }
    }

    // Initial setup
    showSlide(currentSlide);
    scalePresentation();

    // Event Listeners
    window.addEventListener('resize', scalePresentation);

    // Button navigation
    prevButton.addEventListener('click', (e) => {
        e.stopPropagation();
        prevSlide();
    });
    nextButton.addEventListener('click', (e) => {
        e.stopPropagation();
        nextSlide();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        }
    });

    // Click navigation (body)
    document.body.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a, button')) {
            return;
        }
        nextSlide();
    });
}); 