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
                item-value='item_id'
                item-text='description'
                :name="name"
                clearable
                :no-filter="true"
                :search-input.sync="search"
                @change="selected"
                :disabled="disabled"
                return-object
                outlined
                :error-messages="error"
            >
                <template v-slot:label>
                    <div class="select-item">
                        <span v-if="required"
                            >Item<span :class="disabled ? '' : 'text-red'">*</span>
                        </span>
                        <span v-else>Item</span>
                    </div>
                    </template>
                <template slot="selection" slot-scope="data">
                    <div class="select-item">
                        {{ data.item.code }} - {{ data.item.description }}
                    </div>
                </template>
                <template slot="item" slot-scope="data">
                    {{ data.item.code }} - {{ data.item.description }}
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
        props: ['product','disabled','clear','label','error', 'norequired', "warehouse", "refs", "pb", "sb", "prefixValue","name", "dense", "required"],
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
                this.placeholder="Loading items..."
                this.isLoading = true
                // ini ke endpoint get all
                this.$http.get("/catalog/v1/item",{params:{
                    perpage:10,
                    search:search,
                    status: '1',
                }}).then(response => {
                    this.isLoading = false
                    let label = 'Item'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                    this.items = []
                    let array = response.data.data
                    if (array !=null) {
                        this.items = array
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
                    this.$http.get("/catalog/v1/item/"+val.id).then(response => {
                        if(response.data.data) {
                            this.products = response.data.data
                            this.items.push(response.data.data);
                            this.product_text = response.data.data.code +' - '+response.data.data.description
                        }
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