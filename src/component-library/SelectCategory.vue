<template>
    <v-autocomplete
        v-model="categories"
        :items="items"
        :loading="isLoading"
        item-text="name"
        name="category"
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
        <template slot="item" slot-scope="data">
            {{ data.item.code }} - {{ data.item.name }}
        </template>
        <template v-slot:label>
           <span v-if="!norequired">
                Category<span :class="disabled?'':'text-red'">*</span>
            </span>
           <span v-else>
                Category
            </span>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectCategory',
        data() {
            return {
                items: [],
                isLoading: false,
                search:'',
                placeholder : '',
                categories:null,

            };
        },
        props: ['category','disabled','clear','label','error', 'norequired', "dense"],
        methods: {
            remoteSearch(search) {
                // ini ke endpoint get all
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/inventory/category/filter",{params:{
                    perpage:20,
                    conditions:'status:1|name.icontains:'+search,
                }}).then(response => {
                    if(response.data.data){
                        this.items = response.data.data
                    }
                    if(this.items === null){
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Category'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.$http.get("/inventory/category/filter",{params:{
                        conditions:'id.e:'+val.id,
                    }}).then(response => {
                        this.items.push(response.data.data[0])
                        this.categories = response.data.data[0]
                    });
                }
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted() {
            // this.remoteSearch('');
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val)
                    } else if(!this.category){
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.categories = null
                    this.remoteSearch('',true)
                },
                deep: true
            },
            category: {
                handler: function (val) {
                    if(val){ // for auto select
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
        },
    };
</script>