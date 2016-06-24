console.log('my-note app.js');

function getDOMid(id)
{
  return document.getElementById(id);
}

var btn_newnote = document.getElementsByClassName('btn-newnote');
var btn_full = document.getElementsByClassName('btn-full');
var btn_savenote = document.getElementsByClassName('btn-savenote');
var btn_about = document.getElementsByClassName('btn-about');

var fullscreen = getDOMid('fullscreen');
var memo = getDOMid('memo');
var overlay_t = getDOMid('overlay_t');
var popup = getDOMid('popup');

if(localStorage.length !== 0) // 최초 실행 시 localStorage에 값이 있을 경우 textarea에 출력
{
  for(var i = 0; i < localStorage.length; i++)
  {
    memo.innerHTML += localStorage.key(i) + "\n";
  }
}

btn_full[0].addEventListener('click', function(event)
{
  if(event.srcElement.requestFullScreen) {
			fullscreen.requestFullScreen();
		}
     else if(event.srcElement.webkitRequestFullScreen) {
			fullscreen.webkitRequestFullScreen();
		}
     else if(event.srcElement.mozRequestFullScreen) {
			fullscreen.mozRequestFullScreen();
		}
     else if (event.srcElement.msRequestFullScreen) {
			fullscreen.msRequestFullScreen(); // IE
		}
});

btn_newnote[0].addEventListener('click', function(event)
{
  memo.value = "";
});

btn_savenote[0].addEventListener('click', function(event){
  if(memo.value !== "")
  {
    localStorage.setItem(memo.value, 'var');
    memo.value = "";
  }
  else
  {
    window.alert('메시지를 입력해 주세요.');
  }
});

btn_about[0].addEventListener('click', function(event){
  var $layerPopupObj = $('#popup');
  var left = ( $(window).scrollLeft() + ($(window).width() - $layerPopupObj.width()) / 2 );
  var top = ( $(window).scrollTop() + ($(window).height() - $layerPopupObj.height()) / 2 );
  $layerPopupObj.css({'left':left,'top':top, 'position':'fixed'});

  overlay_t.style.display = "block";
  popup.style.display = "block";

});

 $(document).ready(function() {
   $('#overlay_t, #close').click(function() {
     $('#popup, #overlay_t').hide();
   });
 });
