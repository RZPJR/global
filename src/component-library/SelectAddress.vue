<template>
    <v-autocomplete
        v-model="addresses"
        :item-text="textList"
        @change="selected"
        @click:clear="remoteSearch('')"
        return-object
        clearable
        outlined
        :items="items"
        :name="data_name"
        :loading="isLoading"
        :search-input.sync="search"
        :placeholder="placeholder"
        :disabled="disabled"
        :dense="dense"
        :class="dense?'':'rounded-form'"
        :error-messages="error"
    >
        <template v-slot:label>
            <div v-if="label">
                <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
                <span v-else>{{ label }}</span>
            </div>
            <div v-else>
                <span v-if="!norequired">Address<span :class="disabled?'':'text-red'">*</span></span>
                <span v-else>Address</span>
            </div>
        </template>
        <template slot="selection" slot-scope="data">
            <div class="select-item" >
                {{ data.item.code }} - {{ data.item.name }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.code }} - {{ data.item.name }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectAddress',
        data() {
            return {
                items: [],
                isLoading: false,
                search:'',
                data_name:'',
                placeholder : '',
                addresses:{}
            };
        },
        props: ['address','disabled','clear','label','error', 'norequired', 'name', "dense"],
        methods: {
            // For show dropdown suggestion search by code or name
            textList(item){
                return item.code + ' — ' + item.name
            },
            // For get all data from API
            async remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true
                this.items = []
                await this.$http.get("/bridge/v1/address",{params:{
                    per_page:10,
                    search:search,
                }}).then(response => {
                    if(response && response.data.data !== null) {
                        this.items = response.data.data
                    }
                    let label = this.label ? this.label : 'Address'
                    this.placeholder = "Select "+ label
                });
                this.isLoading = false
            },
            // For request by value id (Page update & etc)
            autoSelectByID(val) {
                if(val.id){
                    this.$http.get("/bridge/v1/address/"+val.id)
                    .then(response => {
                        this.items = response.data.data
                        this.addresses = response.data.data
                    });
                }
            },
            // For Pass Selected Value
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted() {
            if(this.address){
                this.autoSelectByID(this.address)
            }
            if (!this.name) {
                this.data_name = 'address'
            } else {
                this.data_name = this.name
            }
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val)
                    } else if (!this.address) {
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.addresses = null
                },
                deep: true
            },
            address: {
                handler: function (val) {
                    if(val){ // ini untuk auto select
                        this.autoSelectByID(val)
                    } else {
                        this.addresses = null
                    }
                },
                deep: true
            },
        },
    };
</script>