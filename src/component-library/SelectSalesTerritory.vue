<template>
    <v-autocomplete
        v-model="territories"
        :items="items"
        :loading="isLoading"
        :item-text="textList"
        name="territory"
        :search-input.sync="search"
        :placeholder="placeholder"
        @change="selected"
        :disabled="disabled"
        return-object
        clearable
        outlined
        :dense="dense"
        :error-messages="error"
    >
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.id }} - {{ data.item.description }}
            </div>
        </template>
        <template v-slot:label>
            <span v-if="!norequired">
                {{ label }}<span :class="disabled?'':'text-red'">*</span>
            </span>
            <span v-else>
                {{ label }}
            </span>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.id }} - {{ data.item.description }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectSalesTerritory',
        data() {
            return {
                items: [],
                isLoading: false,
                search: '',
                territories: null,
                placeholder : '',
            };
        },
        props: ['territory','disabled','clear','label','error', 'norequired', 'dense', 'region', 'province', 'city', 'district', 'subdistrict'],
        methods: {
            remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true

                //Getting data from endpoint
                this.$http.get("/sales/v1/sales_territory",{params:{
                    page: 1,
                    per_page: 10,
                    search: search,
                }}).then(response => {
                    this.items = [];
                    if (response.data.data && response.data.data !== null && response.data.data !== []) {
                        this.items = response.data.data
                    }
                    this.isLoading = false
                    let label = 'Adm Division'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            textList(item){
                return item.id + '-' + item.description
            },
            autoSelectByID(val) {
                if(val){
                    this.territories = val
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
                    } else if(!this.territory){
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.territories = null
                    this.remoteSearch('')
                },
                deep: true
            },
            territory: {
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