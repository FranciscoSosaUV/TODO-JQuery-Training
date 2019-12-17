//app.js TODO APP
// by Francisco Sosa
//

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
    updateProgressBar()
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
                "<li id='onlytask' class='list-group-item list-group-item-success'><b>" + elements[key].task + "</b> " +
                "</li></div> <div class = 'col-3'>" +
                "<button type='button' onclick='deleteTaskComplete(" + elements[key].id + ")' class='btn btn-danger btn-sm'><i class='fas fa-trash'></i></button></div></div>"
        }
        elements = [];
        document.querySelector('#listComplete').innerHTML = outerHTML;
        
    }
    updateProgressBar()
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
    var ltasksComplete=[];
    var ltasks=[];
   
    let active = dataBase.result;
    let dataTasksComplete = active.transaction(['tasksComplete'], 'readwrite');
    let completeTasks = dataTasksComplete.objectStore('tasksComplete');
    
    let dataTasks = active.transaction(['tasks'], 'readwrite');
    let tasks = dataTasks.objectStore('tasks');
    var request = tasks.getAll();
    var request2 = completeTasks.getAll();


    request.onsuccess = function () {
         ltasks = request.result;
        if (ltasks != undefined) {
            //añadir a lista complete
            console.log("tasks: ",ltasks.length);

        }
    }

    request2.onsuccess = function () {
         ltasksComplete = request2.result;
        if (ltasksComplete != undefined) {
            //añadir a lista complete
            console.log("complete tasks: ",ltasksComplete.length);

        }
    if(ltasks.length!=NaN && ltasksComplete.length != NaN){
    var totalTask = ltasks.length+ltasksComplete.length;
    console.log("tareas totales: "+totalTask);
    var number = (ltasksComplete.length*100)/totalTask; //promedio
    console.log("porcentaje: "+number);
    if(number !=0){
    console.log("numero :"+number)
    let percent = number;
    console.log(percent)
    $("#progressBarTasks").css("width",percent +"%");
    }
    else {$("#progressBarTasks").css("width",0);}

    }
}
    
       
        
         
    
}
