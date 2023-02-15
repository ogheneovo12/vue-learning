const filterTodo = (arr, filterBy) => {
  if (filterBy === "completed") return arr?.filter((i) => i?.completed);
  if (filterBy === "uncompleted") return arr?.filter((i) => !i?.completed);
  return arr;
};

//from https://stackblitz.com/edit/js-unique-id?file=index.js
const createId = () => Math.floor(Date.now() * Math.random());

const STORAGE_KEY = {
  todos: "todos",
  filterBy: "filterBy",
};

export default {
  props: ["mode", "searchBy", "isdark"],
  data() {
    return {
      text: "",
      filterOptions: ["all", "completed", "uncompleted"],
      filterBy: "all",
      todos: [
        { id: "92182639515", title: "Clean house", completed: true },
        { id: "601397047204", title: "Clean house", completed: false },
        { id: "193261015849", title: "Clean house", completed: false },
        { id: "1357216206188", title: "Clean house", completed: false },
      ],
    };
  },
  methods: {
    toggleComplete(id) {
      const index = this.todos.findIndex((item) => {
        return id === item.id;
      });
      const item = this.todos[index];
      if (item) item.completed = !item.completed;
    },
    removeTodo(id) {
      this.todos = this.todos.filter((i) => i.id !== id);
    },
    addTodo() {
      this.todos.unshift({
        id: createId(),
        title: this.text,
        completed: false,
      });
      this.text = "";
    },
    clearCompleted() {
      this.todos = filterTodo(this.todos, "uncompleted");
    },
  },
  computed: {
    itemsLeft() {
      return this.todos.filter((todo) => !todo.completed).length;
    },
    filtered() {
      return filterTodo(this.todos, this.filterBy).filter((i) =>
        i.title.includes(this.text)
      );
    },
  },
  watch: {
    todos: {
      handler(newValue) {
        localStorage.setItem(STORAGE_KEY.todos, JSON.stringify(newValue));
      },
      deep: true,
    },
    filterBy(newValue) {
      localStorage.setItem(STORAGE_KEY.filterBy, newValue);
    },
  },
  created() {
    this.todos = JSON.parse(localStorage.getItem(STORAGE_KEY.todos)) || [];
    this.filterBy = localStorage.getItem(STORAGE_KEY.filterBy) || "all";
  },
  /*html*/
  template: `
     <div>
  
    <input v-model="text" placeholder="Type to search or create todo" @keyup.enter="addTodo"  class="search" :class="{ 'bg-dark':isdark, 'bg-light':!isdark, dark:isdark }"   />
       <div class="list_box " :class="{ 'bg-dark':isdark, 'bg-light':!isdark }">
       <div class="empty-list" v-if="!filtered.length">
       <h2>No Todos <span v-if="text">found for {{ text }}</span></h2>
       <p class="italic" v-if="text">press enter to create</p>

    </div>
     <ul >
     <li  class="flex" v-for="item in filtered">
     <input :checked="item.completed"  @input="event => toggleComplete(item.id) " type="checkbox" :id="item.id" />
     <label class="flex items-center text-xl" :for="item.id" :class="{'dark':!isdark}"><span :class="{'strike':item.completed }">{{ item.title }}</span></label>
     <button @click="event=> removeTodo(item.id)" class="ml-auto text-button italic text-small pointer">remove</button>
     </li>
    
     <li class="flex justify-between text-small"  :class="{ 'dark':isdark }">
     <span>{{ itemsLeft }} items left </span>
      <ul class="flex hidden sm:flex">
         <li  v-for="option in filterOptions" @click="filterBy = option"  class="capitalize px-2 pointer" :class="{ 'filter-active':filterBy === option}" >
            {{ option }} 
         </li>
      </ul>
      <button  @click="event=>  clearCompleted()" class="text-button pointer">Clear completed</button>
     </li>
     </ul>

     <ul class="flex mobile-filter sm:hidden justify-center items-center" :class="{ 'bg-dark':isdark, 'bg-light':!isdark }">
     <li  v-for="option in filterOptions" @click="filterBy = option"  class="capitalize px-2 pointer" :class="{ 'filter-active':filterBy === option}" >
        {{ option }} 
     </li>
  </ul>
 
  </div>
     </div>
  
  `,
};
