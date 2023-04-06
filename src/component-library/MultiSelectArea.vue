<template>
    <v-autocomplete
        v-model="areas"
        :items="items"
        :loading="isLoading"
        item-text="description"
        name="area"
        :counter="maxSelected"
        :menu-props="menuProps"
        :placeholder="placeholder"
        :search-input.sync="search"
        @input="adjustOptions"
        @change="selected"
        :disabled="disabled"
        return-object
        clearable
        outlined
        chips
        multiple
        deletable-chips
        :dense="dense"
        :error-messages="error"
    >
        <!-- <template slot="selection" slot-scope="data">
            <v-chip
                color="#8DC53F"
                dark
                close
                @click:close="remove(data.item)"
            >
                {{ data.item.code }} - {{ data.item.name }}
            </v-chip>
        </template> -->
        <template v-slot:label>
            <span v-if="!norequired">Region<span style="color:red">*</span></span>
            <span v-else>Region</span>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.code }} - {{ data.item.description }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'MultiSelectArea',
        data() {
            return {
                items: [],
                isLoading: false,
                placeholder : '',
                areas:[],
                maxSelected: 10,
                menuProps: {
                    disabled: false
                },
                search:'',
            };
        },
        props: ['area','disabled','clear','label','error','aux_data', 'norequired', 'attribute', 'dense'],
        methods: {
            remoteSearch(search,aux_data) {
                if (aux_data !== '' && aux_data !== undefined){
                    aux_data = '|aux_data.in:'+aux_data;
                }else{
                    aux_data = '';
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/configuration/v1/region",{params:{
                    per_page:10,
                    status:1,
                    search:search,
                }}).then(response => {
                    this.items = []
                    if(response.data.data && response.data.data != null){
                        this.items = response.data.data
                    }
                    this.isLoading = false
                    let label = 'Region'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
                if(this.areas.length >= this.maxSelected){
                    this.menuProps.disabled = true
                }
            },
            autoSelectByID(val) {
                if(val){
                    this.areas= []
                    val.forEach(id => {
                        this.$http.get("/configuration/v1/region/" + id).then(response => {
                            this.areas.push(response.data.data)
                        });
                    });
                    if(this.areas.length >= this.maxSelected){
                        this.menuProps.disabled = true
                    }
                }
            },
            selected(event) {
                this.$emit('selected', event);
            },
            // remove (item) {
            //     const index = this.areas.indexOf(item)
            //     // if (index >= 0) 
            //     this.areas.splice(index, 1)
            //     this.$emit('selected', this.areas);
            // },
            adjustOptions() {
                if (this.computedCounterValue >= this.maxSelected) {
                    this.menuProps.disabled = true
                } else {
                    this.menuProps.disabled = false
                }
            },
        },
        computed: {
            computedCounterValue () {
                let totalCount = 0
                if (this.areas && this.areas.length > 0) {
                    const selectedItems = this.areas.map((name) => {
                        return this.items.find((element) => element.name == name.name)
                    })
                    totalCount = selectedItems.reduce(function(prev, cur) {
                        return prev + ((cur.count)? cur.count: 1);
                    }, 0);
                }
                return totalCount
            },
        },
        // mounted() {
        //     this.remoteSearch('',this.aux_data);
        // },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        if(this.computedCounterValue < this.maxSelected){
                            this.remoteSearch(val)
                        }
                    } else if(!this.area){
                        this.remoteSearch('',this.aux_data)
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.areas = null
                    this.remoteSearch('','')
                },
                deep: true
            },
            area: {
                handler: function (val) { // ini untuk auto select
                    if(val){
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
            areas: {
                handler: function (val) {
                    this.search = ''
                },
                deep: true
            },
        },
    };
</script>