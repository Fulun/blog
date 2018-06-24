var animalInfo = document.getElementById('animal-info');
var btn = document.getElementById('btn');

var count = 1;
//we will only run our Ajax call when that event is triggered
btn.addEventListener('click', function () {
    var ourRequest = new XMLHttpRequest();

//第一个参数：send data or receive data. 若是send data 则用‘POST’，若是receive data 则用“GET”
    ourRequest.open('GET', 'https://learnwebcode.github1.io/json-example/animals-' + count + '.json');

//once the data is loaded what should happen?
    ourRequest.onload = function () {
        if (ourRequest.status >= 200 && ourRequest.status < 400) {
            //告诉浏览器，返回的内容按照json解析，否则（不加JSON.parse()）按照长字符串解析。
            var ourData = JSON.parse(ourRequest.responseText);
            //write code here that add HTML to the page
            HTMLRender(ourData);
        } else {
            console.log("we connect to a server but it returned an error");
        }
    };

    ourRequest.onerror = function () {
        console.log("Connection error");
    };
    ourRequest.send();
    count++;
    if (count > 3) {
        //给按钮增加一个CSS class用来隐藏button
        btn.classList.add("hide-me");
    }
});

function HTMLRender(data) {
    var htmlString = "";
    for (i = 0; i < data.length; i++) {
        htmlString += "<p>" + data[i].name + " is a " + data[i].species + " that likes to eat ";

        for (ii = 0; ii < data[i].foods.likes.length; ii++) {
            //第一个不需要加add 后续需要加add
            if (ii == 0) {
                htmlString += data[i].foods.likes[ii];
            } else {
                htmlString += " and " + data[i].foods.likes[ii];
            }
        }

        htmlString += " and dislikes ";

        for (ii = 0; ii < data[i].foods.dislikes.length; ii++) {
            //第一个不需要加add 后续需要加add
            //划重点，记着
            if (ii == 0) {
                htmlString += data[i].foods.dislikes[ii];
            } else {
                htmlString += " and " + data[i].foods.dislikes[ii];
            }
        }

        htmlString += ".</p>";
    }
    animalInfo.insertAdjacentHTML('beforeend', htmlString);
}




