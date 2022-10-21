<template>
    <v-select
        v-model="taskType"
        :items="task_type"
        item-text="text"
        label="Task Type"
        @change="selected"
        return-object
        outlined
        :class="dense?'':'rounded-form'"
        :dense="dense"
    >
        <template slot="task_type" slot-scope="task_type">
            {{ task_type.text }}
        </template>
    </v-select>
</template>
<script>
    export default {
        name: 'SelectTaskTipe',
        data() {
            return {
                taskType:1,
                task_type:[{
                    text:'Visit',
                    value:1
                },{
                    text:'Follow Up',
                    value:2
                },{
                    text:'Customer Acquisition',
                    value:3
                }],
            };
        },
        props:['default', 'dense'],
        methods: {
            selected(event) {
                this.$emit('selected', event);
            }
        },
        created() {
            if (this.default) {
                this.taskType = this.default
            }
        }
    };
</script>