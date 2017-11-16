(function($) {
  "use strict"; // Start of use strict

  $('body').scrollspy({
    target: '#mainNav',
    offset: 0
  });

  // Collapse Navbar
  var navbarCollapse = function() {
     $("#mainNav").addClass("navbar-shrink")
  };
  
  // Collapse now if page is not at top
  navbarCollapse();
  // Collapse the navbar when page is scrolled
  // Hide navbar when modals trigger
  $('.portfolio-modal').on('show.bs.modal', function(e) {
    $(".navbar").addClass("d-none");
  })
  $('.portfolio-modal').on('hidden.bs.modal', function(e) {
    $(".navbar").removeClass("d-none");
  })

})(jQuery); // End of use strict
