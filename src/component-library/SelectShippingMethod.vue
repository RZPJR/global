<template>
    <v-autocomplete
        v-model="shipping_methods"
        :items="items"
        :loading="isLoading"
        :item-text="textList"
        name="shipping_method"
        :search-input.sync="search"
        :placeholder="placeholder"
        @change="selected"
        :disabled="disabled"
        return-object
        clearable
        outlined
        :dense="dense"
        :error-messages="error"
    >
        <template v-slot:label>
            <span v-if="!norequired">
                {{ label }}<span :class="disabled?'':'text-red'">*</span>
            </span>
            <span v-else>
                {{ label }}
            </span>
        </template>
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.description }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.description }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectShippingMethod',
        data() {
            return {
                items: [],
                isLoading: false,
                search: '',
                shipping_methods: null,
                placeholder : '',
            };
        },
        props: ['shipping_method','disabled','clear','label','error', 'norequired', 'dense'],
        methods: {
            // For show dropdown suggestion search by code or description
            textList(item){
                return item.description
            },
            remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true
                // ini ke endpoint get all
                this.$http.get("/sales/v1/shipping_method",{params:{
                    page:1,
                    per_page:20,
                    search: search
                }}).then(response => {
                    if (response.data.data && response.data.data !== null && response.data.data !== []) {
                        this.items = response.data.data
                    }
                    this.isLoading = false
                    let label = 'Shipping Method'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.shipping_methods = val
                }
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted() {
            this.remoteSearch('');
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val)
                    } else if(!this.shipping_method){
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.shipping_methods = null
                    this.remoteSearch('')
                },
                deep: true
            },
            shipping_method: {
                handler: function (val) {
                    if(val !== null){ // ini untuk auto select
                        this.autoSelectByID(val)
                    } else {
                        this.shipping_methods = null
                    }
                },
                deep: true
            }
        },
    };
</script>