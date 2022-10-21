<template>
    <v-autocomplete
        v-model="payment_groups"
        :items="items"
        :placeholder="placeholder"
        :loading="isLoading"
        item-text="name"
        :search-input.sync="search"
        @change="selected"
        :class="dense?'':'rounded-form'"
        :disabled="disabled"
        return-object
        outlined
        :dense="dense"
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
               <span v-if="!norequired">Payment Group<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>Payment Group</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectPaymentGroup',
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
        props: ['payment_group','disabled','clear','error','label', "norequired", "dense"],
        methods: {
            remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/payment/payment_group/filter",{params:{
                    perpage:10,
                    conditions:'status:1|name.icontains:'+search,
                }}).then(response => {
                    if(response){
                        this.items = response.data.data
                    }
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
                this.$http.get("/payment/payment_group/filter",{params:{
                        conditions:'id.e:'+val.id,
                    }}).then(response => {
                    this.items.push(response.data.data[0])
                    this.payment_groups = response.data.data[0]
                });
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        created() {
            // this.remoteSearch('');
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
                    if (val) {
                        this.autoSelectByID(val)
                    } else {
                        this.payment_groups = null
                    }
                },
                deep: true
            }
        },
    };
</script>