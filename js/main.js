$(document).ready(function () {
    $('.sidenav').sidenav({
        preventScrolling = false
    });
    $('.scrollspy').scrollSpy();
    $('.tooltipped').tooltip();
    $('.stretch').each(function () {
        $(this).strech_text();
    });
});

$(document).ready(function ($) {
    $('body').addClass('loaded');
});

//stretch text, append .stretch
$.fn.strech_text = function () {
    var elmt = $(this),
        cont_width = elmt.width(),
        txt = elmt.html(),
        one_line = $('<span class="stretch_it">' + txt + '</span>'),
        nb_char = elmt.text().length,
        spacing = cont_width / nb_char,
        txt_width;

    elmt.html(one_line);
    txt_width = one_line.width();

    if (txt_width < cont_width) {
        var char_width = txt_width / nb_char,
            ltr_spacing = spacing - char_width + (spacing - char_width) / nb_char;

        one_line.css({
            'letter-spacing': ltr_spacing
        });
    } else {
        one_line.contents().unwrap();
        elmt.addClass('justify');
    }
};

//smoothScroll 
$(function () {
    $('a[href*="#"]:not([href="#"])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 500);
                return false;
            }
        }
    });
});

$(function () {
    var stickyHeaderTop = 50;

    $(window).scroll(function () {
        if ($(window).scrollTop() > stickyHeaderTop) {
            $('.navbar-fixed').addClass("scrolled");
        } else {
            $('.navbar-fixed').removeClass("scrolled");
        }
    });
});
$(function () {
    var stickyHeaderTop = 100;

    $(window).scroll(function () {
        if ($(window).scrollTop() > stickyHeaderTop) {
            $('.logo').addClass("scrolled");
        } else {
            $('.logo').removeClass("scrolled");
        }
    });
});
$(function () {
    var stickyHeaderTop = 250;

    $(window).scroll(function () {
        if ($(window).scrollTop() > stickyHeaderTop) {
            $('#brand, #navbar, .footer').addClass("scrolled");
        } else {
            $('#brand, #navbar, .footer').removeClass("scrolled");
        }
    });
});

$(window).scroll(function () {

    var wScroll = $(this).scrollTop();
    if (wScroll > $('.charts').offset().top - ($(window).height() / 2)) {

        $('.radar-box').css({
            'fill-opacity': '0.5',
            'stroke-dashoffset': '0'
        });
        $('.range').css({
            'width': '100%'
        });
    }
});
