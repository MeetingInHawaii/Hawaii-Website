var swiper = null;
var dropTimer;
var x;
var y;
var dropRadius = 20;
var strength = 0.05 + Math.random() * 0.08;
var isStartRipple = true;

$(function () {
  determineSwiper();
  setupLayout();
  startRipple();
  startDrop();
  initSlideMenu();
});

function startRipple() {
  if ($(window).width() >= 1024) {
    $(".slide1").ripples({
      resolution: 512,
      dropRadius: 20,
      perturbance: 0.3,
    });
    $(window).on("blur", function () {
      $(".slide1").ripples("pause");
    });
    $(window).on("focus", function () {
      $(".slide1").ripples("play");
    });
  }
}

function startDrop() {
  if ($(window).width() >= 1024) {
    if (dropTimer != null) {
      clearTimeout(dropTimer);
    }
    dropTimer = setTimeout(() => {
      drop();
      startDrop();
    }, 1000);
  }
}

function drop() {
  if ($(window).width() >= 1024) {
    if (isStartRipple) {
      var $el = $(".slide1");
      x = Math.random() * $el.outerWidth();
      y = Math.random() * $el.outerHeight();
      $el.ripples("drop", x, y, dropRadius, strength);
    }
  }
}

function setupLayout() {
  $("#menu-bottom a").each(function (i) {
    $(this).attr("data-index", i + 1);
    $(this).on("click tap", function () {
      var index = parseInt($(this).attr("data-index"));
      $(".focusMenu").removeClass("focusMenu");
      $("#menu-bottom a[data-index='" + index + "']").addClass("focusMenu");
      swiper.slideTo(index, 600, false);
    });
  });
  $(window).on("resize", function () {
    determineSwiper();
  });
  window.onfocus = function () {
    $(".slide1").ripples("play");
    isStartRipple = true;
  };
  window.onblur = function () {
    $(".slide1").ripples("pause");
    isStartRipple = false;
  };
}

function createSwiper() {
  swiper = new Swiper(".swiper-container", {
    slidesPerView: 1,
    loop: true,
    updateOnWindowResize: true,
    allowTouchMove: false,
  });
  swiper.on("slideChange", function () {
    $(".particles").hide();
    $(".slide1").ripples("pause");
    isStartRipple = false;
    if (this.realIndex == 0) {
      $(".slide1").ripples("play");
      isStartRipple = true;
    } else if (this.realIndex == 3) {
      $(".particles").show();
    }
  });
}

function determineSwiper() {
  if ($(window).width() < 1024) {
    if (swiper != null) {
      swiper.destroy(true, true);
      swiper = null;
    }
    $(".swiper-container").addClass("container-fluid p-0 swiper-con").removeClass("swiper-container");
    $(".swiper-wrapper").addClass("row m-0 swiper-row").removeClass("swiper-wrapper");
    $(".swiper-slide").addClass("col-12 p-0 swiper-item").removeClass("swiper-slide");
    $(".slide1").ripples("destroy");
    isStartRipple = false;
  } else {
    $(".swiper-con").addClass("swiper-container").removeClass("container-fluid p-0 swiper-con");
    $(".swiper-row").addClass("swiper-wrapper").removeClass("row m-0 swiper-row");
    $(".swiper-item").addClass("swiper-slide").removeClass("col-12 p-0 swiper-item");
    $(".focusMenu").removeClass("focusMenu");
    if (swiper == null) {
      createSwiper();
      console.log("reset index");
      $("#menu-bottom li a").eq(0).addClass("focusMenu");
    }
    startRipple();
    startDrop();
    isStartRipple = true;
  }
}

function initSlideMenu() {
  $("#sidebar").mCustomScrollbar({ theme: "minimal" }),
    $("#dismiss, .overlay").on("click", function () {
      $("#sidebar").removeClass("active"), $(".overlay").removeClass("active");
    }),
    $("#sidebarCollapse").on("click", function () {
      $("#sidebar").addClass("active"),
        $(".overlay").addClass("active"),
        $(".collapse.in").toggleClass("in"),
        $("a[aria-expanded=true]").attr("aria-expanded", "false");
    });
}
