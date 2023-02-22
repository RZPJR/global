<template>
    <v-autocomplete
        v-model="productTags"
        :items="items"
        :loading="isLoading"
        :placeholder="placeholder"
        item-text="description"
        :counter="maxSelected"
        :menu-props="menuProps"
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
        :class="dense?'multi':'rounded-form multi'"
        :dense="dense"
        :error-messages="error"
    >
        <!-- <template slot="selection" slot-scope="data">
            <v-chip
                color="#8DC53F"
                dark
                close
                @click="data.select"
                @click:close="remove(data.item)"
            >
                {{ data.item.name }}
            </v-chip>
        </template> -->
        <template v-slot:label>
            <span v-if="!norequired">Product Tag<span style="color:red">*</span></span>
            <span v-else>Product Tag</span>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.code }} - {{ data.item.description }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'MultiSelectProductTag',
        data() {
            return {
                items: [],
                placeholder : '',
                isLoading: false,
                productTags: [],
                maxSelected: 1,
                menuProps: {
                    disabled: false
                },
                search:'',
            };
        },
        props: ['productTag','disabled','clear','label','error','aux_data', 'norequired', 'attribute','dense'],
        methods: {
            setMaxSelected() {
                if(!this.attribute){
                    this.attribute = 'prd_max_tag'
                }
                if(this.attribute){
                    this.$http.get("/catalog/v1/item_category",{params:{
                        // conditions:'attribute:'+this.attribute,
                        orderby:'-id',
                    }}).then(response => {
                        this.maxSelected = response.data.data
                    });
                }
            },
            remoteSearch(search,aux_data) {
                if (aux_data !== '' && aux_data !== undefined){
                    aux_data = '|aux_data.in:'+aux_data;
                }else{
                    aux_data = '';
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                // ini ke endpoint get all
                this.$http.get("/inventory/tag_product/filter",{params:{
                    perpage:20,
                    conditions:'status:1|name.icontains:'+search + aux_data,
                    orderby:'-id',
                }}).then(response => {

                    if(response.data.data){
                        response.data.data.forEach((value, index) =>{
                            this.items.push(response.data.data[index])
                        });
                    }
                    this.isLoading = false
                    let label = 'Product Tag'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
                if(this.productTags.length >= this.maxSelected){
                    this.menuProps.disabled = true
                }
            },
            autoSelectByID(val) {
                if(val){
                    this.productTags= []
                    for (let i = 0; i < val.length; i++) {
                        this.productTags.push(val[i])
                    }
                    if(this.productTags.length >= this.maxSelected){
                        this.menuProps.disabled = true
                    }
                }
            },
            selected(event) {
                this.$emit('selected', event);
            },
            // remove (item) {
            //     const index = this.productTags.indexOf(item)
            //     // if (index >= 0) 
            //     this.productTags.splice(index, 1)
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
                if (this.productTags && this.productTags.length > 0) {
                    const selectedItems = this.productTags.map((name) => {
                        return this.items.find((element) => element.name == name.name)
                    })
                    totalCount = selectedItems.reduce(function(prev, cur) {
                        return prev + ((cur.count)? cur.count: 1);
                    }, 0);
                }
                return totalCount
            },
        },
        mounted() {
            this.setMaxSelected();
            // this.remoteSearch('',this.aux_data);
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        if(this.computedCounterValue < this.maxSelected){
                            this.remoteSearch(val,this.aux_data)
                        }
                    } else if(!this.productTag){
                        this.remoteSearch('',this.aux_data)
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.productTags = null
                    this.remoteSearch('',this.aux_data)
                },
                deep: true
            },
            productTag: {
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
            productTags: {
                handler: function (val) {
                    this.search = ''
                },
                deep: true
            },
        },
    };
</script>
