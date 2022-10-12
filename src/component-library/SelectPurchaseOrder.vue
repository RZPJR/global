<template>
    <v-autocomplete
        v-model="purchase_orders"
        :items="items"
        :placeholder="placeholder"
        :loading="isLoading"
        item-text="code"
        :dense="dense"
        :class="dense?'':'rounded-form'"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        return-object
        outlined
        :error-messages="error"
        clearable
    >
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.code }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.code }}
        </template>
        <template v-slot:label>
            <div v-if="label">
               <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>{{ label }}</span>
            </div>
            <div v-else>
               <span v-if="!norequired">Purchase Order<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>Purchase Order</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectPurchaseOrder',
        data() {
            return {
                items: [],
                placeholder : '',
                isLoading: false,
                search:'',
                purchase_orders:null
            };
        },
        props: ['purchase_order','disabled','clear','error','label', "norequired","supplier","warehouse", "dense"],
        methods: {
            remoteSearch(search) {
                let supplier = ''
                if (this.supplier) {
                    supplier = '|supplier.id.e:'+this.supplier
                }
                let warehouse = ''
                if (this.warehouse) {
                    warehouse = '|warehouse.id.e:'+this.warehouse
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/purchase/order/filter",{params:{
                    perpage:10,
                    conditions:'status:1|code.icontains:'+search+supplier+warehouse,
                }}).then(response => {
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Purchase Order'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.$http.get("/purchase/order/filter",{params:{
                            conditions:'id.e:'+val.id,
                        }}).then(response => {
                        this.items.push(response.data.data[0])
                        this.purchase_orders = response.data.data[0]
                    });
                }
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted() {
            // this.remoteSearch('', true);
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val)
                    } else if(!this.purchase_order){
                        this.remoteSearch('')
                    }

                },
                deep: true
            },
            clear: {
                handler: function (val) { // ini untuk clear data
                    this.purchase_orders = null
                },
                deep: true
            },
            purchase_order:{
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if(val){
                        this.autoSelectByID(val)
                    } else if (val == null) {
                        this.purchase_orders = null
                    } else {
                        this.purchase_orders = null
                    }
                },
                deep: true
            },
            supplier:{
                handler: function (val) { 
                    this.remoteSearch('')
                },
                deep: true
            },
            warehouse:{
                handler: function (val) { 
                    this.remoteSearch('')
                },
                deep: true
            }
        },
    };
</script>