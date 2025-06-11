$(document).ready(function() {

    const heroVideo = $('#hero-video')[0]; // Get the native DOM element for video methods
    const playPauseButton = $('#play-pause-video');
    const playPauseIcon = playPauseButton.find('i'); // Get the icon element

    // Initially, video is set to autoplay and muted in HTML.
    // The button already shows the pause icon.

    playPauseButton.on('click', function() {
        if (heroVideo.paused) {
            heroVideo.play();
            heroVideo.muted = false; // Unmute when playing
            playPauseIcon.removeClass('fa-play').addClass('fa-pause'); // Change to pause icon
        } else {
            heroVideo.pause();
            heroVideo.muted = true; // Mute when paused
            playPauseIcon.removeClass('fa-pause').addClass('fa-play'); // Change to play icon
        }
    });

    // Optional: Add a listener for when the video actually plays/pauses (e.g., if user uses native controls)
    heroVideo.addEventListener('play', function() {
        playPauseIcon.removeClass('fa-play').addClass('fa-pause');
        // If you want it to unmute only on button click, don't set muted here
    });

    heroVideo.addEventListener('pause', function() {
        playPauseIcon.removeClass('fa-pause').addClass('fa-play');
        // If you want it to mute only on button click, don't set muted here
    });

    heroVideo.addEventListener('ended', function() {
        playPauseIcon.removeClass('fa-pause').addClass('fa-play');
        heroVideo.muted = true; // Mute it if it ends
    });


    // Function to animate a single number
    function animateNumber(element, start, end, duration, applySuffix = false) { // Added applySuffix parameter
        let current = start;
        const range = end - start;
        const increment = end > start ? 1 : -1;
        // Calculate stepTime, ensuring it's at least 1ms to avoid division by zero if range is 0 or very small
        const stepTime = Math.max(1, Math.abs(Math.floor(duration / range)));

        const timer = setInterval(() => {
            current += increment;
            // Ensure we don't go past the end number
            let displayNum = current;
            let currentSuffix = '';

            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                displayNum = end; // Ensure the final displayed number is the exact end
                if (applySuffix) { // Only add suffix at the very end if applySuffix is true
                    currentSuffix = '+';
                }
                clearInterval(timer); // Stop the animation
            }

            $(element).text(displayNum + currentSuffix);
        }, stepTime);
    }

    // Initialize numbers to 0 and set up Waypoints
    $('.tm-stat-value').each(function() {
        $(this).text('0'); // Ensure they start at 0
    });

    // Use Waypoints to trigger animation when the section is in view
    $('#numbers-speak').waypoint(function(direction) {
        if (direction === 'down') { // Only animate when scrolling down into view
            $('.tm-stat-item').each(function(index) {
                const $valueDiv = $(this).find('.tm-stat-value');
                const targetNumber = parseInt($valueDiv.data('target'));
                let needsSuffix = true; // Flag to indicate if this number should eventually have a '+'

                // Updated logic for which numbers get the '+'
                if (targetNumber === 20 || targetNumber === 250) {
                    needsSuffix = true;
                }

                // Add a small delay for each item for a nicer effect
                setTimeout(() => {
                    animateNumber($valueDiv, 0, targetNumber, 3500, needsSuffix); // Pass needsSuffix
                }, index * 200); // 200ms delay between each item
            });
            // Destroy the waypoint after it fires once to prevent re-animation on scroll up/down
            this.destroy();
        }
    }, {
        offset: '95%' // Trigger when 80% of the section is visible from the top of the viewport
    });


    console.log("jQuery document ready! main.js is running."); // Add this for initial check

    const contactForm = $('#contact-form');
    const successModal = $('#success-modal');
    const closeModalButton = $('#close-modal-button');

    // Add console logs to verify elements are found
    console.log("Contact Form element:", contactForm); // Should show a jQuery object, not [] or null
    console.log("Success Modal element:", successModal); // Should show a jQuery object
    console.log("Close Modal Button element:", closeModalButton); // Should show a jQuery object


    // Handle form submission
    contactForm.on('submit', function(e) {
        console.log("Form submission intercepted!"); // Check if this log appears
        e.preventDefault(); // Prevent the default form submission (page reload)

        // Get the form action URL (your Formspree endpoint)
        const formspreeUrl = contactForm.attr('action');

        // Serialize the form data for AJAX submission
        const formData = new FormData(this); // 'this' refers to the form element

        $.ajax({
            url: formspreeUrl,
            method: 'POST',
            data: formData,
            dataType: 'json', // Expecting JSON response from Formspree
            processData: false, // Don't process the data
            contentType: false, // Don't set content type (FormData handles it)
            success: function(response) {
                // Formspree returns success even on some errors, check 'ok' property
                if (response.ok) {
                    // Show the success modal
                    successModal.css('display', 'flex'); // Use flex to center with CSS

                    // Clear the form fields
                    contactForm[0].reset(); // Use [0] to get the native DOM element for reset()
                } else {
                    // Handle Formspree specific errors (e.g., rate limit, invalid fields)
                    alert('Oops! Ocorreu um erro no envio da mensagem. Por favor, tente novamente mais tarde.');
                    console.error('Formspree Error:', response);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // Handle network errors or other AJAX issues
                alert('Oops! Houve um problema com a conexão. Por favor, tente novamente mais tarde.');
                console.error('AJAX Error:', textStatus, errorThrown, jqXHR);
            }
        });
    });

    closeModalButton.on('click', function() {
        successModal.css('display', 'none');
    });

    $(window).on('click', function(event) {
        if ($(event.target).is(successModal)) {
            successModal.css('display', 'none');
        }
    });

    /* Slick initializations and configurations */

    $('.testimonials-carousel').slick({
        infinite: true,
        slidesToShow: 1, // Show one testimonial at a time
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500, // Change slide every 5 seconds
        arrows: true, // Enable arrows!
        dots: true, // Enable pagination dots
        pauseOnHover: true, // Pause autoplay on hover
        adaptiveHeight: true, // Adjust height based on current slide's content
        responsive: [{
            breakpoint: 768,
            settings: {
                arrows: true, // Maybe no arrows on small screens
                dots: true,
            }
        }]
    });


    // Pop up
    $('.tm-gallery').magnificPopup({
        delegate: 'a',
        type: 'image',
        gallery: {
            enabled: true
        }
    });

    // Get a reference to your carousel element
    var $testimonialsCarousel = $('.testimonials-carousel');

    // Add event listeners for mouseenter (hover in) and mouseleave (hover out)
    $testimonialsCarousel.on('mouseenter', function() {
        $testimonialsCarousel.slick('slickPlay'); // Start automatic sliding
    });

    $testimonialsCarousel.on('mouseleave', function() {
        $testimonialsCarousel.slick('slickPause'); // Pause automatic sliding
    });


    // Gallery
    // Gallery Initialization
    $('.tm-gallery').slick({
        dots: true,
        arrows: true,
        infinite: true,
        autoplay: true, // <-- CHANGE THIS TO TRUE
        autoplaySpeed: 2500, // <-- Adjust speed if 2 seconds feels too fast for videos/text (e.g., 3000-5000ms)
        pauseOnHover: true, // <-- This is the default, but explicitly stating it is clear

        slidesToShow: 3,
        slidesToScroll: 1,

        responsive: [{
            breakpoint: 1199,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 1,
                arrows: true
            }
        }, {
            breakpoint: 991,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                arrows: true
            }
        }, {
            breakpoint: 767,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                arrows: true
            }
        }, {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: true
            }
        }]
    });

});


/* audio button on video player */

document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('impactVideoPlayer');
    const muteToggleButton = document.getElementById('muteToggle');
    const muteIcon = muteToggleButton.querySelector('i'); // Get the icon inside the button

    // Set initial icon based on video state
    if (video.muted) {
        muteIcon.classList.remove('fa-volume-up');
        muteIcon.classList.add('fa-volume-mute');
    } else {
        muteIcon.classList.remove('fa-volume-mute');
        muteIcon.classList.add('fa-volume-up');
    }

    muteToggleButton.addEventListener('click', function() {
        if (video.muted) {
            video.muted = false; // Unmute the video
            muteIcon.classList.remove('fa-volume-mute');
            muteIcon.classList.add('fa-volume-up'); // Change icon to volume up
        } else {
            video.muted = true; // Mute the video
            muteIcon.classList.remove('fa-volume-up');
            muteIcon.classList.add('fa-volume-mute'); // Change icon to volume mute
        }
    });
});


$(window).scroll(function(e) {
    if ($(document).scrollTop() > 120) {
        $('.tm-navbar').addClass("scroll");
    } else {
        $('.tm-navbar').removeClass("scroll");
    }
});

// Close mobile menu after click 
$('#tmNav a').on('click', function() {
    if ($('.navbar-collapse').hasClass('show')) {
        $('.navbar-collapse').collapse('hide');
    }
})

// Scroll to corresponding section with animation
$('#tmNav').singlePageNav({
    'easing': 'easeInOutExpo',
    'speed': 600
});

// Add smooth scrolling to all links
// https://www.w3schools.com/howto/howto_css_smooth_scroll.asp
$("a").on('click', function(event) {
    if (this.hash !== "") {
        event.preventDefault();
        var hash = this.hash;

        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 600, 'easeInOutExpo', function() {
            window.location.hash = hash;
        });
    } // End if
});

// coluna de testemunhos em serviços