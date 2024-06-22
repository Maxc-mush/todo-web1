const todoInputEl = document.querySelector('input')
const todosContainerEl = document.querySelector('.todos-container')
const noTodoMessage = document.querySelector('#no-todos-message')
const allTodosTab = document.getElementById('all-todos-tab')
const completedTodosTab = document.getElementById('completed-todos-tab')
const uncompletedTodosTab = document.getElementById('uncompleted-todos-tab')
const uncompletedBadge = document.getElementById('uncompleted-todos-badge')

const getAllTodos = () => {
    const data = localStorage.getItem('TODOS-DATA')
    return data ? JSON.parse(data) : [];
}

let allTodos = getAllTodos()
let currentFilter = 'all'

const createTodoEl = (todo, index) => {
    const todoEl = document.createElement('li')
    todoEl.classList.add('each-todo')
    todoEl.innerHTML = `<label for="todo-${index}">
    <input type="checkbox" name="todo-${index}" id="todo-${index}">
    ${todo.text}
    </label>
    <span data-index='${index}' class="todo-del"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="18px" width="18px" fill="currentColor"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg></span>`

    const removeBtn  = todoEl.querySelector('span')
    removeBtn.addEventListener('click', () => {
        removeTodo(index)
    })

    const checkBox = todoEl.querySelector('input')
    checkBox.checked = todo.completed
    checkBox.addEventListener('change', () => {
        allTodos[index].completed = checkBox.checked
        saveTodos()
        updateDisplay()
    })

    return todoEl
}

const saveTodos = () => {
    const stringData = JSON.stringify(allTodos)
    localStorage.setItem('TODOS-DATA', stringData)
}

const updateDisplay = () => {
    todosContainerEl.innerHTML = ''

    const filteredTodos = filterTodos(currentFilter)
    filteredTodos.forEach((todo, index) => {
        const todoEl = createTodoEl(todo, index)
        todosContainerEl.appendChild(todoEl)
    })

    noTodoMessage.classList.toggle('hidden', allTodos.length > 0)
    updateCounts()
}

const updateCounts = () => {
    const uncompleted = allTodos.filter(todo => !todo.completed).length
    uncompletedBadge.textContent = uncompleted
}

const filterTodos = (filter) => {
    switch (filter) {
        case 'completed': 
            return allTodos.filter(todo => todo.completed)
        case 'uncompleted': 
            return allTodos.filter(todo => !todo.completed)
        case 'all': 
            return allTodos
        default:
            return allTodos
    }
}

const addTodo = () => {
    const newTodo = todoInputEl.value.trim()
    const todoOj = {
        text: newTodo,
        completed: false
    }
    allTodos.unshift(todoOj)
    saveTodos()
    updateDisplay()
    todoInputEl.value = ''
}

const removeTodo = (index) => {
    allTodos.splice(index, 1)
    saveTodos()
    updateDisplay()
}

const selectActiveTab = (button) => {
    document.querySelectorAll('.todo-tabs button').forEach(tab => tab.classList.remove('active'))
    button.classList.add('active')
}

todoInputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo()
    }
})

allTodosTab.addEventListener('click', () => {
    currentFilter = 'all'
    selectActiveTab(allTodosTab)
    updateDisplay()
})

completedTodosTab.addEventListener('click', () => {
    currentFilter = 'completed'
    selectActiveTab(completedTodosTab)
    updateDisplay()
})

uncompletedTodosTab.addEventListener('click', () => {
    currentFilter = 'uncompleted'
    selectActiveTab(uncompletedTodosTab)
    updateDisplay()
})

//initial display of todos
updateDisplay()