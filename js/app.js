;
(function(exports) {
  var filters = {
    all: function(todos) {
      return todos
    },
    active: function(todos) {
      return todos.filter(function(todo) {
        return !todo.completed
      })
    },
    completed: function(todos) {
      return todos.filter(function(todo) {
        return todo.completed
      })
    }
  }
  exports.app = new Vue({
    el: '#todoapp',
    data: {
      todos: todoStorage.fetch(),
      newTodo: '',
      editingTodo: null,
      beforeEditCache: '',
      visibility: 'all'
    },
    // http://vuejs.org/guide/computed.html
    computed: {
      filteredTodos: function() {
        return filters[this.visibility](this.todos)
      },
      // 未完成的 item 数量
      activeItemNum: function() {
        return filters.active(this.todos).length
      },
      completedItemNum: function() {
        return filters.completed(this.todos).length
      },
      allStatus: {
        get: function() {
          return this.activeItemNum === 0
        },
        set: function(isCompleted) {
          this.todos.forEach(function(todo) {
            todo.completed = isCompleted
          })
        }
      }
    },
    methods: {
      // 新增
      create: function() {
        var title = this.newTodo.trim()
        if (title) {
          this.todos.push({
            id: Date.now(),// 用当前时间戳做为id
            title: title,
            completed: false
          })
        }
        this.newTodo = ''
      },
      // 进入编辑的状态
      edit: function(todo) {
        this.beforeEditCache = todo.title
        this.editingTodo = todo
      },
      cancelEdit: function(todo) {
        this.editingTodo = null
        todo.title = this.beforeEditCache
      },
      // 修改
      update: function(todo) {
        if (!this.editingTodo) {
          return
        }
        this.editingTodo = null
        todo.title = todo.title.trim()
        if (!todo.title) {
          this.remove(todo.id)
        }
      },
      // 删除
      remove: function(id) {
        this.todos = this.todos.filter(function(todo) {
          return todo.id !== id
        })
      },
      removeAllCompleted: function() {
        this.todos = filters.active(this.todos)
      }
    },
    // 每当 todos 变化时，保存todos
    watch: {
      todos: {
        deep: true,
        handler: todoStorage.save
      }
    },
    /*
     * 自定义指令 https://cn.vuejs.org/v2/guide/custom-directive.html
     */
    directives: {
      // 编辑todo时，让 input 获得焦点
      'todo-focus': function(el, bind) {
        var isEdit = bind.value
        if (isEdit) {
          // DOM 更新后再 focus
          Vue.nextTick(function() {
            el.focus()
          })
        }
      }
    }
  })
})(window)
