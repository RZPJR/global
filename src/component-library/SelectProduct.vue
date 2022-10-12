<template>
    <div>
        <div v-if="exist">
            <v-autocomplete
                ref="product"
                :dense="dense"
                :class="dense?'':'rounded-form'"
                v-model="products"
                :items="items"
                :loading="isLoading"
                :placeholder="placeholder"
                item-value='code'
                item-text='name'
                :name="name"
                label="Product"
                clearable
                :no-filter="true"
                :search-input.sync="search"
                @change="selected"
                :disabled="disabled"
                return-object
                outlined
                :error-messages="error"
            >
                <template slot="selection" slot-scope="data">
                    <div class="select-item">
                        {{ data.item.code }} - {{ data.item.name }}
                    </div>
                </template>
                <template slot="item" slot-scope="data">
                    {{ data.item.code }} - {{ data.item.name }}
                </template>
            </v-autocomplete>
        </div>
        <div v-else>
            <v-tooltip top>
                <template v-slot:activator="{ on: tooltip }">
                    <div v-on="{ ...tooltip }">
                        <v-text-field
                            :name="name"
                            outlined
                            disabled
                            class="mt-2 rounded-form-sm"
                            style="margin-bottom:-20px"
                            v-model="product_text"
                            :error-messages="error"
                            dense
                        />
                    </div>
                </template>
            <span>{{product_text}}</span>
            </v-tooltip>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'SelectProduct',
        data() {
            return {
                items: [],
                placeholder : '',
                isLoading: false,
                search:'',
                searchtyping : false,
                products: {
                    code : '',
                    name : '',
                },
                exist : true,
                product_text : ""
            };
        },
        props: ['product','disabled','clear','label','error', 'norequired', "warehouse", "refs", "pb", "sb", "prefixValue","name", "dense"],
        methods: {
            checkExist() {
                if (this.products != null) {
                    for (let i = 0; i < this.items.length; i++) {
                        if (this.items[i].id == this.products.id) {
                            this.exist = true
                            break;
                        } else {
                            this.exist = false
                        }
                    }
                }
            },
            focusInput() {
                this.$refs.product.focus();
            },
            remoteSearch(search) {
                let warehouse = ''
                if (this.warehouse) {
                    warehouse = '|warehouse.id.e:'+this.warehouse
                }
                let purchasable = ""
                if (this.pb) { // purchasable
                    purchasable = '|purchasable:'+this.pb
                }
                let salable = ""
                if (this.sb) { // salable
                    salable = '|salable:'+this.sb
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                // ini ke endpoint get all
                this.$http.get("/warehouse/stock/filter",{params:{
                    perpage:10,
                    conditions:'Or.product.name.icontains:'+search+'%2COr.product.code.icontains:'
                    +search+'|status:1'+warehouse+purchasable+salable,
                    embeds: 'product,product.uom_id',
                }}).then(response => {
                    this.isLoading = false
                    let label = 'Product'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                    this.items = []
                    let array = response.data.data
                    if (array !=null) {
                        for (let i = 0; i < array.length; i++) {
                            this.items.push(array[i].product);
                        }
                    }
                    if (this.product) {
                        this.autoSelectByID(this.product)
                    }
                    if (!this.searchtyping) {
                        if (this.items.length == 0) {
                            this.exist = false
                        } else {
                            this.exist = true
                        }
                    }
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.$http.get("/warehouse/stock/filter",{params:{
                        conditions:'product.id.e:'+val.id,
                        embeds: 'product,product.uom_id',
                    }}).then(response => {
                        this.products = response.data.data[0].product
                        this.items.push(response.data.data[0].product);
                        this.product_text = response.data.data[0].product.code +' - '+response.data.data[0].product.name
                    });
                } else {
                    this.products = null
                }
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        created() {
            // this.remoteSearch('');
        },
        mounted() {
            if (this.prefixValue) {
                this.products = this.prefixValue
            }
            // this.remoteSearch('');
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val)
                    } else if(!this.product){
                        this.remoteSearch('');
                    }
                    this.searchtyping = true
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.products = null;
                    if(val)this.remoteSearch('')
                },
                deep: true
            },
            product: {
                handler: function (val) {
                    if(val){ // ini untuk auto select
                        this.autoSelectByID(val)
                    } else {
                        this.products = null
                    }

                },
                deep: true
            },
            products: {
                handler: function (val) {
                    if(val.code && val.name){
                        this.product_text = val.code +' - '+val.name
                    }
                    if(this.prefixValue){
                        this.exist = true
                    } else if (!this.searchtyping){
                        this.checkExist()
                    }
                },
                deep: true
            },
            items: {
                handler: function (val) {
                    if (val) {
                        if(this.prefixValue){
                            this.exist = true
                        } else if (!this.searchtyping){
                            this.checkExist()
                        }
                    }
                },
                deep: true
            },
            warehouse : {
                handler: function (val) {
                    this.remoteSearch('')
                },
                deep: true

            },
            refs : {
                handler: function (val) {
                    let idx = val.split('-')[0];
                    let length = val.split(',')[1];
                    if (idx == length) {
                        this.focusInput()
                    }
                },
                deep: true
            }
        },
    };
</script>