<template>
    <v-autocomplete
        v-model="order_channel"
        :items="items"
        :loading="isLoading"
        item-text="note"
        label="Order Channel"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        return-object
        outlined
        :placeholder="placeholder"
        :dense="dense"
        class="multi"
        required
        :error-messages="error"
        multiple
        clearable
        deletable-chips
        chips
    >
        <template v-slot:label>
            <div v-if="label">
                <span v-if="!norequired">{{ label }}<span class="text-red">*</span></span>
                <span v-else>{{ label }}</span>
            </div>
            <div v-else>
                <span v-if="!norequired">Order Channel<span class="text-red">*</span></span>
                <span v-else>Order Channel</span>
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.note }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectOrderChannel',
        data() {
            return {
                items: [],
                placeholder : '',
                isLoading: false,
                search:'',
                order_channel:[]
            };
        },
        props: ['disabled','clear','error','dense','norequired','attribute','table','order_channels','label'],
        methods: {
            remoteSearch() {
                this.items = []
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/configuration/v1/glossary",{params:{
                    perpage:10,
                    table:this.table,
                    attribute:this.attribute,
                }}).then(response => {
                    if (response.data.data && response.data.data != null) {
                        this.items = response.data.data;
                    } else {
                        this.items = [];
                    }

                    this.isLoading = false
                    let label = 'Glossary'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.order_channel= []
                    for (let i = 0; i < val.length; i++) {
                        this.order_channel.push(val[i])
                    }
                }
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted() {
            this.remoteSearch();
        },
        watch:{
            order_channel: {
                handler: function () { // watch perubahan untuk auto select
                    this.search = ''
                },
                deep: true
            },
            order_channels: {
                handler: function (val) {
                    if(val !== null){ // ini untuk auto select
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
        }
    };
</script>
