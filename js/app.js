//app.js TODO APP
// by Francisco Sosa
//


//declaraciones

let tasks = [];
let taskComplete = [{}]

// methods 

function cleanField() {
  $('#input-add-task').val("")
}

function updateListTasks() {

  clearList(no = 1);
  for (let i = 0; i <= tasks.length-1; i++) {
    $("#listTasks").append(
      "<div class='row'>"+
      "<div class = col-9>"+
      "<li id='onlytask' class='list-group-item'><b>" + tasks[i] + "</b> " +
      "</li></div> <div class = 'col-3'>"+
      "<button type='button id='completeButton' class='btn btn-success btn-sm'><i class='fas fa-check'></i></button>"+
      "<button type='button id='deleteButton' class='btn btn-danger btn-sm'><i class='fas fa-trash'></i></button></div></div>"
      );
  }
  cleanField();
}

function updateListCompleteTask() {

  clearList(no = 2);
  for (let i = 0; i < tasksComplete.length; i++) {
    $("#listComplete").append("<li id='onlyTaskComplete' class='list-group-item'><b>" + tasksComplete[i] + "</b>" +
    "<button type='button' class='btn btn-primary btn-sm'><i class='fas fa-trash'></i></button>"+
      "</li>");
  }

}

function clearList(idList) {
  if (idList == 1) {
    $('li[id="onlytask"]').remove();
  } else if (idList == 2) {
    $('li[id="onlyTaskComplete"]').remove();
  }
}




//Jquery
//btn add task
$('#btnAdd').click(function () {
  console.log("add task");
  let contentInputAddTask = $('#input-add-task').val();
  tasks.push(contentInputAddTask);
  updateListTasks();
})
//btn clean field 
$('#btnClean').click(function () {
  console.log("clean field");
  cleanField();
})

$('#completeButton').click(function(){
  console.log("completada")
})
$('#deleteButton').click(function(){
  console.log("borrada")
})

