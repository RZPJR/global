<template>
    <v-autocomplete
        v-model="sales_persons"
        :items="items"
        :loading="isLoading"
        :placeholder="placeholder"
        item-text="name"
        item-value='code'
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        :class="dense?'':'rounded-form'"
        return-object
        outlined
        :error-messages="error"
        clearable
        :dense="dense"
    >
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.code }} - {{ data.item.name }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.code }} - {{ data.item.name }}
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
            remoteSearch(search) {
                if (this.sales_person) {
                    this.autoSelectByID(this.sales_person)
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/sales/person/filter",{params:{
                    perpage:10,
                    conditions:'name.icontains:'+search+'|role_group:1|status:1',
                }}).then(response => {
                    if(response){
                        this.items = response.data.data
                    }
                    if(this.items === null){
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Salesperson'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.$http.get("/sales/person/filter",{params:{
                            conditions:'id.e:'+val.id,
                        }}).then(responses => {
                        this.items.push(responses.data.data[0])
                        this.sales_persons = responses.data.data[0]
                    });
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
                        this.remoteSearch(val)
                    } else if(!this.sales_person){
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) { // ini untuk clear data
                    this.sales_persons = null
                    this.remoteSearch('','')
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