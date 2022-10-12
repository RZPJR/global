<template>
    <v-select
        :items="items"
        item-text="text"
        label="Customer Group"
        @change="selected"
        return-object
        outlined
        :dense="dense"
        :class="dense?'':'rounded-form'"
        :error-messages="error"
    >
        <template v-slot:label>
            <div class="select-item">
            <span>Customer Group<span :class="disabled?'':'text-red'">*</span></span>
            </div>
        </template>
    </v-select>
</template>
<script>
    export default {
        name: 'SelectCustomerGroup',
        data() {
            return {
                items:[{
                    text:'Outlet',
                    value:1
                },{
                    text:'Agent',
                    value:2
                }],
            };
        },
        props: ['error', "dense"],
        methods: {
            selected(event) {
                this.$emit('selected', event);
            }
        },
    };
</script>