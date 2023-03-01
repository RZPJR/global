<template>
    <div>
        <div v-if="exist">
            <v-autocomplete
                ref="product"
                class="rounded-form-sm"
                v-model="products"
                :items="items"
                :loading="isLoading"
                :placeholder="placeholder"
                item-value='code'
                item-text='name'
                :name="name"
                :no-filter="true"
                :search-input.sync="search"
                @change="selected"
                :disabled="disabled"
                return-object
                outlined
                full-width
                :error-messages="error"
                dense
                style="margin-bottom:-24px"
            >
                <template slot="selection" slot-scope="data">
                    <div class="pt10 pb10">
                        {{ data.item.code }} - {{ data.item.description }}
                    <!-- {{ isCompletedProduct ? data.item.product.code : data.item.code }} - {{isCompletedProduct ? data.item.product.name :  data.item.name }}     -->
                    </div>
                </template>
                <template slot="item" slot-scope="data">
                        {{ data.item.code }} - {{ data.item.description }}
                    <!-- {{ isCompletedProduct ? data.item.product.code :  data.item.code }} - {{isCompletedProduct ? data.item.product.name :  data.item.name }} -->
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
        name: 'SelectItemTable',
        data() {
            return {
                items: [],
                placeholder : '',
                isLoading: false,
                search: '',
                searchtyping: false,
                products: [{
                    code: '',
                    name: '',
                }],
                exist: true,
                product_text: ""
            };
        },
        props: ['product', 'disabled', 'clear', 'label', 'error', 'norequired', "warehouse", "refs", "pb", "sb", "prefixValue", "name", "update", "minSearch", "isCompletedProduct"],
        methods: {
            checkExist() {
                if (this.products) {
                    for (let i = 0; i < this.items.length; i++) {
                        if(this.isCompletedProduct){
                            if (this.items[i].product.id == this.products.product.id) {
                                this.exist = true
                                break;
                            } else {
                                this.exist = false
                            }
                        }else{
                            if (this.items[i].id == this.products.id) {
                                this.exist = true
                                break;
                            } else {
                                this.exist = false
                            }
                        }
                    }
                }
            },
            focusInput() {
                if(this.$refs.product){
                    this.$refs.product.focus();
                }
            },
            remoteSearch(search) {
                let warehouse = ''
                if (this.warehouse) {
                    warehouse = '|warehouse.id.e:' + this.warehouse
                }
                let purchasable = ""
                if (this.pb) { // purchasable
                    purchasable = '|purchasable:' + this.pb
                }
                let salable = ""
                if (this.sb) { // salable
                    salable = '|salable:' + this.sb
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                // ini ke endpoint get all
                this.$http.get("/catalog/v1/item", {params: {
                    perpage:10,
                    search:search,
                    status: '1',
                }}).then(response => {
                    this.isLoading = false
                    let label = 'Product'
                    if (this.label) label = this.label
                    this.placeholder = "Select "+ label

                    this.items = []
                    if (response.data.data && response.data.data !== null && response.data.data !== []) {
                        this.items = response.data.data
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
                if (val) {
                    this.$http.get("/warehouse/stock/filter", {
                        params: {
                            conditions: 'product.id.e:' + val.id,
                            embeds: 'product,product.uom_id',
                        }
                    }).then(response => {
                        if(this.isCompletedProduct){
                            this.products = response.data.data[0]
                            this.items.push(response.data.data[0]);
                        }else{
                            this.products = response.data.data[0].product
                            this.items.push(response.data.data[0].product);
                        }
                        this.product_text = response.data.data[0].product.code + ' - ' + response.data.data[0].product.name
                    });
                } else {
                    this.products = []
                }
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted() {
            if (this.prefixValue) {
                this.products = this.prefixValue
            }
            if (!this.update) {
                if(this.minSearch){
                    if(this.products.length > 1){
                        this.remoteSearch("")
                    }else{
                        this.items = []
                    }
                }else{
                    this.remoteSearch("")
                }
            }
        },
        watch: {
            search: {
                handler: function (val) {
                    if (val) {
                        if(this.minSearch){
                            if(val.length > 1){
                                this.remoteSearch(val)
                            }else{
                                this.items = []
                            }
                        }else{
                            this.remoteSearch(val)
                        }
                    }
                    this.searchtyping = true
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.products = [];
                    if (val) this.remoteSearch('')
                },
                deep: true
            },
            product: {
                handler: function (val) {
                    if (val) { // ini untuk auto select
                        this.autoSelectByID(val)
                    } else {
                        this.products = []
                    }

                },
                deep: true
            },
            products: {
                handler: function (val) {
                    if (val) {
                        this.product_text = val.code + ' - ' + val.name
                    }
                    if (this.prefixValue) {
                        this.exist = true
                    } else if (!this.searchtyping) {
                        this.checkExist()
                    }
                },
                deep: true
            },
            items: {
                handler: function (val) {
                    if (val) {
                        if (this.prefixValue) {
                            this.exist = true
                        } else if (!this.searchtyping) {
                            this.checkExist()
                        }
                    }
                },
                deep: true
            },
            warehouse: {
                handler: function (val) {
                    this.remoteSearch('')
                },
                deep: true

            },
            refs: {
                handler: function (val) {
                    if(val){
                        let idx = val.split('-')[0];
                        let length = val.split(',')[1];
                        if (idx == length) {
                            this.focusInput()
                        }
                    }
                },
                deep: true
            }
        },
    };
</script>