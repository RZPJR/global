<template>
    <v-autocomplete
        v-model="adm_divisions"
        :items="items"
        :loading="isLoading"
        :item-text="textList"
        name="adm_division"
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
               {{ data.item.description }}
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
            {{ data.item.description }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectAdmDivision',
        data() {
            return {
                items: [],
                isLoading: false,
                search: '',
                adm_divisions: null,
                placeholder : '',
            };
        },
        props: ['adm_division','disabled','clear','label','error', 'norequired', 'dense', 'region', 'province', 'city', 'district', 'subdistrict'],
        methods: {
            remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true

                //Getting data from endpoint
                this.$http.get("/configuration/v1/adm_division",{params:{
                    region: this.region,
                    province: this.province,
                    city: this.city,
                    district: this.district,
                    subdistrict: this.subdistrict,
                }}).then(response => {
                    this.items = [];
                    if (response.data.data && response.data.data !== null && response.data.data !== []) {
                        this.typeHandler(response.data.data);
                    }
                    this.isLoading = false
                    let label = 'Adm Division'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            textList(item){
                return item.description
            },
            // For show dropdown suggestion search by code or description
            typeHandler(val) {
                const sortedArray = val.sort();
                switch (this.label) {
                    case 'Region':
                        sortedArray.forEach((element) => {
                            this.items.push({
                                description: element.region,
                            });
                        });
                        break;
                    case 'Province':
                        sortedArray.forEach((element) => {
                            this.items.push({
                                description: element.province,
                            });
                        });
                        break;
                    case 'City':
                        sortedArray.forEach((element) => {
                            this.items.push({
                                description: element.city,
                            });
                        });
                        break;
                    case 'District':
                        sortedArray.forEach((element) => {
                            this.items.push({
                                description: element.district,
                            });
                        });
                        break;
                    case 'Subdistrict':
                        sortedArray.forEach((element) => {
                            this.items.push({
                                description: element.sub_district,
                                postal_code: element.postal_code
                            });
                        });
                        break;
                }
            },
            autoSelectByID(val) {
                if(val){
                    this.adm_divisions = val
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
                    } else if(!this.adm_division){
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.adm_divisions = null
                    this.remoteSearch('')
                },
                deep: true
            },
            adm_division: {
                handler: function (val) {
                    this.adm_divisions = null
                    if(val !== null || val !== ''){ // ini untuk auto select
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
            region: {
                handler: function (val) {
                    if(val !== null){ // reder remote search
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            province: {
                handler: function (val) {
                    if(val !== null){ // reder remote search
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            city: {
                handler: function (val) {
                    if(val !== null){ // reder remote search
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            district: {
                handler: function (val) {
                    if(val !== null){ // reder remote search
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            subdistrict: {
                handler: function (val) {
                    if(val !== null){ // reder remote search
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
        },
    };
</script>