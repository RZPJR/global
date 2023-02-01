<template>
    <v-autocomplete
        v-model="sales_terms"
        :items="items"
        :placeholder="placeholder"
        :loading="isLoading"
        item-text="name"
        :search-input.sync="search"
        @change="selected"
        :dense="dense"
        :class="dense?'':'rounded-form'"
        :disabled="disabled"
        return-object
        outlined
        :error-messages="error"
        clearable
    >
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.name }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.name }}
        </template>
        <template v-slot:label>
            <div v-if="label">
               <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>{{ label }}</span>
            </div>
            <div v-else>
               <span v-if="!norequired">Sales Term<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>Sales Term</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectSalesTerm',
        data() {
            return {
                items: [],
                placeholder : '',
                isLoading: false,
                search:'',
                labels:'',
                sales_terms:null
            };
        },
        props: ['sales_term','disabled','clear','error','label', "norequired","exceptPBD", "dense"],
        methods: {
            remoteSearch(search) {
                // let pbd = ''
                // if (this.exceptPBD) {
                //     pbd = 'name:PBD'
                // }
                // this.placeholder="Loading items..."
                // this.isLoading = true
                // this.$http.get("/finance/sales/term/filter",{params:{
                //     perpage:10,
                //     exclude : pbd,
                //     conditions:'name.icontains:'+search+'|status:1',
                // }}).then(response => {
                //     this.items = response.data.data
                //     if(this.items === null){
                //         this.items = []
                //     }
                //     this.isLoading = false
                //     let label = 'Sales Term'
                //     if (this.label) 
                //     label = this.label
                //     this.placeholder = "Select "+ label
                // });
            },
            autoSelectByID(val) {
                // if(val){
                //     this.$http.get("/finance/sales/term/filter",{params:{
                //             conditions:'id.e:'+val.id,
                //         }}).then(response => {
                //         this.items.push(response.data.data[0])
                //         this.sales_terms = response.data.data[0]
                //     });
                // }
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        created() {
            // this.remoteSearch('');
            if(this.label == undefined){
                this.labels = 'Sales Term'
            }else{
                this.labels = this.label
            }
            if (this.sales_term){
                this.autoSelectByID(this.sales_term)
            }
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val)
                    } else if(!this.sales_term){
                        this.remoteSearch('')
                    }

                },
                deep: true
            },
            clear: {
                handler: function (val) { // ini untuk clear data
                    this.sales_terms = null
                },
                deep: true
            },
            sales_term:{
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if(val){
                        this.autoSelectByID(val)
                    } else {
                        this.sales_terms = null
                    }
                },
                deep: true
            }
        },
    };
</script>