<template>
    <v-autocomplete
        v-model="vendor_relations"
        :item-text="textList"
        @change="selected"
        @click:clear="remoteSearch('')"
        return-object
        clearable
        outlined
        :items="items"
        :name="dataname"
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
                <span v-if="!norequired">Vendor Relation<span :class="disabled?'':'text-red'">*</span></span>
                <span v-else>Vendor Relation</span>
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
        name: 'SelectVendorRelation',
        data() {
            return {
                items: [],
                search:'',
                dataname:'',
                placeholder : '',
                isLoading: false,
                vendor_relations:{}
            };
        },
        props: ['vendor_relation','disabled','clear','label','error', 'norequired', 'name', "dense"],
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
                // await this.$http.get("/bridge/v1/vendor/relation",{params:{
                await this.$http.get("/account/v1/role",{params:{
                    per_page:10,
                    search:search,
                }}).then(response => {
                    if(response && response.data.data !== null) {
                        this.items = response.data.data
                    }
                    let label = this.label ? this.label : 'Vendor Relation'
                    this.placeholder = "Select "+ label
                    console.log(this.items)
                });
                this.isLoading = false
            },
            // For request by value id (Page update & etc)
            autoSelectByID(val) {
                if(val.id){
                    console.log(val.id,'val')
                    // this.$http.get("/bridge/v1/vendor/relation/"+val.id)
                    this.$http.get("/account/v1/role/"+val.id)
                    .then(response => {
                        console.log(response.data.data,'response')
                        this.items = response.data.data
                        this.vendor_relations = response.data.data
                    });
                }
            },
            // For Pass Selected Value
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted() {
            if(this.vendor_relation){
                this.autoSelectByID(this.vendor_relation)
            }
            if (!this.name) {
                this.dataname = 'vendor_relation'
            } else {
                this.dataname = this.name
            }
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val)
                    } else if (!this.vendor_relation) {
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.vendor_relations = null
                },
                deep: true
            },
            vendor_relation: {
                handler: function (val) {
                    if(val){ // ini untuk auto select
                        this.autoSelectByID(val)
                    } else {
                        this.vendor_relations = null
                    }
                },
                deep: true
            },
        },
    };
</script>