<template>
    <v-autocomplete
        v-model="business_types"
        :items="items"
        item-text="code"
        :search-input.sync="search"
        :placeholder="placeholder"
        :loading="isLoading"
        @change="selected"
        :disabled="disabled"
        return-object
        clearable
        outlined
        :class="dense?'':'rounded-form'"
        :error-messages="error"
        :filtered="filtered"
        :dense="dense"
    >
        <template v-slot:label>
            <div class="select-item">
                <span v-if="label">
                    <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
                    <span v-else>{{ label }}</span>
                </span>
                <span v-else>
                    <span v-if="!norequired">Business Type<span :class="disabled?'':'text-red'">*</span></span>
                    <span v-else>Business Type</span>
                </span>
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.code }}
        </template>
        <template slot="selection" slot-scope="data">
            {{ data.item.code }}
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.code }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectBusinessType',
        data() {
            return {
                items: [],
                search:'',
                business_types:null,
                isLoading: false,
                placeholder : '',
                typeId:'',
            };
        },
        props: ['business_type','disabled','clear','error','filtered','aux_data', 'norequired', 'label', "dense"],
        methods: {
            remoteSearch(search,aux_data) {
                if (aux_data !== '' && aux_data !== undefined){
                    aux_data = '|aux_data.in:'+aux_data;
                }else{
                    aux_data = '';
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/bridge/v1/business_type",{params:{
                    perpage:10,
                    conditions:'status:1|name.icontains:'+search+aux_data,
                }}).then(response => {
                    if(response){
                        this.items = response.data.data
                    }
                    if(this.items === null){
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Business Type'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.$http.get("/customer/business_type/filter",{params:{
                        conditions:'id.e:'+val,
                    }}).then(response => {
                        this.items.push(response.data.data[0])
                        this.business_types = response.data.data[0]
                    });
                }
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        created() {
            // this.remoteSearch('',this.aux_data);
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val,this.aux_data)
                    } else {
                        this.remoteSearch('',this.aux_data)
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) { // clear data
                    this.business_types = null
                    this.remoteSearch('',this.aux_data)
                },
                deep: true
            },
            aux_data: { // for hide '' or show '2' aux data
                handler: function (val) {
                    if(val !== null){
                        this.remoteSearch(this.search,val)
                    }
                },
                deep: true
            },
            business_type: {
                handler: function (val) { // watch auto select by params id in update
                    if (val) {
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
        },
    };
</script>