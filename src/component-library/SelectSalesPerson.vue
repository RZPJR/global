<template>
    <v-autocomplete
        v-model="sales_persons"
        :items="items"
        :loading="isLoading"
        :item-text="textList"
        :placeholder="placeholder"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        :class="dense?'':'rounded-form'"
        return-object
        outlined
        :error-messages="error"
        clearable
        :dense="dense"
        no-filter
    >
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.id }} - {{ data.item.name }} {{ data.item.middle_name }} {{ data.item.last_name }} 
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.id }} - {{ data.item.name }} {{ data.item.middle_name }} {{ data.item.last_name }} 
        </template>
        <template v-slot:label>
            <div v-if="label">
               <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>{{ label }}</span>
            </div>
            <div v-else>
               <span v-if="!norequired">Salesperson<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>Salesperson</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectSalesPerson',
        data() {
            return {
                items: [],
                placeholder : '',
                isLoading: false,
                search:'',
                sales_persons:null
            };
        },
        props: ['sales_person','disabled','clear','error','filtered', "label", 'norequired', "dense"],
        methods: {
            // For show dropdown suggestion search by code or description
            textList(item){
                return item.id + ' — ' + item.name + '-' + item.middle_name + ' — ' + item.last_name
            },
            remoteSearch(search) {
                if (this.sales_person) {
                    this.autoSelectByID(this.sales_person)
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/sales/v1/sales_person",{params:{
                    status: 1,
                    page:1,
                    per_page:10,
                    search:search,
                }}).then(response => {
                    this.items = []
                    if(response.data.data){
                        this.items = response.data.data
                    }
                    this.isLoading = false
                    let label = 'Salesperson'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val?.id){
                    this.$http.get("/sales/v1/sales_person/detail?id=" + val.id).then(response => {
                        if(response?.data?.data){
                            this.sales_persons = response.data.data
                            this.items.push(response.data.data)
                        }
                    });
                }else{
                    this.sales_persons = null
                }
            },
            selected(event) {
                this.$emit('selected', event);
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
                    } else if (!this.sales_person) {
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) { // ini untuk clear data
                    this.sales_persons = null
                    this.remoteSearch('')
                },
                deep: true
            },
            sales_person:{
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if(val){
                        this.autoSelectByID(val)
                    } else {
                        this.sales_persons = null
                    }
                },
                deep: true
            }
        },
    };
</script>