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
        :class="dense?'multi':'rounded-form multi'"
        :dense="dense"
        :error-messages="error"
    >
        <template v-slot:label>
            <span v-if="!norequired">Item Category<span style="color:red">*</span></span>
            <span v-else>Item Category</span>
        </template>
        <template slot="selection" slot-scope="data">
            <v-chip
                close
                @click:close="remove(data.item)"
            >
                {{ data.item.name }}
            </v-chip>
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
            },
            autoSelectByID(val) {
                if(val){
                    this.item_category= []
                    for (let i = 0; i < val.length; i++) {
                        this.item_category.push(val[i])
                    }
                }
            },
            selected(event) {
                this.$emit('selected', event);
            },
            remove (item) {
                const index = this.item_category.indexOf(item)
                // if (index >= 0) 
                this.item_category.splice(index, 1)
                this.$emit('selected', this.item_category);
            },
        },
        watch: {
            search: {
                handler: function (val) {
                    this.remoteSearch('')
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
