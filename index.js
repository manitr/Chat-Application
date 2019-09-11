//global variables
var passwordValidation = false, confirmPassValidation = false, emailValidation = false, contactValidation = false, firstNameValidation = false, lastNameValidation = false;
var eye = document.getElementsByClassName('pw-eye');
var input = document.getElementsByTagName('input');
var password = document.getElementById('cr-pw');
var cPassword = document.getElementById('cf-pw');
var email = document.getElementById('email');
var num = document.getElementById('contact');
var fn = document.getElementById('fn');
var ln = document.getElementById('ln');

//hide-show password on 'click' on 'eye' icon
for (var e of eye) {
    e.addEventListener('pointerdown', function () {
        //change icons
        if (this.classList[2] === 'fa-eye') {
            this.classList.remove('fa-eye');
            this.classList.add('fa-eye-slash');
        }
        else {
            this.classList.remove('fa-eye-slash');
            this.classList.add('fa-eye');
        }
        //toggle text
        var previous = this.previousElementSibling;
        if (previous.type === 'password') {
            previous.type = 'text';
        } 
        else {
            previous.type = 'password';
        }
    });
}

for (var i of input) {
    //show legend and set fieldset border
    i.onfocus = function () {
        this.parentElement.style.border = '1px solid blue';
        this.previousElementSibling.style.fontSize = '.8em';
        this.previousElementSibling.style.display = 'initial';
        this.style.border = 'none';
        this.style.outline = 'none';
    }
    //hide legend and unset fieldset border
    i.onblur = function () {
        this.parentElement.style.border = '1px solid rgb(102, 98, 98)';
    }
}

password.addEventListener('blur', function validatePassword(){
    var upperCase = false, lowerCase = false, splchar = false, bLen = false, bNum = false, bValidPass = false;
    var pass = password.value;
    bLen = (pass.length > 7 && pass.length < 16);
    for (var i = 0; i < pass.length; i++) {
        //special character
        if ((pass.charCodeAt(i) > 32 && pass.charCodeAt(i) < 48)||(pass.charCodeAt(i) > 57 && pass.charCodeAt(i) < 65)) {
            splchar = true;
        }
        //number
        else if (pass.charAt(i) >= '0' && pass.charAt(i) <= '9') {
            bNum = true;
        }
        //upperCase letter
        else if (pass.charAt(i) >= 'A' && pass.charAt(i) <= 'Z') {
            upperCase = true;
        }
        //lowercase letter 
        else if (pass.charAt(i) >= 'a' && pass.charAt(i) <= 'z') {
            lowerCase = true;
        }
    }

    bValidPass = bLen && upperCase && lowerCase && splchar && bNum;
    if (!bValidPass) { //warn user
        password.parentElement.style.border = '1px solid red';
        password.previousElementSibling.style.display = 'initial';
        document.getElementById('cp1-span').innerHTML = 'Password must contain an uppercase letter, a lowercase letter, a spl. character, a number and be of at least 8 characters'; 
        passwordValidation = false;
        return;
    }

    if(cPassword.value !== '' && cPassword.value !== pass ) {
        cPassword.parentElement.style.border = '1px solid red';
        document.getElementById('cp2-span').innerHTML = 'Password do not match'; 
        cPassword.previousElementSibling.style.display = 'initial';
        confirmPassValidation = false;
    }
    password.parentElement.style.border = '1px solid green';
    document.getElementById('cp1-span').innerHTML = ''; 
    password.previousElementSibling.style.display = 'none';
    passwordValidation = true;
});

cPassword.addEventListener('blur',  function validateConfirmPassword () {
    if (password.value.length && password.value === cPassword.value) {
        cPassword.parentElement.style.border = '1px solid green';
        cPassword.previousElementSibling.style.display = 'none';
        document.getElementById('cp2-span').innerHTML = '';
        confirmPassValidation = true;
    }
    else { 
        if (password.value === '') {
            document.getElementById('cp2-span').innerHTML = 'Please set a password';
        } 
        else {
            document.getElementById('cp2-span').innerHTML = 'Password do not match'; 
        }
        cPassword.parentElement.style.border = '1px solid red';
        cPassword.previousElementSibling.style.display = 'initial';
        confirmPassValidation = false;
    }

});

email.onblur = function validateEmail () {
    //min email tpye: a@b.e
    var _email = email.value.toLowerCase().trim();
    //email should be unique
    if (localStorage.getItem(_email) !== null) {
        email.parentElement.style.border = '1px solid red';
        document.getElementById('e-span').innerHTML = 'User already exists'; 
        email.previousElementSibling.style.display = 'initial';
        emailValidation = false;
        return;
    }
    //only one @
    var parts = _email.split('@');
    if ( _email.length < 5 || parts.length !== 2 || parts[0].length === 0 || parts[1].indexOf('.') < 1 || parts[1].indexOf('.') === parts[1].length-1 ) {
        invalidEmailAlert();
        return;
    }
    //username char or number
    for (var i = 0; i < parts[0].length; i++) {
        if(!((parts[0].charCodeAt(i) > 32 && parts[0].charCodeAt(i) < 58) || (parts[0].charAt(i) >= 'a' && parts[0].charAt(i) <= 'z' ))) {
            invalidEmailAlert();
            return;
        }
    }
    var subParts = parts[1].split('.');
    if(subParts.length !== 2) {
        invalidEmailAlert();
        return;
    }
    for (var i = 0; i < subParts[0].length; i++) {
        if (! ((subParts[0].charAt(i) >= '0' && subParts[0].charAt(i) <= '9') || (subParts[0].charAt(i) >= 'a' && subParts[0].charAt(i) <= 'z' ))) {
            invalidEmailAlert();
            return;
        }
    }
    for (var i = 0; i < subParts[1].length; i++) {
        if (! ((subParts[1].charAt(i) >= 'a' && subParts[1].charAt(i) <= 'z'))) {
            
            invalidEmailAlert();
            return;
        }
    }

    function invalidEmailAlert(){
        email.parentElement.style.border = '1px solid red';
        email.previousElementSibling.style.display = 'initial';
        document.getElementById('e-span').innerHTML = 'Invalid Email';
        emailValidation = false;
    }

    email.parentElement.style.border = '1px solid green';
    document.getElementById('e-span').innerHTML = '';
    email.previousElementSibling.style.display = 'none';
    emailValidation = true;
}

num.onblur = function validateNumber() {
    //decimal point position shouldn't bne present in number
    if (num.value.charAt(0) === '0' || num.value.indexOf('.') !== -1 || num.value.length !== 10 || num.value.indexOf('e') !== -1 || num.value.indexOf('E') !== -1) {
        num.parentElement.style.border = '1px solid red';
        num.previousElementSibling.style.display = 'initial';
        document.getElementById('c-span').innerHTML = 'Enter a valid Contact Number';
        contactValidation = false;
        return;
    }
    //contact no can't be repeated 
    if (localStorage.getItem(num.value) !== null) {
        num.parentElement.style.border = '1px solid red';
        num.previousElementSibling.style.display = 'initial';
        document.getElementById('c-span').innerHTML = 'User already exists';
        contactValidation = false;
        return;
    }
    num.parentElement.style.border = '1px solid green';
    document.getElementById('c-span').innerHTML = '';
    num.previousElementSibling.style.display = 'none';
    contactValidation = true;
}

fn.onblur = function validateFName() {
    var first = fn.value.toLowerCase().trim();
    //length should be less than 15 characters
    if (first.length > 15 || first.length < 3) {
        fn.parentElement.style.border = '1px solid red';
        fn.previousElementSibling.style.display = 'initial';
        document.getElementById('fn-span').innerHTML = 'Please enter a valid name';
        firstNameValidation = false;
        return;
    }
    //only valid characters
    for (var i = 0; i < first.length; i++) {
        if (!((first.charAt(i) >= 'a' && first.charAt(i) <= 'z'))) {
            fn.parentElement.style.border = '1px solid red';
            fn.previousElementSibling.style.display = 'initial';
            document.getElementById('fn-span').innerHTML = 'Please enter a valid name';
            firstNameValidation = false;
            return;
        } 
    }
    fn.parentElement.style.border = '1px solid green';
    document.getElementById('fn-span').innerHTML = '';
    fn.previousElementSibling.style.display = 'none';
    firstNameValidation = true;
}

ln.onblur = function validateLName() {
    var last = ln.value.toLowerCase().trim();
    //length should be less than 15 characters
    if (last.length > 15 || last.length < 3) {
        ln.parentElement.style.border = '1px solid red';
        ln.previousElementSibling.style.display = 'initial';
        document.getElementById('ln-span').innerHTML = 'Please enter a valid name';
        lastNameValidation = false;
        return;
    }
    //only valid characters
    for (var i = 0; i < last.length; i++) {
        if (!((last.charAt(i) >= 'a' && last.charAt(i) <= 'z'))) {
            ln.parentElement.style.border = '1px solid red';
            ln.previousElementSibling.style.display = 'initial';
            document.getElementById('ln-span').innerHTML = 'Please enter a valid name';
            lastNameValidation = false;
            return;
        } 
    }
    ln.parentElement.style.border = '1px solid green';
    document.getElementById('ln-span').innerHTML = '';
    ln.previousElementSibling.style.display = 'none';
    lastNameValidation = true;
}

function validateForm () {
    if (passwordValidation && confirmPassValidation && emailValidation && contactValidation && firstNameValidation && lastNameValidation) {
        alert('Sign Up successful!');
        createNewUser();
    }
    else {
        alert('Please try again!');
    }
}

function createNewUser () {
    var user = {}; userC = {};
    user.first = fn.value;
    user.last = ln.value;
    user.email = email.value.toLowerCase();
    user.contact = num.value;
    user.password = password.value;
    user.messages = [];
    userC.email = email.value.toLowerCase();
    userC.password = password.value;
    var userStr = JSON.stringify(user);
    var userStrC = JSON.stringify(userC);
    var conStr = '' + num.value; 
    localStorage.setItem(email.value.toLowerCase(), userStr);
    localStorage.setItem(conStr, userStrC);
    setUsercount('User count: ', localStorage.length/2);
}

function validateUser() {
    var username = document.getElementById('li-username');
    var pass =  document.getElementById('li-password');
    if (localStorage.getItem(username.value.toLowerCase()) === null) {
        username.parentElement.style.border = '1px solid red';
        username.previousElementSibling.style.display = 'initial';
        document.getElementById('username-span').innerHTML = 'The email address or phone number that you\'ve entered doesn\'t match any account.';
        return false;
    }
    username.parentElement.style.border = '1px solid green';
    username.previousElementSibling.style.display = 'none';
    document.getElementById('username-span').innerHTML = '';
    var user = JSON.parse(localStorage.getItem(username.value));
    var userpass = user.password;
    if (userpass !== pass.value) {
        pass.parentElement.style.border = '1px solid red';
        pass.previousElementSibling.style.display = 'initial';
        document.getElementById('password-span').innerHTML = 'The password that you\'ve entered is incorrect.';
        return false;
    }
    return true;
}

function setUsercount(key, value){
    var users = document.getElementById('cur-users');
    users.innerHTML = key + ' : ' + value;
}

function intializations() {
    setUsercount('User count ', localStorage.length/2);
}

setInterval(function(){
    setUsercount('User count ', localStorage.length/2);
}, 2000);

// window.onstorage = function(e){
//     setUsercount('User count ', localStorage.length/2);
// }