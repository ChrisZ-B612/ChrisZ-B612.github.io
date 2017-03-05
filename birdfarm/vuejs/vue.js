/*var MyComponent = Vue.extend({
    template: "<div>A custom component!</div>",
    replace: false
});

Vue.component("my-component", MyComponent);*/

var vm = new Vue({
    el: "#el",
    data: {
        newTodo: "Chris, Z",
        todoList: ["Add some todos"],
    },
    methods: {
        addTodo() {
            var newTodo = this.newTodo.trim();
            if (newTodo) {
                this.todoList.push(newTodo);
                this.newTodo = "";
            }
        },
        remove($index) {
            this.todoList.splice($index, 1);
        }
    },
    computed: {
        aa() {
            return this.newTodo + " computed";
        },
        bb: {get() {}, set(newVal) {}}
    },
    /* Lifecycle hooks */
    created() {/* Called after the instance is created. */},
    compiled() {},
    ready() {},
    destroyed() {},
    /* Components */
    components: {
        "tr-comp": {
            props: ["parentMsg"],
            template: "<span>parentMsg: {{parentMsg}}</span>",
            replace: false
        },
        "slot-comp": {
            template: `<div>
                           <h1>This is my component!</h1>
                           <slot>
                               This will only be displayed if there is no content to be distributed.
                           </slot>
                       </div>`
        },
        "v-for-comp": {
            props: ["item", "index"],
            template: "<span class='ml30'>{{ index }}: {{ item }}</span>"
        }
    }

});

vm.$watch("newTodo", (newVal) => {
    console.log(`newTodo: ${newVal}`);
});