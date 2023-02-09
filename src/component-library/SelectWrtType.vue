<template>
    <v-select
        v-model="wrtType"
        :items="wrtTypes"
        item-text="text"
        label="WRT Type"
        @change="selected"
        return-object
        outlined
        :class="dense?'':'rounded-form'"
        :dense="dense"
    >
        <template slot="wrtTypes" slot-scope="wrtTypes">
            {{ wrtTypes.text }}
        </template>
    </v-select>
</template>
<script>
    export default {
        name: 'SelectWrtType',
        data() {
            return {
                wrtType:'',
                wrtTypes:[
                    {
                        text:'Delivery',
                        value:1
                    },
                    {
                        text:'Self Pickup',
                        value:2
                    }
                ],
            };
        },
        props:['default', 'dense', 'all'],
        methods: {
            selected(event) { // Select Wrt Type
                this.$emit('selected', event);
            }
        },
        created() {
            if (this.default) {
                this.wrtType = this.default
            }
            if (this.all == true) {
                this.wrtTypes=[
                    {
                        text:'All',
                        value:''
                    },
                    {
                        text:'Delivery',
                        value:1
                    },
                    {
                        text:'Self Pickup',
                        value:2
                    }
                ]
            }
        }
    };
</script>