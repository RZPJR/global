<template>
    <v-autocomplete
        v-model="vendor_types"
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
                <span v-if="!norequired">Vendor Type<span :class="disabled?'':'text-red'">*</span></span>
                <span v-else>Vendor Type</span>
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.code }} - {{ data.item.name }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectVendorType',
        data() {
            return {
                items: [],
                isLoading: false,
                search:'',
                dataname:'',
                placeholder : '',
                vendor_types:{}
            };
        },
        props: ['vendor_type','disabled','clear','label','error', 'norequired', 'name', "dense"],
        methods: {
            async remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true
                this.items = []
                // await this.$http.get("/bridge/v1/vendor/type",{params:{
                //     perpage:10,
                //     status:1,
                //     search:search,
                // }}).then(response => {
                //     if(response && response.data.data !== null) this.items = response.data.data
                //     let label = this.label ? this.label : 'Vendor Type'
                //     this.placeholder = "Select "+ label
                // });
                this.isLoading = false
            },
            autoSelectByID(val) {
                // if(val.id){
                //     this.$http.get("/bridge/v1/vendor/type/"+val.id)
                //     .then(response => {
                //         this.vendor_types = response.data.data
                //     });
                // }
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted() {
            if(this.vendor_type){
                this.autoSelectByID(this.vendor_type)
            }
            if (!this.name) {
                this.dataname = 'vendor_type'
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
                    this.vendor_types = null
                },
                deep: true
            },
            vendor_type: {
                handler: function (val) {
                    if(val){ // ini untuk auto select
                        this.autoSelectByID(val)
                    } else {
                        this.vendor_types = null
                    }
                },
                deep: true
            },
        },
    };
</script>