<template>
    <v-autocomplete
        v-model="price_sets"
        :items="items"
        :loading="isLoading"
        :placeholder="placeholder"
        item-text="name"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        return-object
        outlined
        :error-messages="error"
        clearable
        :dense="dense"
        :class="dense?'':'rounded-form'"
    >
        <template v-slot:label>
            <div class="select-item">
                <div v-if="label">
                    <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
                    <span v-else>{{ label }}</span>
                </div>
                <div v-else>
                    <span v-if="!norequired">Price Set<span :class="disabled?'':'text-red'">*</span></span>
                    <span v-else>Price Set</span>
                </div>
            </div>
        </template>
        <template slot="selection" slot-scope="data">
            {{ data.item.name }}
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.name }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectPriceSet',
        data() {
            return {
                items: [],
                placeholder : '',
                isLoading: false,
                search:'',
                price_sets:null
            };
        },
        props: ['price_set','disabled','clear','error',"label", 'norequired', 'idx', "dense"],
        methods: {
            remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/price/set/filter",{params:{
                    perpage:10,
                    conditions:'status:1|name.icontains:'+search,
                }}).then(response => {
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Price Set'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.$http.get("/price/set/filter",{params:{
                        conditions:'id.e:'+val.id,
                    }}).then(response => {
                        this.items.push(response.data.data[0])
                        this.price_sets = response.data.data[0]
                        this.isLoading = false
                    });
                }
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted() {
            // this.remoteSearch('', true);
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val)
                    } else if(!this.price_set){
                        this.remoteSearch("")
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) { // ini untuk clear data
                    this.price_sets = null
                    if(val)this.remoteSearch('')
                },
                deep: true
            },
            price_set:{
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if(val){
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
            price_sets:{
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if(val == null){
                        this.$emit('deleted', this.idx);
                    }
                },
                deep: true
            }
        },
    };
</script>