<template>
    <v-autocomplete
        v-model="uoms"
        :items="items"
        :loading="isLoading"
        :item-text="textList"
        name="uom"
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
                {{ data.item.id }} - {{ data.item.name }}
            </div>
        </template>
        <template v-slot:label>
           <span v-if="!norequired">
                UOM<span :class="disabled?'':'text-red'">*</span>
            </span>
           <span v-else>
                UOM
            </span>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.id }} - {{ data.item.name }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectUom',
        data() {
            return {
                items: [],
                isLoading: false,
                search:'',
                uoms:null,
                placeholder : '',
            };
        },
        props: ['uom','disabled','clear','label','error', 'norequired', 'dense'],
        methods: {
            // For show dropdown suggestion search by code or description
            textList(item){
                return item.id + ' — ' + item.name
            },
            remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true
                // ini ke endpoint get all
                this.$http.get("/catalog/v1/uom",{params:{
                    page:1,
                    per_page:10,
                }}).then(response => {
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'UOM'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.uoms = val
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
                    } else if(!this.uom){
                        this.remoteSearch('')
                    }

                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.uoms = null
                    this.remoteSearch('','')
                },
                deep: true
            },
            uom: {
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