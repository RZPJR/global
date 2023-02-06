<template>
    <v-autocomplete
        v-model="invoice_terms"
        :items="items"
        :loading="isLoading"
        name="invoice_term"
        :search-input.sync="search"
        :placeholder="placeholder"
        @change="selected"
        :disabled="disabled"
        return-object
        clearable
        :dense="dense"
        :class="dense?'':'rounded-form'"
        outlined
        :error-messages="error"
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
               <span v-if="!norequired">Default Invoice Term<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>Default Invoice Term</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectInvoiceTerm',
        data() {
            return {
                items: [],
                isLoading: false,
                placeholder : '',
                search:'',
                invoice_terms:null
            };
        },
        props: ['invoice_term','disabled','clear','label','error', 'label', "norequired", "dense"],
        methods: {
            remoteSearch(search) {
                // this.placeholder="Loading items..."
                // this.isLoading = true
                // this.$http.get("/finance/invoice/term/filter",{params:{
                //     perpage:10,
                //     conditions:'status:1|name.icontains:'+search,
                // }}).then(response => {
                //     this.items = []
                //     let arr = response.data.data
                //     for (let i = 0; i < arr.length; i++) {
                //         this.items.push({
                //             value:arr[i].id,
                //             id:arr[i].id,
                //             name:arr[i].name
                //         })
                //     }
                //     if(this.items === null){
                //         this.items = []
                //     }
                //     this.isLoading = false
                //     let label = 'Invoice Term'
                //     if (this.label) 
                //     label = this.label
                //     this.placeholder = "Select "+ label
                // });
            },
            autoSelectByID(val) {
                if(val){
                    // ini ke endpoint detail
                    // this.$http.get("/finance/invoice/term/filter",{params:{
                    //     conditions:'id.e:'+val.id,
                    // }}).then(response => {
                    //     // this.items.push(response.data.data)
                    //     this.invoice_terms = {
                    //         value:response.data.data[0].id,
                    //         id:response.data.data[0].id,
                    //         name:response.data.data[0].name
                    //     }
                    // });
                }

            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted() {
            // this.remoteSearch('');
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val)
                    } else if(!this.invoice_term){
                        this.remoteSearch("")
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.invoice_terms = null
                    this.remoteSearch('')
                },
                deep: true
            },
            invoice_term:{
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if(val){
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            }
        },
    };
</script>
