<template>
    <v-autocomplete
        v-model="goods_receipts"
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
               <span v-if="!norequired">Goods Receipt Code<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>Goods Receipt Code</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectGoodsReceipt',
        data() {
            return {
                items: [],
                placeholder : '',
                isLoading: false,
                search:'',
                goods_receipts:null
            };
        },
        props: ['goods_receipt','disabled','clear','error','label', "norequired","supplier","warehouse", "dense", "ata_date"],
        methods: {
            remoteSearch(search) {
                let supplier = ''
                if (this.supplier) {
                    supplier = '|purchaseorder.supplier.id.e:'+this.supplier
                }
                let warehouse = ''
                if (this.warehouse) {
                    warehouse = '|warehouse.id.e:'+this.warehouse
                }
                let ata_date = ''
                if (this.ata_date) {
                    if (this.ata_date.length > 0) {
                        if (this.ata_date.length == 1) {
                            ata_date = '|ata_date.between:'+this.ata_date+'.'+this.ata_date
                        } else {
                            let date = this.ata_date[0]
                            let date2 = this.ata_date[1]
                            if (date > date2) {
                                ata_date = '|ata_date.between:'+date2+'.'+date
                            } else {
                                ata_date = '|ata_date.between:'+date+'.'+date2
                            }
                        }
                    }
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/warehouse/goods/receipt/filter",{params:{
                    perpage:10,
                    orderby: '-id',
                    conditions:'code.icontains:'+search+supplier+warehouse+ata_date+'status:2|validsupplierreturn:2',
                    embeds:'warehouse,purchaseorder,purchaseorder.supplier,warehouse.area'
                }}).then(response => {
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Goods Receipt Code'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.$http.get("/warehouse/goods/receipt",{params:{
                            conditions:'id.e:'+val.id,
                        }}).then(response => {
                        this.items.push(response.data.data[0])
                        this.goods_receipts = response.data.data[0]
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
                    } else if(!this.goods_receipt){
                        this.remoteSearch('')
                    }

                },
                deep: true
            },
            clear: {
                handler: function (val) { // ini untuk clear data
                    this.goods_receipts = null
                },
                deep: true
            },
            goods_receipt:{
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if(val){
                        this.autoSelectByID(val)
                    } else if (val == null) {
                        this.goods_receipts = null
                    } else {
                        this.goods_receipts = null
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
            },
            ata_date:{
                handler: function (val) { 
                    this.remoteSearch('')
                },
                deep: true
            }
        },
    };
</script>