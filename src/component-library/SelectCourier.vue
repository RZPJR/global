<template>
    <v-autocomplete
        v-model="couriers"
        :items="items"
        :loading="isLoading"
        item-text='name'
        :class="dense?'':'rounded-form'"
        :dense="dense"
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
                {{ data.item.id }} - {{ data.item.name }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
             {{ data.item.id }} - {{ data.item.name }}
        </template>
        <template v-slot:label>
            <div v-if="label">
               <span v-if="!norequired">{{ label }}<span style="color:red">*</span></span>
               <span v-else>{{ label }}</span>
            </div>
            <div v-else>
               <span v-if="!norequired">Courier<span style="color:red">*</span></span>
               <span v-else>Courier</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectCourier',
        data() {
            return {
                items: [],
                isLoading: false,
                placeholder : '',
                search:'',
                couriers:null
            };
        },
        props: ['courier','disabled','clear','error','label', "norequired", "vendor_id", "dense"],
        methods: {
            remoteSearch() {
                let vendorId = ''
                if (this.vendor_id) {
                    vendorId = 'couriervendor.id.e:' +this.vendor_id
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/logistic/v1/courier",{
                  params:{
                    page: 1,
                    per_page:10
                  }
                }).then(response => {
                    if(response){
                        this.items = response.data.data
                    }
                    if(this.items === null){
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Courier'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.couriers = val
                } else {
                    this.couriers = null
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
                    } else if(!this.courier){
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) { // ini untuk clear data
                    if (val == true) {
                        this.couriers = null
                    }
                },
                deep: true
            },
            courier:{
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if(val){
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
            vendor_id: {
                handler: function (val) {
                    if(val){ // ini untuk auto select
                        this.remoteSearch('')
                    } else {
                        this.couriers = null
                    }
                },
                deep: true
            },
        },
    };
</script>