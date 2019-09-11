//global variables
var curUser, users = [];                                  
var send = document.getElementById('send');
//initialization
window.onload = function initialization() {
    var params = getUrlParams();
    var username = params['username'];
    if(username.indexOf('.') !== -1) {
        username = username.toLowerCase();
        curUser = JSON.parse(localStorage.getItem(username));  
    }
    else {
        curUser = JSON.parse(localStorage.getItem(username)); 
        var email = curUser.email;
        curUser = JSON.parse(localStorage.getItem(email));  
    }
    setUserName(curUser);
    showUserMessges(curUser);
    var k = 0;
    for(var i = 0; i < localStorage.length; i++){
        if (localStorage.key(i).indexOf('.') !== -1) {
            users[k++] = localStorage.key(i);
        }
    }
}

//greet user
function setUserName(curUser){
    document.getElementById('cur-user').innerHTML = 'Hello '+ curUser.first + ' ' + curUser.last;
}

//fetch user credentials from URL
function getUrlParams(){
    var url = decodeURIComponent(location.href);
    var query = url.split('?')[1];
    var params = {};
    if (query !== ''){
        var arr = query.split('&');
        for (var i of arr) {
            var entry = i.split('=');
            var key = entry[0];
            var value = entry[1];
            params[key] = value;
        }
    }
    return params;
}

//auto-complete dropdown list of users 
function autocomplete(inp, arr) {
    //create and display list on 'input' event on input
    inp.addEventListener('input', function () {
        var listItem, item, i, val = this.value;
        closeAllLists();
        listItem = document.createElement('div');
        listItem.setAttribute('class', 'autocomplete-items');
        this.parentNode.appendChild(listItem);
        for (i = 0; i < arr.length; i++) {
            if (arr[i] !== curUser.email){
                if (arr[i].substr(0, val.length).toUpperCase() === val.toUpperCase()) {
                    item = document.createElement('div');
                    item.innerHTML = '<strong>' + arr[i].substr(0, val.length) + '</strong>' +  arr[i].substr(val.length) + '<input type="hidden" value=' + arr[i] + '>';
                    item.addEventListener('click', function() {
                        inp.value = this.getElementsByTagName('input')[0].value;
                        closeAllLists();
                    });
                    listItem.appendChild(item);
                }
            }
        }
    });
    
    //create and display list on 'click' event on input
    inp.addEventListener('click', function (ev) {
        ev.stopPropagation();
        var listItem, item, i;
        closeAllLists();
        listItem = document.createElement('div');
        listItem.setAttribute('class', 'autocomplete-items');
        listItem.style.height = '200px';
        listItem.style.overflowY = 'scroll';  
        this.parentNode.appendChild(listItem);
        for (i = 0; i < arr.length; i++) {
            if (arr[i] !== curUser.email){
                item = document.createElement('div');
                item.innerHTML = arr[i] + '<input type = "hidden" value=' + arr[i] + '>';
                item.addEventListener('click', function() {
                    inp.value = this.getElementsByTagName('input')[0].value;
                    closeAllLists();
                });
                listItem.appendChild(item);
            }
        }
    });
    
    //close list with clicked anywhere else
    document.addEventListener('click', function(){
        closeAllLists();
    });
    //remove autocomplete list
    function closeAllLists() {
      var x = document.getElementsByClassName('autocomplete-items');
      for (var i = 0; i < x.length; i++) {
            x[i].parentNode.removeChild(x[i]);
        }
    }
    
}

//validate inputs before sendsing message
send.onclick = function validateMessage() {
    var to = document.getElementById('input').value;
    var message = document.getElementById('info').value;
    var timer = document.getElementById('timer').value;
    var from = curUser.email;
    var toValidation = true, timerValidation = true, messageValidattion = true;
    if ((localStorage.getItem(to) === null)) {
        document.getElementById('to-sp').innerHTML = 'User not found';
        document.getElementById('to-sp').style.color = 'red';
        toValidation = false;
    }else{
        document.getElementById('to-sp').innerHTML = '';
        toValidation = true;
    }
    if (timer <= 0  || timer.indexOf('e') !== -1) {
        document.getElementById('t-sp').style.color = 'red';
        document.getElementById('t-sp').innerHTML = 'Please enter a valid time.';
        timerValidation = false;
    }
    else if (timer > 10080){
        document.getElementById('t-sp').style.color = 'red';
        document.getElementById('t-sp').innerHTML = 'Max time limit 10080';
        timerValidation = false;
    }
    else {
        document.getElementById('t-sp').innerHTML = '';
        timerValidation = true;
    }
    var upperCase = false, lowerCase = false, splchar = false, bLen = false, bNum = false, bValidPass = false;
    for (var i = 0; i < message.length; i++) {
        //special character
        if ((message.charAt(i) > 31 && message.charAt(i) < 48)||(message.charAt(i)>57 && message.charAt(i)<65)) {
            splchar = true;
        }//number
        else if (message.charAt(i) >= '0' && message.charAt(i) <= '9') {
            bNum = true;
        }//upperCase letter
        else if (message.charAt(i) >= 'A' && message.charAt(i) <= 'Z') {
            upperCase = true;
        }//lowerCase letter 
        else if (message.charAt(i) >= 'a' && message.charAt(i) <= 'z') {
            lowerCase = true;
        }
    }
    bValidPass = bLen || upperCase || lowerCase || splchar || bNum;
    if (!bValidPass) { //warn user
        document.getElementById('c-sp').innerHTML = 'Please enter a valid message.'
        document.getElementById('c-sp').style.color = 'red';
        messageValidattion = false;
    }
    else {
        document.getElementById('c-sp').innerHTML = ''
        messageValidattion = true;
    }
    if(toValidation && timerValidation && messageValidattion){
        document.getElementById('input').value = '';
        document.getElementById('info').value = '';
        document.getElementById('timer').value = '';
        document.getElementById('to-sp').innerHTML = '';
        document.getElementById('t-sp').innerHTML = '';
        document.getElementById('c-sp').innerHTML = '';
        document.getElementById('to-sp').style.color = 'grey';
        document.getElementById('t-sp').style.color = 'grey';
        document.getElementById('c-sp').style.color = 'grey';
        addMessagesToStore(to, from, timer, message);
    }    
};

//add messages to localstorage on 'click' event on button
function addMessagesToStore (_to, _from, _timer, _message) {  
    var msg = {
        to: _to,
        from: _from,
        message: _message,
        timeToLive: _timer*60*1000,
        timeCreated: Date.now()
    };
    curUser.messages.push(msg);
    localStorage.setItem(_from, JSON.stringify(curUser));
    var receiver = JSON.parse(localStorage.getItem(_to));
    receiver.messages.push(msg);
    localStorage.setItem(_to, JSON.stringify(receiver));
}

//show users's messages when a user logs in
function showUserMessges (user) {
    var list = document.getElementById('message-list');
    var user = JSON.parse(localStorage.getItem(user.email));
    for (var msg of user.messages) {
        let item = document.createElement('li');
        if (msg.from === user.email) {
            createSendMessages(list, item);
        }
        else if ( msg.timeToLive > ((new Date()).getTime() - new Date(msg.timeCreated).getTime())) {
            createReceivedMessages(list, item);
        }
    }

    function createSendMessages(list, item, lastTimeStamp){
        
        item.setAttribute('class', 'right');
        item.setAttribute('data-timestamp', msg.timeCreated.toString());
        item.innerHTML =  '<receiver></receiver><bubble><message><strong>'+ msg.message + '</strong></message><sender> :' + msg.from + '</sender></bibble>';
        list.appendChild(item);
    }
    
    function createReceivedMessages(list, item, ){
        item.setAttribute('class', 'left');
        item.innerHTML =  '<bubble><sender>' + msg.from  + ': </sender><message><strong>'+ msg.message +'</strong>' + '      Expire @' + new Date(msg.timeCreated + msg.timeToLive).getHours() + ':' + new Date(msg.timeCreated + msg.timeToLive).getMinutes() + '</message></bubble><receiver></receiver>'
        item.setAttribute('data-timestamp', msg.timeCreated.toString());
        list.appendChild(item);
        setTimeout( function () {
            list.removeChild(item);
        }, msg.timeToLive - ((new Date()).getTime() - new Date(msg.timeCreated).getTime()));   
    }

    setInterval(function (){
        var curUser = JSON.parse(localStorage.getItem(user.email));
        var nodes = list.querySelectorAll('li');
        if(nodes.length === 0){
            return;
        }
        var lastItem = nodes[nodes.length-1];
        var lastTimeStamp = lastItem.getAttribute('data-timestamp');
        var length = curUser.messages.length-1;
        var index = length;
        for (var i = length; i >= 0; i--){
            if (curUser.messages[i].timeCreated > lastTimeStamp) {
                index--;
            }
            else {
                break;
            }
        }
        if (index < length) {
            for (; index <= length; index++) {
                let item = document.createElement('li');
                if ( curUser.messages[index].timeToLive > ((new Date()).getTime() - new Date(curUser.messages[index].timeCreated).getTime())) {
                    if( curUser.messages[index].timeCreated <= lastTimeStamp){
                        continue;
                    }
                    if(curUser.messages[index].from === curUser.email){
                        item.setAttribute('class', 'right');
                        item.innerHTML =  '<receiver></receiver>' +  '<bubble><message><strong>'+ curUser.messages[index].message +'</strong></message><sender>'+ ':' + curUser.messages[index].from  + '</sender></bubble>'  
                        item.setAttribute('data-timestamp', curUser.messages[index].timeCreated.toString());
                        list.appendChild(item);
                        lastTimeStamp = item.getAttribute('data-timestamp');
                    }
                    else {
                        item.setAttribute('class', 'left');
                        item.innerHTML =  '<bubble><sender>' + curUser.messages[index].from  + ':' + '</sender>' + '<message><strong>'+ curUser.messages[index].message +'</strong>' + '      Expire @' + new Date(curUser.messages[index].timeCreated + curUser.messages[index].timeToLive).getHours() + ':' + new Date(curUser.messages[index].timeCreated + curUser.messages[index].timeToLive).getMinutes() + '</message></bubble>' +  '<receiver></receiver>'
                        item.setAttribute('data-timestamp', curUser.messages[index].timeCreated.toString());
                        list.appendChild(item);
                        lastTimeStamp = item.getAttribute('data-timestamp');
                        setTimeout( function () {
                            list.removeChild(item);
                        }, curUser.messages[index].timeToLive - ((new Date()).getTime() - new Date(curUser.messages[index].timeCreated).getTime()));
                    }
                }   
            }
        }
    }, 2000);

}


