<template>
    <v-autocomplete
        v-model="customers"
        :item-text="textList"
        @change="selected"
        @click:clear="remoteSearch('')"
        return-object
        clearable
        outlined
        :items="items"
        :name="data_name"
        :loading="isLoading"
        :search-input.sync="search"
        :placeholder="placeholder"
        :disabled="disabled"
        :dense="dense"
        :class="dense?'':'rounded-form'"
        :error-messages="error"
    >
        <template v-slot:label>
            <div v-if="label">
                <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
                <span v-else>{{ label }}</span>
            </div>
            <div v-else>
                <span v-if="!norequired">Customer<span :class="disabled?'':'text-red'">*</span></span>
                <span v-else>Customer</span>
            </div>
        </template>
        <template slot="selection" slot-scope="data">
            <div class="select-item" >
                {{ data.item.customer_code }} - {{ data.item.name }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.customer_code }} - {{ data.item.name }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectCustomer',
        data() {
            return {
                items: [],
                isLoading: false,
                search:'',
                data_name:'',
                placeholder : '',
                customers:{}
            };
        },
        props: ['customer','disabled','clear','label','error', 'norequired', 'name', 'dense','customer_type', 'not_call_api'],
        methods: {
            // For show dropdown suggestion search by code or name
            textList(item){
                return item.customer_code + ' — ' + item.name
            },
            // For get all data from API
            async remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true
                this.items = []
                await this.$http.get("/crm/v1/customer",{params:{
                    per_page:10,
                    search:search,
                    status:1,
                    customer_type: this.customer_type,
                }}).then(response => {
                    if(response && response.data.data !== null) {
                        this.items = response.data.data
                    }
                    let label = this.label ? this.label : 'Customer'
                    this.placeholder = "Select "+ label
                });
                this.isLoading = false
            },
            // For request by value id (Page update & etc)
            autoSelectByID(val) {
                if(val.id){
                    this.$http.get("/crm/v1/customer/"+val.id)
                    .then(response => {
                        this.items.push(response.data.data)
                        this.customers = response.data.data
                    });
                }
            },
            // For Pass Selected Value
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted() {
            if(this.customer){
                this.autoSelectByID(this.customer)
            }
            if(!this.not_call_api){
                this.remoteSearch('')
            }
            if (!this.name) {
                this.data_name = 'customer'
            } else {
                this.data_name = this.name
            }
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        let that = this
                        clearTimeout(this._timerId)
                        this._timerId = setTimeout(function(){
                            that.remoteSearch(val)
                        }, 1000);
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.customers = null
                },
                deep: true
            },
            customer: {
                handler: function (val) {
                    if(val){ // ini untuk auto select
                        this.autoSelectByID(val)
                    } else {
                        this.customers = null
                    }
                },
                deep: true
            },
        },
    };
</script>