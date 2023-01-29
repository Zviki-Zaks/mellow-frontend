<template>
  <section v-if="task" class="td-checklist-preview">
    <div v-for="(checklist, checklistIdx) in task.checklists" :key="checklistIdx">
      <div class="checklist-title-container">
        <h3 class="checklist-title">{{ checklist.title }}</h3>
        <a class="delete-checklist btn" @click.stop="removeChecklist(checklist.id)">Delete</a>
      </div>
      <span class="progress-bar-percentage">{{ progressBar[checklistIdx] }}%</span>
      <div class="progress-bar-container flex">
        <div class="checklist-pb-full">
          <div class="checklist-progress-bar" :style="{
            width: progressBar[checklistIdx] + '%', opacity: progressBar[checklistIdx]
          }" :class="{ green: progressBar[checklistIdx] === '100' }"></div>
        </div>
      </div>
      <div v-for="(todo) in checklist.todos" :key="todo.id">
        <div class="checklist-todo-title">
          <label class="todo-content-edit pointer" for="todo.id"></label>
          <input @click.stop="checkboxValue(checklist.id, todo, $event)" class="checkbox-input pointer" type="checkbox"
            name="todo.isDone" id="todo.id" value="todo.isDone" :checked="todo.isDone" />
          <textarea @click.stop="openUpdateBar(todo.id)" class="todo-clickable-area"
            @blur="updateTodo(checklist.id, todo.id, $event)" spellcheck="false" cols="100" rows="20"
            v-model="todo.title" ref="textarea"></textarea>
          <div v-if="editingTodoId === todo.id" class="update-todo-btn-container">
            <div class="update-todo-btn flex">
              <a class="update-todo-text btn">Save</a>
              <span @click="closeCreateTodo" class="close-update pointer"></span>
            </div>
            <div class="remove-todo-btn-wrapper">
              <span @mousedown="removeTodo(checklist.id, todo.id)" class="remove-todo-btn pointer"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- <p>******THIS AREA IS WHEN CLICKING ON ADD AN ITEM BTN</p> -->
      <div v-if="!addNewTodo" class="add-todo-container">
        <button class="add-an-item btn" @click.stop="createTodo(checklist.id)">Add an item</button>
      </div>
      <div class="add-item-container" v-if="addNewTodo === checklist.id" @blur="createTodo">
        <div>
          <textarea class="add-item-input" v-focus placeholder="Add an item" type="text" v-model="newTodo" cols="30"
            rows="10"></textarea>
          <div class="todo-btn-container">
            <button class="add-todo btn" @click.stop="addTodo(checklist.id)">Add</button>
            <div class="close-btn-wrapper">
              <a @click.stop="closeCreateTodo" class="close-add-todo-btn pointer"></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    task: Object,
  },
  data() {
    return {
      isCreateTodo: false,
      newTodo: [],
      isCheckbox: [],
      isUpdateTodo: false,
      editingTodoId: '',
      addNewTodo: '',
      isDonePercentages: [],
      todoCount: [],
      isRemove: false,
      checklistId: ''
    }
  },
  methods: {
    createTodo(checkListId) {
      this.addNewTodo = checkListId
    },
    addTodo(checklistId) {
      console.log(this.newTodo);
      if (!this.newTodo || !this.newTodo.length) return
      this.$emit('addTodo', this.newTodo, checklistId)
      this.newTodo = ''
    },
    removeChecklist(checklistId) {
      this.$emit('removeChecklist', checklistId)
    },
    updateTodo(checklistId, todoId, ev) {
      ev.stopPropagation();
      const textValue = ev.currentTarget.textContent;
      if (!textValue || !textValue.length) {
        this.editingTodoId = ''
        this.addNewTodo = ''
        return
      }
      this.$emit('updateTodo', checklistId, todoId, textValue)
      this.editingTodoId = ''
      this.addNewTodo = ''
    },
    removeTodo(checklistId, todoId) {
      this.$emit('removeTodo', checklistId, todoId)
    },
    openUpdateBar(todoId) {
      this.editingTodoId = todoId
      this.addNewTodo = ''
    },
    closeCreateTodo() {
      this.editingTodoId = ''
      this.addNewTodo = ''
    },
    checkboxValue(checklistId, todo, ev) {
      const todoId = todo.id
      const checkboxVal = ev.target.checked
      this.$emit('updateTodoDone', checklistId, todoId, checkboxVal)
    },
  },
  computed: {
    progressBar() {
      let isDonePercentages = []

      this.task.checklists.forEach(checklist => {
        let isDoneCount = 0
        let todoCount = checklist.todos.length
        if (todoCount === 0) {
          isDonePercentages.push(0)
          return
        }
        checklist.todos.forEach(todo => {
          if (todo.isDone) isDoneCount++
        })
        const percentage = (isDoneCount / todoCount) * 100
        isDonePercentages.push(percentage.toFixed(0))

      })
      this.isDonePercentages = isDonePercentages
      return isDonePercentages
    },
    todoDone() {
      return this.task.checklists.forEach(checklist => {
        checklist.todos.filter(todo => {
          if (todo.isDone) return 'task-done'
          else 'task-incomplete'
        })
      })
    }
  },
}
</script>
