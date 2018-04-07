  var page = document.querySelector('.page'),
    bannerTitle = document.querySelector('.step-bar'),
    bannerTitleTop = bannerTitle.offsetTop,
    bannerParentHeight = bannerTitle.parentElement.offsetHeight,
    fixedClass = 'step-bar-fixed';

  function scrollFix(scrollEvent) {
    if (getPageY(scrollEvent) >= bannerTitleTop + 581) {
      bannerTitle.classList.add(fixedClass);
      bannerTitle.parentElement.setAttribute("style", "height:" + bannerParentHeight + 'px');
    }
    else if (getPageY(scrollEvent) < 581) {
      bannerTitle.classList.remove(fixedClass);
    }
    if (getPageY(scrollEvent) > 3053) {
      bannerTitle.classList.remove(fixedClass);
    }

    if (window.pageYOffset > 652 && window.pageYOffset < 1246) {
      $('.step-bar .col-sm-3 a').removeClass('active');
      $('.step-bar .col-sm-3:nth-child(1) a').addClass('active');
    } else if (window.pageYOffset >= 1246 && window.pageYOffset < 1844) {
      $('.step-bar .col-sm-3 a').removeClass('active');
      $('.step-bar .col-sm-3:nth-child(2) a').addClass('active');
    } else if (window.pageYOffset >= 1844 && window.pageYOffset < 2405) {
      $('.step-bar .col-sm-3 a').removeClass('active');
      $('.step-bar .col-sm-3:nth-child(3) a').addClass('active');
    } else if (window.pageYOffset >= 2405) {
      $('.step-bar .col-sm-3 a').removeClass('active');
      $('.step-bar .col-sm-3:nth-child(4) a').addClass('active');
    }
  };

  function getPageY(event) {
    return event.pageY
      || window.pageYOffset
      || event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  window.addEventListener('scroll', scrollFix, false);