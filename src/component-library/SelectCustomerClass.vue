<template>
    <v-autocomplete
        v-model="customer_classes"
        :items="items"
        :loading="isLoading"
        :item-text="textList"
        name="customer_class"
        :search-input.sync="search"
        :placeholder="placeholder"
        @change="selected"
        :disabled="disabled"
        return-object
        clearable
        outlined
        :dense="dense"
        :error-messages="error"
    >
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.id }} - {{ data.item.description }}
            </div>
        </template>
        <template v-if="label" v-slot:label>
            <span v-if="!norequired">
                {{ label }}<span :class="disabled?'':'text-red'">*</span>
            </span>
            <span v-else>
                {{ label }}
            </span>
        </template>
        <template v-else v-slot:label>
            <span v-if="!norequired">
                Customer Class<span :class="disabled?'':'text-red'">*</span>
            </span>
            <span v-else>
                Customer Class
            </span>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.id }} - {{ data.item.description }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectCustomerClass',
        data() {
            return {
                items: [],
                isLoading: false,
                search: '',
                customer_classes: null,
                placeholder : '',
            };
        },
        props: ['customer_class','disabled','clear','label','error', 'norequired', 'dense'],
        methods: {
            remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true

                //Getting data from endpoint
                this.$http.get("/crm/v1/customer_class",{params:{
                    page: 1,
                    per_page: 10,
                    search: search
                }}).then(response => {
                    this.items = [];
                    if (response.data.data && response.data.data !== null && response.data.data !== []) {
                        this.items = response.data.data
                    }
                    let label = 'Customer Class'
                    if (this.label) 
                    	label = this.label
                    this.isLoading = false
                    this.placeholder = "Select "+ label
                });
            },
            textList(item){
                return item.id + item.description
            },
            autoSelectByID(val) {
                if(val?.id){
                    this.$http.get("/crm/v1/customer_class/detail?id=" + val.id).then(response => {
                        if(response?.data?.data)
                            this.customer_classes = response.data.data
                            this.items.push(response.data.data)
                    });
                }else{
                    this.customer_classes = null
                }
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted() {
            this.remoteSearch();
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val)
                    } else if(!this.customer_class){
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.customer_classes = null
                    this.remoteSearch('')
                },
                deep: true
            },
            customer_class: {
                handler: function (val) {
                    if(val !== null){ // ini untuk auto select
                        this.autoSelectByID(val)
                    } else {
                        this.sales_persons = null
                    }
                },
                deep: true
            },
        },
    };
</script>