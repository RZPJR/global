<template>
    <v-autocomplete
        v-model="delivery_return_data"
        :items="items"
        :loading="isLoading"
        item-text="code"
        :dense="dense"
        :class="dense?'':'rounded-form'"
        :placeholder="placeholder"
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
               <span v-if="!norequired">Delivery Order Code<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>Delivery Order Code</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectDeliveryOrder',
        data() {
            return {
                items: [],
                placeholder : '',
                isLoading: false,
                search:'',
                delivery_return_data:null
            };
        },
        props: ['delivery_order','disabled','clear','error','label', "norequired", "warehouse", "dense"],
        methods: {
            remoteSearch(search) {
                let searchKey = ''
                if (search) {
                    searchKey = '|code.icontains:'+search
                }

                let  warehouseID = ''
                if (this.warehouse) {
                    warehouseID = '|warehouse_id.e:'+this.warehouse
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/warehouse/delivery_order",{params:{
                    conditions:'status:2'+searchKey+warehouseID,
                    embeds:'warehouse_id',
                    orderby:'-id',
                    perpage:10,
                }}).then(response => {
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Delivery Order Code'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.delivery_return_data = val
                } else {
                    this.delivery_return_data = null
                }

            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted() {
            this.remoteSearch('', true);
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val && val.length > 1){
                        this.isLoading = true
                        this.remoteSearch(val)
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) { // ini untuk clear data
                    this.delivery_return_data = null
                },
                deep: true
            },
            delivery_order:{
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if(val){
                        this.autoSelectByID(val)
                    } else {
                        this.delivery_return_data = null
                    }
                },
                deep: true
            },
            warehouse:{
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if(val){ // ini untuk auto select
                        this.remoteSearch(this.search)
                    } else {
                        this.delivery_return_data = null
                        this.remoteSearch('')
                    }
                },
                deep: true
            }
        },
    };
</script>