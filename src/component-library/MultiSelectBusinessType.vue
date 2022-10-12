<template>
    <v-autocomplete
        v-model="businessType"
        :items="items"
        :placeholder="placeholder"
        :loading="isLoading"
        item-text="name"
        :search-input.sync="search"
        :menu-props="menuProps"
        @input="adjustOptions"
        @change="selected"
        :disabled="disabled"
        return-object
        clearable
        outlined
        chips
        multiple
        deletable-chips
        class="multi"
        :dense="dense"
        :error-messages="error"
    >
        <template v-slot:label>
            <span v-if="!norequired">Business Type<span class="text-red">*</span></span>
            <span v-else>Business Type</span>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.code }} - {{ data.item.name }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'MultiSelectBusinessType',
        data() {
            return {
                items: [],
                placeholder : '',
                isLoading: false,
                search:'',
                menuProps: {
                    disabled: false
                },
                businessType: [],
            };
        },
        props: ['business_type','disabled','clear','label','error','norequired','dense','aux_data'],
        methods: {
            async remoteSearch(search,aux_data) {
                if (aux_data !== '' && aux_data !== undefined){
                    aux_data = '|aux_data.in:'+aux_data;
                }else{
                    aux_data = '';
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                // ini ke endpoint get all
                this.$http.get("/customer/business_type/filter",{params:{
                    perpage:10,
                    conditions:'status:1|name.icontains:'+search+aux_data,
                }}).then(response => {
                    if(response.data.data){
                        response.data.data.forEach((value, index) =>{
                            this.items.push(response.data.data[index])
                        });
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
                    this.businessType= []
                    for (let i = 0; i < val.length; i++) {
                        this.businessType.push(val[i])
                    }
                }
            },
            selected(event) {
                this.$emit('selected', event);
            },
            adjustOptions() {
                if (this.computedCounterValue) {
                    this.menuProps.disabled = true
                } else {
                    this.menuProps.disabled = false
                }
            },
        },
        mounted() {
            this.remoteSearch('',this.aux_data);
        },
        watch: {
            search: { 
                handler: function (val) { // search multi select
                    if(val){
                        this.remoteSearch(val,this.aux_data)
                    } else {
                        this.remoteSearch('',this.aux_data)
                    }
                },
                deep: true
            },
            businessType: {
                handler: function (val) {  // watch perubahan untuk auto select
                    this.search = ''
                },
                deep: true
            },
        },
    };
</script>
