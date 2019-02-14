    /* Author: Aranta Rokade
     * SWE 642 : Homework 2
     * CS Department Infomration Page 
     * */

function wrongPerson() {
    document.cookie = "name=null;" +
        " expires=Thu, 01-Jan-95 00:00:01 GMT";
    location.reload();
}

function greet() {
    var now = new Date();
    var hour = now.getHours();
    var name = undefined;

    var greeting_element = document.getElementById("greeting");
    var greeting_msg = '<b>Good ';
    if (hour < 12)
        greeting_msg += 'Morning ';
    else if (hour < 18)
        greeting_msg += 'Afternoon ';
    else
        greeting_msg += 'Evening ';

    if (getCookie("name") !== null) {
        name = getCookie("name");
    }
    else {
        while (name === null || name === undefined || name === "") {
            // set name
            name = window.prompt("Please enter your name", "Paul");
            // expiry cookie after 1 day
            var d = new Date();
            d.setDate(d.getDate + 1);
            document.cookie = "name=" + escape(name) + "; expires=" + d;
        }
    }

    greeting_msg += name + "! Welcome to Assignment#3</b><br/>";
    greeting_msg += "Click " + "<a href = 'javascript:wrongPerson()'>here</a> " +
        " if you are not " + name + ". ";
    greeting_element.innerHTML = greeting_msg;
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts[1].split(";")[0];
    else return null;
}

function calc(data) {
    var dataErrorNode = document.getElementById("data-error");
    dataErrorNode.innerHTML = "";
    document.getElementById("average").innerHTML = "";
    document.getElementById("maximum").innerHTML = "";
    data = data.replace(/(^[,\s]+)|([,\s]+$)/g, '');
    data = data.split(',');
    if (data.length !== 10) {
        dataErrorNode.innerHTML = "Enter 10 numbers";
        return false;
    }
    var count = 0;
    var sum = 0;
    var avg = 0;
    var max = 0;
    for (var x of data) {
        if (x === "") {
            dataErrorNode.innerHTML = "Enter 10 numbers";
            return false;
        }
        x = x - '0';
        if (x < 1 || x > 100) {
            dataErrorNode.innerHTML = "Enter numbers in the range [1-100].";
            return false;
        }
        else {
            count++;
            sum += x;
            if (x > max) {
                max = x;
            }
        }
    }
    avg = sum / count;
    document.getElementById("average").innerHTML = avg;
    document.getElementById("maximum").innerHTML = max;
}

function validateForm(event) {

    var alphabet = /^[A-Za-z]+$/;
    var alphabetNumeric = /^[A-Za-z0-9]+$/;
    var likesCount = 2;
    var interestCount = 1;
    var email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    var errorMessage = "";
    if (!document.getElementById("username").value.match(alphabet)) {
        errorMessage += "Username should contain only Alphabets. \n";
        document.getElementById("username").value = "";
    }
    if (!document.getElementById("address").value.match(alphabetNumeric)) {
        errorMessage += "Street Address should contain only appropriate numeric, alphabet or alphanumeric characters. \n";
        document.getElementById("address").value = "";
    }
    if (!document.getElementById("email").value.match(email)) {
        errorMessage += "Email Id. should be valid. \n";
        document.getElementById("email").value = "";
    }
    var likes = document.getElementsByName("likes");
    var count = 0;
    for (var i = 0; i < likes.length; i++) {
        if (likes[i].checked) {
            count++;
        }
    }
    if (count < likesCount) {
        errorMessage += "Check atleast 2 likes about GMU. \n";
    }
    
    var interest = document.getElementsByName("interest");
    count = 0;
    for (var i = 0; i < interest.length; i++) {
        if (interest[i].checked) {
            count++;
        }
    }
    if (count !== interestCount) {
        errorMessage += "Check an interest at GMU. \n";
    }

    if (errorMessage !== "") {
        alert(errorMessage);
        event.preventDefault();
        return false;
    } else { 
        alert("Feedback submitted!");
        return true;
    }
}

function resetForm() {
    document.getElementById('city').innerHTML = "";
    document.getElementById('state').innerHTML = "";
    document.getElementById("zipcode-error").innerHTML = "";
    document.getElementById("average").innerHTML = "";
    document.getElementById("maximum").innerHTML = "";
    document.getElementById("data-error").innerHTML = "";
}

function validateZip(zip) {
    try {
        var asyncRequest = new XMLHttpRequest();
        asyncRequest.onreadystatechange = function () {
            callBack(zip, asyncRequest);
        };
        asyncRequest.open("GET", "http://mason.gmu.edu/~arokade/swe642/HW3/zipcodes.json", true);
        asyncRequest.withCredentials = true;
        asyncRequest.send();
    }
    catch (exception) {
        alert("Request failed.");
    }
}

function callBack(zip, asyncRequest) {
    document.getElementById("zipcode-error").innerHTML = "Checking zip...";
    document.getElementById('city').innerHTML = "";
    document.getElementById('state').innerHTML = "";
    if (asyncRequest.readyState == 4) {
        if (asyncRequest.status == 200 || asyncRequest.status == 304) {
            var data = JSON.parse(asyncRequest.responseText);
            result = isValid(zip, data)
            if (result.valid) {
                document.getElementById('zipcode-error').innerHTML = '';
                document.getElementById('city').innerHTML = result.city;
                document.getElementById('state').innerHTML = result.state;
            } else {
                document.getElementById("zipcode-error").innerHTML="Invalid Zip Code.";
            }
        }
    }
}

function isValid(zip, data) {
    var zipcodes = data.zipcodes;
    for (var element of zipcodes) {
        if(element.zip === zip) {
            return {
                valid: true,
                city: element.city,
                state: element.state
            };
        }
    }
    return {
        valid: false
    };
}