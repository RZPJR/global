<template>
    <v-select
        v-model="wrt"
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
                wrt:'',
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
        props:['wrtType', 'dense', 'all'],
        methods: {
            selected(event) { // Select Wrt Type
                this.$emit('selected', event);
            },
            getData() {
                if (this.all == true) {
                    this.wrtTypes.unshift({
                        text:'All',
                        value:''
                    })
                }
            },
            setWrt() {
                this.wrtTypes.forEach(e => {
                    if (e.value == this.wrtType) {
                        this.wrt = e
                    }
                });
            }
        },
        created() {
            this.getData()
            if (this.wrtType) {
                this.setWrt()
            }
        },
        watch: {
            wrtType: {
                handler: function (val) {
                    if(val){
                        this.setWrt()
                    }
                },
                deep: true
            },
        }
    };
</script>