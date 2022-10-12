<template>
    <v-select
        v-model="statuses"
        :items="status"
        item-text="text"
        label="Status"
        @change="selected"
        return-object
        outlined
        :class="dense?'':'rounded-form'"
        :dense="dense"
    >
        <template slot="status" slot-scope="status">
            {{ status.text }}
        </template>
    </v-select>
</template>
<script>
    export default {
        name: 'SelectStatus',
        data() {
            return {
                statuses:999,
                status:[{
                    text:'All Status',
                    value:999
                },{
                    text:'Active',
                    value:1
                },{
                    text:'Archived',
                    value:2
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
                this.statuses = this.default
            }
        }
    };
</script>