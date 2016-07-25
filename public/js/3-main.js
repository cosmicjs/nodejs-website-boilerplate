$(function() {
  $('.phone-mask').mask('000-000-0000');
  $(window).on('load', function() {
    stickyFooter();
  });
  $(window).on('resize', function() {
    stickyFooter();
  });
  $('#contact_form').on('submit', function() {
    var data = $(this).serializeFormJSON();
    // Do some validation
    $('.form-group').removeClass('has-error');
    if (!data.full_name) {
      $('.form-group--name').addClass('has-error');
      return false;
    }
    if (!data.email || !isValidEmail(data.email)) {
      $('.form-group--email').addClass('has-error');
      return false;
    }
    if (!data.message) {
      $('.form-group--message').addClass('has-error');
      return false;
    }
    $('.error-message').addClass('hidden');
    $('.success-message').addClass('hidden');
    $('.submit-btn').addClass('disabled');
    $('.submit-btn').text('Submitting...');
    $.ajax({
      url: '/contact',
      method: 'post',
      contentType: 'application/json',
      data: JSON.stringify(data)
    }).success(function(){
      $('.submit-btn').removeClass('disabled');
      $('.submit-btn').text('Submit');
      $('.success-message').removeClass('hidden');
    }).error(function(response){
      $('.error-message').removeClass('hidden');
      $('.error-message').text(response.responseJSON.message);
      $('.submit-btn').removeClass('disabled');
      $('.submit-btn').text('Submit');
    });
    return false;
  });
  $('.make-friendly-date').each(function() {
    var timestamp = $(this).data('timestamp');
    var friendly_date = friendlyDate(new Date(timestamp));
    $(this).html(friendly_date.day + ', ' + friendly_date.month + ' ' + friendly_date.date + ' ' + friendly_date.year);
  });
});
// Functions
function stickyFooter(){  
  var windowHeight = $(window).height();
  if(windowHeight > $('#footer').height() + $('#header').height() + $('#main').height()){
    $('#footer').addClass('sticky');
  } else {
    $('#footer').removeClass('sticky');
  }
  $('#footer').removeClass('invisible');
}
(function ($) {
  $.fn.serializeFormJSON = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
      if (o[this.name]) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });
    return o;
  };
})(jQuery);
function isValidEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
function friendlyDate(a) {
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var days = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var day = days[a.getDay()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = {
    day: day,
    date: date,
    month: month,
    year: year,
    hour: hour,
    min: min,
    sec: sec
  }
  return time;
}