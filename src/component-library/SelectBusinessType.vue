<template>
    <v-autocomplete
        :data-unq="data_unq"
        v-model="customer_types"
        :item-text="textList"
        @change="selected"
        @click:clear="remoteSearch('')"
        return-object
        clearable
        outlined
        :items="items"
        :name="dataname"
        :loading="isLoading"
        :search-input.sync="search"
        :placeholder="placeholder"
        :disabled="disabled"
        :dense="dense"
        :class="dense?'':'rounded-form'"
        :filtered="filtered"
        :error-messages="error"
    >
        <template v-slot:label>
            <div v-if="label">
                <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
                <span v-else>{{ label }}</span>
            </div>
            <div v-else>
                <span v-if="!norequired">Customer Type<span :class="disabled?'':'text-red'">*</span></span>
                <span v-else>Customer Type</span>
            </div>
        </template>
        <template slot="selection" slot-scope="data">
            <div class="select-item" >
                {{ data.item.id }} - {{ data.item.description }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.id }} - {{ data.item.description }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectBusinessType',
        data() {
            return {
                items: [],
                isLoading: false,
                search:'',
                dataname:'',
                placeholder : '',
                customer_types:{}
            };
        },
        props: ['customer_type','disabled','clear','label','error', 'norequired', 'name', "dense", "data_unq", "filtered"],
        methods: {
            // For show dropdown suggestion search by code or description
            textList(item){
                return item.id + ' — ' + item.description
            },
            // For get all data from API
            async remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true
                this.items = []
                await this.$http.get("/crm/v1/customer_type",{params:{
                    page:1,
                    per_page:10,
                    search:search,
                    status: 1,
                }}).then(response => {
                    if(response && response.data.data !== null) {
                        this.items = response.data.data
                    }
                    let label = this.label ? this.label : 'Customer Type'
                    this.placeholder = "Select "+ label
                });
                this.isLoading = false
            },
            // For request by value id (Page update & etc)
            autoSelectByID(val) {
                if(val){
                    this.customer_types = val
                }
            },
            // For Pass Selected Value
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted() {
            if(this.customer_type){
                this.autoSelectByID(this.customer_type)
            }
            if (!this.name) {
                this.dataname = 'customer_type'
            } else {
                this.dataname = this.name
            }
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val)
                    } else if (!this.customer_type) {
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.customer_types = null
                },
                deep: true
            },
            customer_type: {
                handler: function (val) {
                    if(val){ // ini untuk auto select
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
        },
    };
</script>