// Todo app 전역
var Todo = {
  $wrap: $(document.body),
  storageKey: 'todos'
};

// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
// http://ejohn.org/blog/javascript-micro-templating/
(function(){
  var cache = {};

  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
      tmpl(document.getElementById(str).innerHTML) :

      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +

          // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +

          // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
        + "');}return p.join('');");

    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();


(function(app, $){

  var data = [];

  app.collection = {
    set: function(arr){
      data = arr;
      app.$wrap.trigger("addCollection", [data]);
    },
    toJSON: function() {
      return data;
    },
    add: function (todo, opt ) {
      data.push(todo);

      // app.view.render(data);

        app.$wrap.trigger("addCollection", [data]);
    },
    remove: function (id) {

      for (var i = 0; i < data.length; i++) {

        if (data[i].id === id) {
          console.log('find', i)
          //data에서  todo를 지워야해
          data.splice(i, 1);
          break;
        }

      }//end for

      app.$wrap.trigger("removeCollection", [data]);

    }

  };
})(Todo, jQuery);

(function(app){

  app.model = {

    id: '',
    title: ''


  };
})(Todo);


(function($, app){


  var $listDom = $('#todoList');
  var todoTemplateHtml = $('#todoTemplate').html();

  app.view ={

    addTodo: function(event){
      var $field = $(event.currentTarget);
      var fieldValue = $field.val();

      if (event.keyCode !== 13 || fieldValue === "") {

        console.log('event stop');
        return false;
      }

      $field.val('');

      var todo = $.extend({}, app.model, {
        id: app.util.uniqId(),
        title: fieldValue
      });

      //console.log('new​ todo.model:', todo);
      app.collection.add(todo);
    },
    render: function(){
      $listDom.html(tmpl( todoTemplateHtml, {todos: app.collection.toJSON() } ));
    }
  };

  app.$wrap.on('addCollection', app.view.render);
  app.$wrap.on('removeCollection', app.view.render);


})(jQuery, Todo);




(function(app) {


function remove(id){
  $.ajax({
  url: 'http://localhost:3000/todos/' + id,
  method: 'DELETE',
  success: function(result){
    console.log('Delete:', result);
  }
  });
}
function save(model){
  $.ajax({
  url: 'http://localhost:3000/todos',
  method: 'POST',
  data: model,
  success: function(result){
    console.log('Save:', result);
  }
  });
}

  app.util = {
    uniqId: function() {
      return new Date().getTime();
    },
    storage : {
      load: function (callback) {
        console.log('storage.load()');
        // return JSON.parse(localStorage.getItem(app.storageKey) || "[]");
        $.get('http://localhost:3000/todos', function(result){
          callback(result);
        });

      },
      save: function (event, data) {
        console.log('storage.save()');

// debugger;
        // for(var i=0; i<data.length; i++){
        //   remove(data.id);
        // }
        // localStorage.setItem(app.storageKey, JSON.stringify(data));

      },
      btnSave: function(){

        var data = app.collection.toJSON();
        console.log('save data:', data);
        // for(var i=0; i<data.length; i++){
        //   remove(data[i].id);
        // }

        for(var i=0; i<data.length; i++){
          save(data);
        }

      }

    }
  };


  app.$wrap.on('addCollection', app.util.storage.save);
  app.$wrap.on('removeCollection', app.util.storage.save);

})(Todo);

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
