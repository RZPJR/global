<template>
    <v-autocomplete
        v-model="item_class"
        :items="items"
        :loading="isLoading"
        item-text="description"
        name="item_class"
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
                {{ data.item.code }} - {{ data.item.description }}
            </div>
        </template>
        <template v-slot:label>
           <span v-if="!norequired">
                Item Class<span :class="disabled?'':'text-red'">*</span>
            </span>
           <span v-else>
            Item Class
            </span>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.code }} - {{ data.item.description }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectItemClass',
        data() {
            return {
                items: [],
                isLoading: false,
                search:'',
                item_class:null,
                placeholder : '',
            };
        },
        props: ['item_classes','disabled','clear','label','error', 'norequired', 'dense'],
        methods: {
            remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true
                // ini ke endpoint get all
                this.$http.get("/bridge/v1/class",{params:{
                    perpage:10,
                    conditions:'status:1|name.icontains:'+search,
                }}).then(response => {
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Item Class'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.$http.get("/bridge/v1/class",{params:{
                        conditions:'id.e:'+val.id,
                    }}).then(response => {
                        this.items.push(response.data.data[0])
                        this.item_class = response.data.data[0]
                    });
                }

            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val)
                    } else if(!this.item_classes){
                        this.remoteSearch('')
                    }

                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.item_class = null
                    this.remoteSearch('','')
                },
                deep: true
            },
            item_classes: {
                handler: function (val) {
                    if(val !== null){ // ini untuk auto select
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            }
        },
    };
</script>