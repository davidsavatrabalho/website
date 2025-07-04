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
        //adaptiveHeight: true, // Adjust height based on current slide's content
        responsive: [{
            breakpoint: 768,
            settings: {
                arrows: true, // Maybe no arrows on small screens
                dots: true,
            }
        }]
    });


    /* Galeria de vídeos */
    const videoCategories = {
        "alcoolistas": [{
                src: 'videos/alcoolistas/fotor-ai-2025052921248.mp4',
                thumb: 'img/cosmic-hand.png',
                opts: {
                    caption: '<h4>Alcoolistas: Entendendo a jornada</h4>',
                    type: 'video'
                }
            }, {
                src: 'videos/alcoolistas/fotor-ai-2025052921248.mp4',
                thumb: 'img/cosmic-hand.png',
                opts: {
                    caption: '<h4>Alcoolistas: Entendendo a jornada</h4>',
                    type: 'video'
                }
            },
            // Add more videos for this category as needed
        ],
        "dependentes-quimicos": [{
                src: 'videos/dependencia-quimica/como-escolher.mp4',
                thumb: 'img/reaching-hand.png',
                opts: {
                    caption: '<h4>Dependentes Químicos: Como Escolher</h4>',
                    type: 'video' // Indicate it's a video
                }
            }, {
                src: 'videos/dependencia-quimica/como-escolher.mp4',
                thumb: 'img/reaching-hand.png',
                opts: {
                    caption: '<h4>Dependentes Químicos: Como Escolher</h4>',
                    type: 'video' // Indicate it's a video
                }
            },
            // Add more videos for this category
        ],
        "internacoes": [{
            src: 'videos/internacoes/clinicas-reabilitacao.mp4',
            thumb: 'img/new-hope.png',
            opts: {
                caption: '<h4>Internações: O Primeiro Passo</h4>',
                type: 'video'
            }
        }, ],
        "treinamentos": [{
            src: 'videos/treinamentos/fotor-ai-2025052921759.mp4',
            thumb: 'img/new-becoming-life.png',
            opts: {
                caption: '<h4>Treinamentos: Transforme sua vida</h4>',
                type: 'video'
            }
        }, ],
    };

    $('.grid.tm-gallery a').on('click', function(e) {
        e.preventDefault(); // Prevent the default link behavior

        const category = $(this).data('category'); // Get the category from the data-category attribute
        const videosToOpen = videoCategories[category]; // Get the array of videos for this category

        if (videosToOpen && videosToOpen.length > 0) {
            // Open FancyBox with the dynamic set of videos
            $.fancybox.open(videosToOpen, {
                // FancyBox options for the video gallery
                loop: true, // Allow looping through videos
                buttons: [
                    "zoom",
                    "share",
                    "slideShow",
                    "fullScreen",
                    "download",
                    "thumbs",
                    "close"
                ],
                // Video specific options
                video: {
                    autoStart: true // Autoplay video on open
                }
            });

        } else {
            console.warn(`No videos found for category: ${category}`);
            alert('Nenhum vídeo disponível para esta categoria no momento.');
        }
    });

    // Get a reference to your carousel element
    /* var $testimonialsCarousel = $('.testimonials-carousel');

     // Add event listeners for mouseenter (hover in) and mouseleave (hover out)
     $testimonialsCarousel.on('mouseenter', function() {
         $testimonialsCarousel.slick('slickPlay'); // Start automatic sliding
     });

     $testimonialsCarousel.on('mouseleave', function() {
         $testimonialsCarousel.slick('slickPause'); // Pause automatic sliding
     }); tava removendo funcionamentos embutidos do slick*/


    /* slider pra páginas news - whatwedo */

     /*$('#news-slider').slick({
        slidesToShow: 3, // Default: show 3 slides (for desktop)
        slidesToScroll: 1,
        infinite: true,
        dots: false, // Show navigation dots
        arrows: false, // Hide arrows by default (often good for mobile)
        centerMode: true, // This helps with centering on mobile
        centerPadding: '20px', // Space around the centered item
        responsive: [
            {
                breakpoint: 992, // Breakpoint for medium screens and down
                settings: {
                    slidesToShow: 2, // On medium screens, show 2
                    slidesToScroll: 1,
                    centerMode: true, // Keep centered
                    centerPadding: '20px',
                    arrows: false,
                }
            },
            {
                breakpoint: 768, // Breakpoint for small screens (tablets/mobile) and down
                settings: {
                    slidesToShow: 1, // On mobile, show 1 slide at a time
                    slidesToScroll: 1,
                    centerMode: true, // This is crucial for centering the single item
                    centerPadding: '20px', // Adjust as needed
                    arrows: true, // Show arrows on mobile to navigate easily
                }
            }
        ]
    });*/

    const partnersSwiper = new Swiper('.partners-slider', {
        // Optional parameters
        loop: true, // Enable continuous loop mode
        slidesPerView: 2, // Default: show 1 slide per view
        spaceBetween: 30, // Space between slides

        autoplay: {
            delay: 2500, // 3 seconds between slides
            disableOnInteraction: false, // Continue autoplay after user interaction
        },

        // If you need responsive breakpoints (e.g., more logos on larger screens)
        breakpoints: {
            // when window width is >= 640px
            640: {
                slidesPerView: 2,
                spaceBetween: 40
            },
            // when window width is >= 768px
            768: {
                slidesPerView: 3,
                spaceBetween: 50
            },
            // when window width is >= 1024px
            1024: {
                slidesPerView: 4,
                spaceBetween: 60
            },
            // when window width is >= 1200px
            1200: {
                slidesPerView: 5, // Show 5 logos on very large screens
                spaceBetween: 70
            }
        },

        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // Pagination dots
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    // Optional: Pause autoplay on hover for desktop (if autoplay is enabled)
    $('.partners-slider').hover(
        function() {
            partnersSwiper.autoplay.stop();
        },
        function() {
            partnersSwiper.autoplay.start();
        }
    );
    // Gallery
    // Gallery Initialization
    $('.tm-gallery').slick({
        dots: true,
        arrows: true,
        infinite: true,
        autoplay: true, // <-- CHANGE THIS TO TRUE
        autoplaySpeed: 3000, // <-- Adjust speed if 2 seconds feels too fast for videos/text (e.g., 3000-5000ms)
        pauseOnHover: true, // <-- This is the default, but explicitly stating it is clear
        slidesToShow: 4,
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

    console.log("Document is ready. Starting popup script initialization (GitHub Pages fix).");

    const gallerySection = document.getElementById('gallery');
    const whatsappPopup = document.getElementById('whatsappPopup');
    const whatsappButton = document.querySelector('.whatsapp-float');

    console.log("Elements check: gallerySection found:", !!gallerySection, "whatsappPopup found:", !!whatsappPopup, "whatsappButton found:", !!whatsappButton);

    // Removed localStorage related code as per 'show every time' logic
    // const popupShownKey = 'whatsappPopupShown';

    // --- Intersection Observer to detect when #gallery is reached ---
    if (gallerySection && whatsappPopup) {
        console.log("Required elements for Intersection Observer are present. Setting up observer.");
        const observerOptions = {
            root: null, // Use the viewport as the root
            rootMargin: '0px', // No margin around the root
            threshold: 0.2 // Trigger when 20% of the #gallery section is visible
        };

        const galleryObserver = new IntersectionObserver((entries, observer) => {
            console.log("Intersection Observer callback fired for gallerySection.");
            entries.forEach(entry => {
                console.log("  Entry is intersecting:", entry.isIntersecting);

                if (entry.isIntersecting) {
                    // Removed localStorage check to ensure it shows every time the section is entered
                    // const hasPopupShown = localStorage.getItem(popupShownKey);
                    // console.log("  localStorage 'whatsappPopupShown' value:", hasPopupShown); // This log can be removed now

                    console.log("  #gallery section intersected. Showing popup.");

                    // Only show if it's not already visible
                    if (!whatsappPopup.classList.contains('show-popup')) {
                        setTimeout(() => {
                            whatsappPopup.classList.add('show-popup');
                            console.log("  Popup 'show-popup' class added after delay.");

                            setTimeout(() => {
                                whatsappPopup.classList.remove('show-popup');
                                console.log("  Popup 'show-popup' class removed (auto-hide after 6s).");
                            }, 6000); // Popup stays for 6 seconds
                        }, 500); // Delay before popup appears (0.5 seconds)
                    } else {
                        console.log("  Popup already visible, skipping show logic.");
                    }
                }
                // Optional: You could add an else block here to hide the popup when scrolling OUT of #gallery
                // else {
                //     if (whatsappPopup.classList.contains('show-popup')) {
                //         whatsappPopup.classList.remove('show-popup');
                //         console.log("  Scrolling out of gallery section. Popup hidden.");
                //     }
                // }
            });
        }, observerOptions);

        galleryObserver.observe(gallerySection);
        console.log("Intersection Observer is now observing #gallery.");
    } else {
        console.warn("Intersection Observer NOT initialized. Missing #gallery or #whatsappPopup in the DOM.");
    }

    // --- Event listener to hide popup if WhatsApp button is clicked ---
    if (whatsappButton && whatsappPopup) {
        console.log("WhatsApp button and popup found. Adding click listener to button.");
        whatsappButton.addEventListener('click', () => {
            whatsappPopup.classList.remove('show-popup');
            console.log("WhatsApp button clicked. Popup 'show-popup' class removed.");
        });
    } else {
        console.warn("WhatsApp button click listener NOT added. Missing .whatsapp-float or #whatsappPopup.");
    }

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

});
// coluna de testemunhos em serviços