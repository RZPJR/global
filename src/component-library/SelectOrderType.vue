<template>
    <v-autocomplete
        v-model="ordertypes"
        :items="items"
        :loading="isLoading"
        item-text="name"
        name="ordertype"
        :search-input.sync="search"
        :placeholder="placeholder"
        @change="selected"
        :disabled="disabled"
        return-object
        :dense="dense"
        clearable
        outlined
        :class="dense?'':'rounded-form'"
        :error-messages="error"
    >
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.name }}
            </div>
        </template>
            <template v-slot:label>
                <div v-if="label">
                   <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
                   <span v-else>{{ label }}</span>
                </div>
                <div v-else>
                   <span v-if="!norequired">Order Type<span :class="disabled?'':'text-red'">*</span></span>
                   <span v-else>Order Type</span>
                </div>
            </template>
        <template slot="item" slot-scope="data">
            {{ data.item.name }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectOrderType',
        data() {
            return {
                items: [],
                isLoading: false,
                placeholder : '',
                search:'',
                ordertypes:null
            };
        },
        props: ['ordertype','disabled','clear','label','error', 'norequired', "dense"],
        methods: {
            remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true
                // ini ke endpoint get all
                this.$http.get("/config/order_type/filter",{params:{
                    perpage:10,
                    conditions:'status:1|name.icontains:'+search,
                }}).then(response => {
                    if(response){
                        this.items = response.data.data
                    }
                    if(this.items === null){
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Order Type'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.$http.get("/config/order_type/filter",{params:{
                        conditions:'id.e:'+val.id,
                    }}).then(response => {
                        this.items.push(response.data.data[0])
                        this.isLoading = false
                        this.ordertypes = response.data.data[0]
                    });
                }
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        created() {
            // this.remoteSearch('');
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val)
                    } else if(!this.ordertype){
                        this.remoteSearch('');
                    }

                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.ordertypes = null;
                    if(val)this.remoteSearch('')
                },
                deep: true
            },
            ordertype: {
                handler: function (val) {
                    if(val){ // ini untuk auto select
                        this.autoSelectByID(val)
                    } else {
                        this.ordertypes = null
                    }

                },
                deep: true
            },
        },
    };
</script>
