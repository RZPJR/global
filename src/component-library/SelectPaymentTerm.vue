<template>
    <v-autocomplete
        v-model="areas"
        :items="items"
        :loading="isLoading"
        :placeholder="placeholder"
        item-text="name"
        name="payment_term"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        return-object
        clearable
        outlined
        :dense="dense"
        :class="dense?'':'rounded-form'"
        :error-messages="error"
    >
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.name }}
            </div>
        </template>
        <template v-slot:label>
            <div v-if="label">
                <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
                <span v-else>{{ label }}</span>
            </div>
            <div v-else>
                <span v-if="!norequired">Payment Term<span :class="disabled?'':'text-red'">*</span></span>
                <span v-else>Payment Term</span>
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.name }}
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
                placeholder : '',
                search:'',
                areas:null
            };
        },
        props: ['payment_term','disabled','clear','label','error','aux_data', 'norequired', "dense"],
        methods: {
            remoteSearch(search) {
                let aux_data = '';
                if (this.aux_data){
                    aux_data = '|aux_data.in:'+this.aux_data;
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                // ini ke endpoint get all
                this.$http.get("/finance/purchase/term",{params:{
                    perpage:10,
                    conditions:'status:1|name.icontains:'+search + aux_data,
                }}).then(response => {
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Payment Term'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.$http.get("/finance/purchase/term",{params:{
                        conditions:'id.e:'+val.id,
                    }}).then(response => {
                        this.items.push(response.data.data[0])
                        this.areas = response.data.data[0]
                    });
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
                    } else if(!this.payment_term){
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.areas = null
                    this.remoteSearch('')
                },
                deep: true
            },
            payment_term: {
                handler: function (val) {
                    if(val){ // ini untuk auto select
                        this.autoSelectByID(val)
                    } else {
                        this.areas = null
                    }
                },
                deep: true
            },
            aux_data: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(this.search)
                    }
                },
                deep: true
            },
        },
    };
</script>
