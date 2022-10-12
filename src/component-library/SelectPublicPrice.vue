<template>
    <v-autocomplete
        v-model="public_prices"
        :items="items"
        :placeholder="placeholder"
        :loading="isLoading"
        name="PublicPrice"
        item-text="name"
        :dense="dense"
        :class="dense?'':'rounded-form'"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        return-object
        outlined
        :error-messages="error"
        clearable
    >
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.name }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.name }}
        </template>
        <template v-slot:label>
            <div v-if="label">
               <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>{{ label }}</span>
            </div>
            <div v-else>
               <span v-if="!norequired">Public Price<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>Public Price</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectPublicPrice',
        data() {
            return {
                placeholder : '',
                items: [],
                isLoading: false,
                search:'',
                public_prices:null
            };
        },
        props: ['public_price','disabled','clear','error','label', "norequired", "dense"],
        methods: {
            remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/scraping/public_price_set",{params:{
                    conditions:'status:1|name.icontains:'+search,
                }}).then(response => {
                    if(response.data.data){
                        this.items = response.data.data
                    }
                    if(this.items === null){
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Public Price'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                this.public_prices = val
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
                    } else {
                        this.remoteSearch('')
                    }

                },
                deep: true
            },
            clear: {
                handler: function (val) { // ini untuk clear data
                    this.public_prices = null
                },
                deep: true
            },
            public_price:{
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if(val){
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            }
        },
    };
</script>