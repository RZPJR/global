<template>
    <v-autocomplete
        v-model="supplier_badges"
        :items="items"
        :placeholder="placeholder"
        :loading="isLoading"
        item-text="name"
        :dense="dense"
        :class="dense?'':'rounded-form'"
        label="Supplier Badge"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled || isLoading"
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
               <span v-if="!norequired">Supplier Badge<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>Supplier Badge</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectSupplierBadge',
        data() {
            return {
                items: [],
                placeholder : '',
                isLoading: false,
                search:'',
                supplier_badges:null,
                timeout: null
            };
        },
        props: ['supplier_badge','disabled','clear','error','label', "norequired", "dense", "selected_comodity"],
        methods: {
            //Get Data List Supplier Badge
            remoteSearch(search,comodityId) {
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/purchase/supplier/badge",{params:{
                    perpage:10,
                    conditions:'status:1|name.icontains:'+search,
                    supplier_commodity_id: Number(comodityId)
                }}).then(response => {
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Supplier Badge'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            //Auto Select Supplier Badge
            autoSelectByID(val) {
                if(val){
                    this.$http.get("/purchase/supplier/badge",{params:{
                            conditions:'id.e:'+val.id,
                        }}).then(response => {
                        this.items.push(response.data.data[0])
                        this.supplier_badges = response.data.data[0]
                    });
                }
            },
            //Select Supplier Badge
            selected(event) {
                this.$emit('selected', event);
            }
        },
        created(){
            this.remoteSearch("","")
        },
        watch: {
            //For Search on field
            search: {
                handler: function (val) {
                    if (this.timeout) clearTimeout(this.timeout)
                    this.timeout = setTimeout(() => {
                        if(val){
                            this.remoteSearch(val,this.selected_comodity || 0)
                        }
                    }, 500)
                },
                deep: true
            },
            // ini untuk clear data
            clear: {
                handler: function (val) { 
                    this.supplier_badges = null
                },
                deep: true
            },
            // watch perubahan untuk auto select (biasa di pakai di page update)
            supplier_badge:{
                handler: function (val) { 
                    if(val){
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
            // filter badge list berdasarkan comodity yang dipilih
            selected_comodity:{
                handler: function (val) {
                    if(val){
                        this.remoteSearch('',val)
                        this.supplier_badges = null
                    } 
                },
                deep: true
            }
        },
    };
</script>