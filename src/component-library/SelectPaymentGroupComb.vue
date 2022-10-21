<template>
    <v-autocomplete
        v-model="payment_groups"
        :items="items"
        :loading="isLoading"
        item-text="id"
        :search-input.sync="search"
        :placeholder="placeholder"
        @change="selected"
        :dense="dense"
        :class="dense?'':'rounded-form'"
        :disabled="disabled"
        return-object
        outlined
        :error-messages="error"
        clearable
        :no-filter="true"
    >
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.invoice_term.name }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.invoice_term.name }}
        </template>
        <template v-slot:label>
            <div v-if="label">
               <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>{{ label }}</span>
            </div>
            <div v-else>
               <span v-if="!norequired">Payment Group<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>Payment Group</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectPaymentGroupComb',
        data() {
            return {
                items: [],
                isLoading: false,
                placeholder : '',
                search:'',
                labels:'',
                payment_groups:null
            };
        },
        props: ['payment_group', 'pg', 'pt', 'disabled','clear','error','label', "norequired", "dense"],
        methods: {
            remoteSearch(search) {
                let pt = ''
                if (this.pt) {
                    pt = 'invoiceterm__name.icontains:'+search+'|paymentterm.e:'+this.pt+'|paymentterm.status:1'
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/payment/payment_group_comb/filter",{params:{
                    embeds:'payment_group_sls_id,term_payment_sls_id,term_invoice_sls_id',
                    conditions: pt,
                }}).then(response => {
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Payment Group'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                this.payment_groups = val
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        created() {
            // this.remoteSearch('');
            if(this.payment_group){
                this.autoSelectByID(this.payment_group)
            }
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val)
                    } else if(!this.payment_group){
                        this.remoteSearch("")
                    }

                },
                deep: true
            },
            clear: {
                handler: function (val) { // ini untuk clear data
                    this.payment_groups = null
                },
                deep: true
            },
            payment_group:{
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    this.autoSelectByID(val)
                },
                deep: true
            },
            pg:{
                handler: function (val) {
                    this.remoteSearch('')
                },
                deep: true
            },
            pt:{
                handler: function (val) {
                    this.remoteSearch('')
                },
                deep: true
            }
        },
    };
</script>