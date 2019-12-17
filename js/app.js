//app.js TODO APP
// by Francisco Sosa
//


let elementsActives=1;
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var dataBase = null;
function startDB() {

    dataBase = indexedDB.open(["listTaskIncompleteDB", "listTaskCompleteDB"], 1);

    dataBase.onupgradeneeded = function (e) {

        active = dataBase.result;
        listTaskIncompleteDB = active.createObjectStore("tasks", { keyPath: 'id', autoIncrement: true });
        listTaskIncompleteDB.createIndex('by_task', 'task', { unique: false });
        listTaskCompleteDB = active.createObjectStore("tasksComplete", { keyPath: 'id', autoIncrement: true });
        listTaskCompleteDB.createIndex('by_task', 'task', { unique: false });

    };

    dataBase.onsuccess = function (e) {
        console.log('Base de datos cargada correctamente');
        loadTasks();
        loadTasksComplete();
    
    };

    dataBase.onerror = function (e) {
        alert('Error cargando la base de datos');
    };
}
//events CRUD   Jquery ---------------------------------------------------------------

//event add DB
$('#btnAdd').click(function () {

    var active = dataBase.result;
    var data = active.transaction(["tasks"], "readwrite");
    var data_tasks = data.objectStore("tasks");
    if ($('#input-add-task').val() != "" && $('#input-add-task').val() != "") {


        var request = data_tasks.put({
            task: $('#input-add-task').val()  //something like that
        });

        request.onerror = function (e) {
            alert(request.error.name + '/n/n' + request.error.messsage);
        }

        data.oncomplete = function (e) {
            console.log("added!");
            cleanField();
            loadTasks();
            

        }
    } else { alert("The field is empty"); }
});

function cleanField() {
    $('#input-add-task').val("")
}
//add listcomplete
function addListComplete(dataToTranser) {
    var active = dataBase.result;
    var data = active.transaction(["tasksComplete"], "readwrite");
    var data_tasks = data.objectStore("tasksComplete");

    var request = data_tasks.put({
        task: dataToTranser  //something like that
    });

    request.onerror = function (e) {
        alert(request.error.name + '/n/n' + request.error.messsage);
    }

    data.oncomplete = function (e) {
        console.log("added to listcomplete")
        loadTasksComplete();

    }
}
//event clean field
$('#btnClean').click(function () {
    console.log("clean field");
    cleanField();

})

function loadTasks() {
    elementsActives =1;
    let active = dataBase.result;
    let data = active.transaction(['tasks'], 'readonly');
    let object = data.objectStore('tasks');
    var elements = [];
    object.openCursor().onsuccess = function (e) {
        var result = e.target.result;
        if (result === null) {
            return;
        }
        elements.push(result.value);
        
        result.continue();

    };
    data.oncomplete = function () {
        var outerHTML = '';

        for (var key in elements) {
            elementsActives++;
            console.log(elementsActives);
            outerHTML +=
                "<div class='row container-fluid'>" +
                "<div class = col-9>" +
                "<li id='onlytask' class='list-group-item'><b>" + elements[key].task + "</b> " +
                "</li></div> <div class = 'col-3'>" +
                "<button type='button' onclick='changeComplete(" + elements[key].id + ")' class='btn btn-success btn-sm'><i class='fas fa-check'></i></button>" +
                "<button type='button' onclick='deleteTask(" + elements[key].id + ")' class='btn btn-danger btn-sm'><i class='fas fa-trash'></i></button></div></div>"
        }
        elements = [];

        document.querySelector('#listTasks').innerHTML = outerHTML;
    }
    updateProgressBar();
}

//load Task Comlete
function loadTasksComplete() {
    let active = dataBase.result;
    let data = active.transaction(['tasksComplete'], 'readonly');
    let object = data.objectStore('tasksComplete');
    var elements = [];
    object.openCursor().onsuccess = function (e) {
        var result = e.target.result;
        if (result === null) {
            return;
        }
        elements.push(result.value);
        result.continue();

    };
    data.oncomplete = function () {
        var outerHTML = '';

        for (var key in elements) {
            outerHTML +=
                "<div class='row container-fluid'>" +
                "<div class = col-9>" +
                "<li id='onlytask' class='list-group-item'><b>" + elements[key].task + "</b> " +
                "</li></div> <div class = 'col-3'>" +
                "<button type='button' onclick='deleteTaskComplete(" + elements[key].id + ")' class='btn btn-danger btn-sm'><i class='fas fa-trash'></i></button></div></div>"
        }
        elements = [];
        document.querySelector('#listComplete').innerHTML = outerHTML;
    }
}


//methods
function changeComplete(id) {
    let active = dataBase.result;
    let data = active.transaction(['tasks'], 'readonly');
    let object = data.objectStore('tasks');

    var request = object.get(id);
    deleteTask(id);

    request.onsuccess = function () {
        var result = request.result;

        if (result != undefined) {
            //añadir a lista complete
            addListComplete(result.task);
        }
    }
}

function deleteTask(id) {
    let active = dataBase.result;
    let data = active.transaction(['tasks'], 'readwrite');
    let object = data.objectStore('tasks');
    var request = object.delete(id);
    request.onsuccess = function () {
        elementsActives--;
        var result = request.result;
        loadTasks();
        if (result != undefined) {
            //añadir a lista complete
            console.log(result);

        }
    }
}

//delete completeTask
function deleteTaskComplete(id) {
    
    let active = dataBase.result;
    let data = active.transaction(['tasksComplete'], 'readwrite');
    let object = data.objectStore('tasksComplete');
    var request = object.delete(id);
    request.onsuccess = function () {
        var result = request.result;
        loadTasksComplete();
        if (result != undefined) {
            //añadir a lista complete
            console.log(result);

        }
    }
}

//control progressbar

function updateProgressBar(){
    var number = elementsActives;
    console.log("numero :"+elementsActives)
    let percent = 100 / number;
    console.log(percent)
    $("#progressBarTasks").css("width",percent);
    
       
        
         
    
}
