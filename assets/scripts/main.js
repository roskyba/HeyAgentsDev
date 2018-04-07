$(window).on('load', function(e) {
  $('body').addClass('loaded');
});

new WOW().init();

$(document).ready(function(){

  // $('.slider-dashboard').slick({
  //   lazyLoad: 'progressive',
  //   arrows: false,
  //   dots: true
  // });

  // $('.slider-testimonials').slick({
  //   lazyLoad: 'progressive',
  //   arrows: false,
  //   dots: false
  // });

  // $('.arrow-left').on('click', function(e) {
  //   $('.slider-testimonials').slick('slickNext');
  // });

  // $('.arrow-right').on('click', function(e) {
  //   $('.slider-testimonials').slick('slickPrev');
  // });

  $('.responsive-nav-btn').on('click', function(e) {
    $('.header-navigation').addClass('activated');
    $('.responsive-close-nav-btn').fadeIn('slow');
  });

  $('.responsive-close-nav-btn').on('click', function(e) {
    $('.header-navigation').removeClass('activated');
    $('.responsive-close-nav-btn').hide();
  });

  $('.question').on('click', function(e) {
    $(this).next().slideToggle();
    $(this).toggleClass('opened');
  });





});
