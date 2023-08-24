<template>
    <v-autocomplete
        v-model="archeTypes"
        :items="items"
        :loading="isLoading"
        :placeholder="placeholder"
        item-text="description"
        :menu-props="menuProps"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        return-object
        clearable
        outlined
        chips
        multiple
        deletable-chips
        :class="dense?'multi':'rounded-form multi'"
        :dense="dense"
        :error-messages="error"
    >
        <template v-slot:label>
            <span v-if="!norequired">Archetype Exclude<span style="color:red">*</span></span>
            <span v-else>Archetype Exclude</span>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.code }} - {{ data.item.description }} - {{ data.item.customer_type.description }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'MultiSelectArcheType',
        data() {
            return {
                items: [],
                placeholder : '',
                isLoading: false,
                archeTypes: [],
                menuProps: {
                    disabled: false
                },
                search:'',
            };
        },
        props: ['archeType','disabled','clear','label','error','aux_data', 'norequired', 'attribute','dense'],
        methods: {
            remoteSearch(search,aux_data) {
                if (aux_data !== '' && aux_data !== undefined){
                    aux_data = '|aux_data.in:'+aux_data;
                }else{
                    aux_data = '';
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                // ini ke endpoint get all
                this.$http.get("/crm/v1/archetype",{params:{
                    per_page: 10,
                    status: 1,
                    search: search
                }}).then(response => {
                    if(response.data.data){
                        response.data.data.forEach((value, index) =>{
                            this.items.push(response.data.data[index])
                        });
                    }
                    this.isLoading = false
                    let label = 'Archetype Exclude'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.archeTypes= []
                    for (let i = 0; i < val.length; i++) {
                        this.archeTypes.push(val[i])
                        this.items.push(val[i])
                    }
                }
            },
            selected(event) {
                this.$emit('selected', event);
            },
        },
        watch: {
            search: {
                handler: function (val) {
                    this.remoteSearch(val,this.aux_data)
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.archeTypes = null
                    this.remoteSearch('',this.aux_data)
                },
                deep: true
            },
            archeType: {
                handler: function (val) {
                    if(val !== null){ // ini untuk auto select
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
            aux_data: {
                handler: function (val) {
                    if(val !== null){
                        this.remoteSearch(this.search,val)
                    }
                },
                deep: true
            },
            archeTypes: {
                handler: function (val) {
                    this.search = ''
                },
                deep: true
            },
        },
    };
</script>
