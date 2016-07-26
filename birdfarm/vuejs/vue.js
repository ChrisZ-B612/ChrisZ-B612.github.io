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
        "my-component": {
            props: ["parentMsg"],
            template: "<span>{{parentMsg}}</span>",
            replace: false
        }
    }

});

vm.$watch("newTodo", (newVal) => {
    console.log(`newTodo: ${newVal}`);
});