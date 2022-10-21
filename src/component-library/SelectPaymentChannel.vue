<template>
    <div>
        <v-autocomplete
            v-model="payment_methods"
            :items="items"
            :loading="isLoading"
            :placeholder="placeholder"
            item-text="name"
            :search-input.sync="search"
            @change="selected"
            :disabled="disabled"
            return-object
            outlined
            :dense="dense"
            :class="dense?'':'rounded-form'"
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
                    <span v-if="!norequired">Preferred Payment Method<span :class="disabled?'':'text-red'">*</span></span>
                    <span v-else>Preferred Payment Method</span>
                </div>
            </template>
        </v-autocomplete>
    </div>
</template>
<script>
    export default {
        name: 'SelectPaymentChannel',
        data() {
            return {
                items: [],
                isLoading: false,
                search:'',
                placeholder : '',
                payment_methods:[],
            };
        },
        props: ['payment_method','disabled','clear','error', 'label', "norequired",'payment_method_id', "dense"],
        methods: {
            remoteSearch(search) {
                let piID = ''
                if (this.payment_method_id) {
                    piID = '|paymentmethod.id.e:'+this.payment_method_id
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/payment/channel",{params:{
                    perpage:10,
                    // conditions:'status:1|name.icontains:'+search+piID,
                    conditions:'status:1|publish_fva:1'+piID,
                }}).then(response => {
                    this.items = response.data.data
                    if(this.items === null){
                        this.$root.$emit('empty_channel', 1)
                        this.items = []
                    }else if (this.payment_method_id){
                        this.$root.$emit('empty_channel', 2)
                    }
                    this.isLoading = false
                    let label = 'Payment Method'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    // ini ke endpoint detail
                    this.$http.get("/payment/channel",{params:{
                        conditions:'id.e:'+val.id,
                    }}).then(response => {
                        this.items.push(response.data.data[0])
                        this.payment_methods = response.data.data[0]
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
                    } else if(!this.payment_method){
                        this.remoteSearch("")
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) { // ini untuk clear data
                    this.payment_methods = []
                },
                deep: true
            },
            payment_method:{
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if(val){
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
            payment_method_id:{
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if(val){
                        this.remoteSearch(this.search)
                    } else {
                        this.payment_method_id = null
                        this.payment_methods = []
                        this.remoteSearch(this.search)
                    }
                },
                deep: true
            }
        },
    };
</script>