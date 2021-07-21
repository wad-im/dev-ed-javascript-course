// Selectors

const toDoInput = document.querySelector('.todo-input');
const toDoButton = document.querySelector('.todo-button');
const toDoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo')
let todos

// Event Listeners
document.addEventListener('DOMContentLoaded', getTodos)
toDoButton.addEventListener('click', addToDo);
toDoList.addEventListener('click', deleteCheck);
filterOption.addEventListener('click', filterToDo);

const localStorageCheck = ()=> {}

// Functions
function addToDo(event){
    event.preventDefault();

    const toDoDiv = document.createElement('div');
    toDoDiv.classList.add('todo');

    const newToDo = document.createElement('li');
    newToDo.innerText = toDoInput.value;
    saveLocalTodos(toDoInput.value);
    newToDo.classList.add('todo-item');
    toDoDiv.appendChild(newToDo);
        
    const completeButton = document.createElement('button');
    completeButton.innerHTML = '<i class="fas fa-check"></i>';
    completeButton.classList.add('complete-btn');
    toDoDiv.appendChild(completeButton);

    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add('trash-btn');
    toDoDiv.appendChild(trashButton);

    toDoList.appendChild(toDoDiv);
    toDoInput.value = '';
}


function deleteCheck (e){
    const item = e.target;
    if (item.classList[0] === "trash-btn"){
        const toDo = item.parentElement;
        toDo.classList.add('fall')
        removeLocalTodos(toDo)
        toDo.addEventListener('transitionend', function(){
            toDo.remove()
        })
        
    }
    if (item.classList[0] === "complete-btn"){
        const toDo = item.parentElement;
        toDo.classList.toggle('completed')
    }
}

function filterToDo(e){
    const toDos = toDoList.childNodes
    console.log(toDos)
    toDos.forEach(function(toDo){
        switch (e.target.value) {
            case "all":
                toDo.style.display = "flex"
                break;
            case "completed":
                if(toDo.classList.contains('completed')){
                    toDo.style.display = "flex"
                } else {
                    toDo.style.display = "none"
                }
                break;
            case "uncompleted":
                if(!toDo.classList.contains('completed')){
                    toDo.style.display = "flex"
                } else {
                    toDo.style.display = "none"
                }
                break;        
            }
    })     
}

function saveLocalTodos(todo){
    let todos;
    if (localStorage.getItem('todos') === null){
        todos = [];
        } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos(){
    let todos;
    if (localStorage.getItem('todos') === null){
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.forEach(function(todo){
        const toDoDiv = document.createElement('div');
    toDoDiv.classList.add('todo');

    const newToDo = document.createElement('li');
    newToDo.innerText = todo
    newToDo.classList.add('todo-item');
    toDoDiv.appendChild(newToDo);
        
    const completeButton = document.createElement('button');
    completeButton.innerHTML = '<i class="fas fa-check"></i>';
    completeButton.classList.add('complete-btn');
    toDoDiv.appendChild(completeButton);

    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add('trash-btn');
    toDoDiv.appendChild(trashButton);

    toDoList.appendChild(toDoDiv);
    })
}

function removeLocalTodos(todo){
    let todos;
    if (localStorage.getItem('todos') === null){
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    const todoIndex = todo.children[0].innerText;
    todos.splice(todos.indexOf(todoIndex), 1);
    localStorage.setItem("todos", JSON.stringify(todos));
}