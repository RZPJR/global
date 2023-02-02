<template>
    <v-autocomplete
        v-model="customers"
        :items="items"
        :loading="isLoading"
        item-text="name"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        :placeholder="placeholder"
        :dense="dense"
        :class="dense?'':'rounded-form'"
        return-object
        outlined
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
               <span v-if="!norequired">Customer<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>Customer</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectCustomer',
        data() {
            return {
                items: [],
                isLoading: false,
                placeholder : '',
                search:'',
                customers:null
            };
        },
        props: ['customer','disabled','clear','error','filtered', "label", 'norequired', "dense"],
        methods: {
            remoteSearch(search) {
                // this.placeholder="Loading items..."
                // this.isLoading = true
                // this.$http.get("/customer/merchant/filter",{params:{
                //     perpage:10,
                //     conditions:'status:1|name.icontains:'+search,
                // }}).then(response => {
                //     this.items = response.data.data
                //     if(this.items === null){
                //         this.items = []
                //     }
                //     this.isLoading = false
                //     let label = 'Main Outlet'
                //     if (this.label) 
                //     label = this.label
                //     this.placeholder = "Select "+ label
                // });
            },
            autoSelectByID(val) {
                if(val){
                    // ini ke endpoint detail
                    // this.$http.get("/customer/merchant/filter",{params:{
                    //     conditions:'id.e:'+val.id,
                    // }}).then(response => {
                    //     this.items.push(response.data.data[0])
                    //     this.customers = response.data.data[0]
                    // });
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
                        this.isLoading = true
                        this.remoteSearch(val)
                    } else if(!this.customer){
                        this.remoteSearch('')
                    }

                },
                deep: true
            },
            clear: {
                handler: function (val) { // ini untuk clear data
                    this.customers = null
                },
                deep: true
            },

            customer:{
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if(val){
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            }
        },
    };
</script>