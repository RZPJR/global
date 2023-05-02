<template>
    <v-autocomplete
        v-model="item_category"
        :items="items"
        :loading="isLoading"
        :placeholder="placeholder"
        item-text="name"
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
        :dense="dense"
        :error-messages="error"
        :counter="maxSelected"
        @input="adjustOptions"
        class="multi"
    >
        <template v-slot:label>
            <span v-if="!norequired">Item Category<span style="color:red">*</span></span>
            <span v-else>Item Category</span>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.code }} - {{ data.item.name }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'MultiSelectItemCategory',
        data() {
            return {
                items: [],
                placeholder : '',
                isLoading: false,
                item_category: [],
                menuProps: {
                    disabled: false
                },
                search:'',
                maxSelected: 3
            };
        },
        props: ['item_categories','disabled','clear','label','error', 'norequired', 'attribute','dense'],
        methods: {
            remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true
                // ini ke endpoint get all
                this.$http.get("/catalog/v1/item_category",{params:{
                    status: '1',
                    perpage: 10,
                    search: search,
                }}).then(response => {
                    if(response.data.data){
                        response.data.data.forEach((value, index) =>{
                            this.items.push(response.data.data[index])
                        });
                    }
                    this.isLoading = false
                    let label = 'Item Category'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
                if(this.item_category.length >= this.maxSelected){
                    this.menuProps.disabled = true
                }
            },
            autoSelectByID(val) {
                if(val){
                    this.item_category= []
                    for (let i = 0; i < val.length; i++) {
                        this.item_category.push(val[i])
                    }
                    if(this.item_category.length >= this.maxSelected){
                        this.menuProps.disabled = true
                    }
                }
            },
            selected(event) {
                this.$emit('selected', event);
                if(this.item_category.length >= this.maxSelected){
                    this.menuProps.disabled = true
                }
            },
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
                if (this.item_category && this.item_category.length > 0) {
                    const selectedItems = this.item_category.map((name) => {
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
            if(this.attribute && this.attribute !== null){
                this.maxSelected = this.attribute
            }
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        if(this.computedCounterValue < this.maxSelected){
                            this.remoteSearch(val)
                        }
                    } else if(!this.area){
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.archeTypes = null
                    this.remoteSearch('')
                },
                deep: true
            },
            item_categories: {
                handler: function (val) {
                    if(val !== null){ // ini untuk auto select
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
        },
    };
</script>
