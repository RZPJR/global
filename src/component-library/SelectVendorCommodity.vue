<template>
    <v-autocomplete
        v-model="vendor_comodities"
        :items="items"
        :loading="isLoading"
        item-text="description"
        :name="dataname"
        :search-input.sync="search"
        :placeholder="placeholder"
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
                {{ data.item.code }} - {{ data.item.name }}
            </div>
        </template>
        <template v-slot:label>
            <div v-if="label">
                <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
                <span v-else>{{ label }}</span>
            </div>
            <div v-else>
                <span v-if="!norequired">Vendor Commodity<span :class="disabled?'':'text-red'">*</span></span>
                <span v-else>Vendor Commodity</span>
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.code }} - {{ data.item.name }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectVendorCommodity',
        data() {
            return {
                items: [],
                isLoading: false,
                search:'',
                dataname:'',
                placeholder : '',
                vendor_comodities:{}
            };
        },
        props: ['vendor_commodity','disabled','clear','label','error', 'norequired', 'name', "dense"],
        methods: {
            async remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true
                this.items = []
                // await this.$http.get("/bridge/v1/vendor/commodity",{params:{
                //     perpage:10,
                //     status:1,
                //     search:search,
                // }}).then(response => {
                //     if(response && response.data.data !== null) this.items = response.data.data
                //     let label = this.label ? this.label : 'Vendor Commodity'
                //     this.placeholder = "Select "+ label
                // });
                this.isLoading = false
            },
            autoSelectByID(val) {
                // if(val.id){
                //     this.$http.get("/bridge/v1/vendor/commodity/"+val.id)
                //     .then(response => {
                //         this.vendor_comodities = response.data.data
                //     });
                // }
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted() {
            if(this.vendor_commodity){
                this.autoSelectByID(this.vendor_commodity)
            }
            if (!this.name) {
                this.dataname = 'vendor_commodity'
            } else {
                this.dataname = this.name
            }
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val)
                    } else{
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.vendor_comodities = null
                },
                deep: true
            },
            vendor_commodity: {
                handler: function (val) {
                    if(val){ // ini untuk auto select
                        this.autoSelectByID(val)
                    } else {
                        this.vendor_comodities = null
                    }
                },
                deep: true
            },
        },
    };
</script>