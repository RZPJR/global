<template>
    <v-autocomplete
        v-model="payment_terms"
        :items="items"
        :loading="isLoading"
        :item-text="textList"
        name="payment_term"
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
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.description }}
            </div>
        </template>
        <template v-slot:label>
            <span v-if="!norequired">
                {{ label }}<span :class="disabled?'':'text-red'">*</span>
            </span>
            <span v-else>
                {{ label }}
            </span>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.description }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectPaymentTerm',
        data() {
            return {
                items: [],
                isLoading: false,
                search: '',
                payment_terms: null,
                placeholder : '',
            };
        },
        props: ['payment_term','disabled','clear','label','error', 'norequired', 'dense'],
        methods: {
            remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true

                //Getting data from endpoint
                this.$http.get("/sales/v1/payment_term",{params:{
                    page: 1,
                    per_page: 10,
                    search: search,
                }}).then(response => {
                    this.items = [];
                    if (response.data.data && response.data.data !== null && response.data.data !== []) {
                        this.items = response.data.data
                    }
                    this.isLoading = false
                    let label = 'Payment Term'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            textList(item){
                return item.description
            },
            autoSelectByID(val) {
                if(val){
                    this.payment_terms = val
                }
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val)
                    } else if(!this.payment_term){
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.payment_terms = null
                    this.remoteSearch('')
                },
                deep: true
            },
            payment_term: {
                handler: function (val) {
                    if(val !== null){ // ini untuk auto select
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
        },
    };
</script>