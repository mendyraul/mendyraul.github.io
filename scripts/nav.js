// Wait for the DOM content to be fully loaded
window.addEventListener('DOMContentLoaded', event => {
    // Function to toggle the menu
    const toggleMenu = function () {
        const topnav = document.getElementById('topnav');
        topnav.classList.toggle('hidden');
    };

    // Get references to the button and the navigation menu
    const menuToggle = document.getElementById('menu-toggle');

    // Add a click event listener to the button
    menuToggle.addEventListener('click', toggleMenu);

    // Your existing code...
    // (You can integrate your existing code here or leave it as it is)

    // Navbar shrink function
    const navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink');
        } else {
            navbarCollapsible.classList.add('navbar-shrink');
        }
    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when the page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });
});


//socialize Javascript
$(document).ready(function() {
	
	// Expand Panel
	$("#slideit").click(function(){
		$("div#socialise").slideDown("slow");
	
	});	
	
	// Collapse Panel
	$("#closeit").click(function(){
		$("div#socialise").slideUp("slow");	
	});		
	
	// Switch buttons from "Open" to "Close" on click
	$(".toggler a").click(function () {
		$(".toggler a").toggle();
	});		
		
});