// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascridpts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require jquery-ui
//= require ember
//= require_tree ./templates
//= require_tree .


$(document).ready(function() {
    
    // Dirty hack for ipad scroll-disabling
    $(document).bind('touchmove', false);
    
    height = $(window).height();
    width = $(window).width();
    
    placeNav(height, width);
    placeSections(height, width);
    
    $(window).resize(function() {
        height = $(window).height();
        width = $(window).width();
        placeNav(height, width);
        placeSections(height, width);
    });
    
    //$('section#home').css({top: '0px', left: '0px'});
    
    $('li#nav_right').click(function() {
        minimizeSection();
        $('#pages .profile').stop().animate({left: '0px'}, 250, function() {
            $(this).attr('active', 1)
        });
    });
    
    $('li#nav_left').click(function() {
        minimizeSection();
        $('#pages .gallery').stop().animate({left: '0px'}, 250, function() {
            $(this).attr('active', 1)
        });
    });
    
    $('li#nav_bottom').click(function() {
        minimizeSection();
        $('#pages .editor').stop().animate({top: '0px'}, 250, function() {
            $(this).attr('active', 1)
        });
    });
    
    $('li#nav_top').click(function() {
        minimizeSection();
        $('#pages .about').stop().animate({top: '0px'}, 250, function() {
            $(this).attr('active', 1)
        });
    });
});

function placeNav(height, width) {
    $('#nav_top').css({left: width/2-15});
    $('#nav_bottom').css({left: width/2-15});
    $('#nav_left').css({top: height/2-5});
    $('#nav_right').css({top: height/2-5});
}

function placeSections(height, width) {
    $('#pages .profile').css({left: width, top: '0px'});
    $('#pages .editor').css({top: height, left: '0px'});
    $('#pages .gallery').css({left: -width, top: '0px'});
    $('#pages .about').css({top: -height, left: '0px'});
}

function minimizeSection(section) {
    $('#pages > div').each(function() {
        console.log($(this));
        if($(this).attr('active') == 1) {
            $(this).animate({height: '0px', width: '0px', top: '50%', left: '50%'}, 250, function() {
                $(this).attr('active', 0);
                $(this).css({width: width, height: height});
                placeSections(height, width);
            });
        }
    });
    //$('#'+section).animate({opacity: 0}, 500);
    //$('#'+section).animate({height: '0px', width: '0px', top: '50%', left: '50%'});
    //$('#'+section).css({height: '0px', width: '0px', top: '50%', left: '50%'});
}

// iPad / iPhone specific
function orientationChanged() {
    placeSections(height, width);
}

function isiPad(){
    return (navigator.platform.indexOf("iPad") != -1);
}