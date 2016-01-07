'use strict';
function ajaxRequest (method, url, callback) {
      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function () {
         if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            callback(xmlhttp.response);
         }
      };

      xmlhttp.open(method, url, true);
      xmlhttp.send();
   }
(function () {
   var addButton = document.querySelector('.btn-add');
   var deleteButton = document.querySelector('.btn-delete');
   var clickNbr = document.querySelector('#click-nbr');
   var namesection = document.querySelector('#display-name');
   var pollsection = document.querySelector('#newpoll');
   var apiUrl = 'https://nightlifeapp-naiyucko.c9users.io/api/clicks';
   var apiUrlPolls = 'https://nightlifeapp-naiyucko.c9users.io/yelping?query123=';
   var isloggedinbool = false;
   
   function ready (fn) {
      if (typeof fn !== 'function') {
         return;
      }

      if (document.readyState === 'complete') {
         return fn();
      }

      document.addEventListener('DOMContentLoaded', fn, false);
   }
   
   
   
    function updateClickCount (data) {
      var clicksObject = JSON.parse(data);
      if (clicksObject.username !== undefined) {
         isloggedinbool = true;
         namesection.innerHTML = "Welcome, " + clicksObject.username + "!" + '<br /><a class="menu" href="/logout">Logout</a>';
      }
      else {
         isloggedinbool = false;
         namesection.innerHTML = "Login to tell everyone where you're going tonight!" + '<br /><a class="menu" href="/login">Login</a><a class="menu" href="/signup">Signup</a>';
      }
   }
   
   function updateNewPoll () {
      pollsection.innerHTML = '<form id="myForm" method="post" action="newpoll"><p>Poll Title: <input type="text" name="title" id="title" onkeyup=topLel(this.value) /><span id="wowthere"></span></p><br /><div id="input1" style="margin-bottom:4px;" class="clonedInput">Option: <input type="text" name="name1" id="name1" /></div><div><input type="button" id="btnAdd" value="Add Another" /></div><p class="submit"><input type="submit" name="commit" value="Save" id="savebtn"></p></form>';
      $('#btnAdd').click(function() {
          var num        = $('.clonedInput').length;    // how many "duplicatable" input fields we currently have
          var newNum    = new Number(num + 1);        // the numeric ID of the new input field being added
      
          // create the new element via clone(), and manipulate it's ID using newNum value
          var newElem = $('#input' + num).clone().attr('id', 'input' + newNum);
      
          // manipulate the name/id values of the input inside the new element
          newElem.children(':first').attr('id', 'name' + newNum).attr('name', 'name' + newNum);
      
          // insert the new element after the last "duplicatable" input field
          $('#input' + num).after(newElem);
      });
   }
   
   $('#tfbutton').click(function() {
      var tbshot = $('#tbss').val();
      ajaxRequest('GET', apiUrlPolls + tbshot, function(data) {
         var parsed = JSON.parse(data);
         var htmlss = "";
         var wtfmate = [];
         var pbdmf = parsed.businesses.slice(0);
        for (var v = 0; v < pbdmf.length; v++)
          {
             
            htmlss = htmlss.concat("<div class=\"row text-center\"> <div class=\"col-md-12 text-center\"> <div class=\"ahueahue text-center\"><span style=\"color:black;font-size:20px\">");
            htmlss = htmlss.concat("<a href=\"" + pbdmf[v].url + "\">" + pbdmf[v].name + "</a></span><br><img src=\"" + pbdmf[v].image_url + "\"<br><span style\"font-size:10px\">" + pbdmf[v].snippet_text);
            if (isloggedinbool) {
               htmlss = htmlss.concat("<br><button type=\"button\" id=\"" +pbdmf[v].id + "\" class=\"btn groupbtn\" onclick=\"isgoing('" + pbdmf[v].id + "')\">Click Me!</button>");
            }
            htmlss = htmlss.concat("</span></div></div></div>");
             
          }
          $('#wowthere').html(htmlss);
          for (var i = 0; i <pbdmf.length; i++) {
             checkgoing(pbdmf[i].id);
          }
      });
      
   });
   
   ready(ajaxRequest('GET', apiUrl, updateClickCount));
   
   
})();

function topLel(textf) {
   console.log(textf);
   if (textf.indexOf("'") !== -1) {
      $('#savebtn').attr('disabled','disabled');
      $('#wowthere').html("No special characters allowed");
   }
   else {
      $('#savebtn').attr('disabled',false);
      $('#wowthere').html("");
   }
}

function isgoing(value) {
   if ($('#' + value).html() == "You're Going") {
      ajaxRequest('GET', 'https://nightlifeapp-naiyucko.c9users.io/api/delete?barnum=' + value, function(data1) {
         checkgoing(value);
      })
   }
   else {
   ajaxRequest('GET', 'https://nightlifeapp-naiyucko.c9users.io/newpoll?barid=' + value, function(data) {
      checkgoing(value);
   })
   }
}

function checkgoing(value) {
   ajaxRequest('GET', 'https://nightlifeapp-naiyucko.c9users.io/api/polls?reallife=true&barnum=' + value, function(resulter) {
   var ahue = JSON.parse(resulter);   
   if (ahue.length !== 0) {
      $('#' + value).html("You're Going");
   }
   else {
   ajaxRequest('GET', 'https://nightlifeapp-naiyucko.c9users.io/api/polls?barnum=' + value, function(data2) { 
         var stuff = JSON.parse(data2);
         $('#' + value).html(stuff.length + " Going");
      });
   }
   })
   
}

