<template>
    <v-autocomplete
        ref="sub_district"
        class="rounded-form-sm"
        v-model="data_value"
        :items="items"
        :loading="isLoading"
        :placeholder="placeholder"
        item-value='sub_district_id'
        item-text="sub_district_name"
        :no-filter="true"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        return-object
        outlined
        :error-messages="error"
        dense
        style="margin-bottom:-24px"
    >
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.sub_district_name }} - {{ data.item.district_name }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.sub_district_name }} - {{ data.item.district_name }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectSubDistrictTable',
        data() {
            return {
                items: [],
                placeholder : '',
                isLoading: false,
                search: '',
                data_value: {
                    sub_district_id: '',
                    sub_district_name: '',
                    district_name: '',
                },
            };
        },
        props: ['sub_district_id', 'disabled', 'clear', 'label', 'error', 'norequired', "refs", "update", 'area_id'],
        methods: {
            focusInput() {
                if(this.$refs.sub_district_id){this.$refs.sub_district_id.focus();}
            },
            // For get data from API
            remoteSearch() {
                let search = ''
                if(this.search){
                    search = this.search
                }
                let area_id = ''
                if(this.area_id){
                    area_id = "|area_id.e:" + this.area_id
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/adm/division/filter", {
                    params: {
                        perpage:50,
                        conditions:'sub_district_name.icontains:'+search+area_id,
                        fields:'sub_district_id,sub_district_name,district_id,district_name,city_id,city_name,area_name,area_id',
                        groupby:'sub_district_id'
                    }
                }).then(response => {
                    this.items = []
                    let array = response.data.data
                    if (array != null) {
                        for (let i = 0; i < array.length; i++) {
                            this.items.push(array[i]);
                        }
                    }
                    this.isLoading = false
                    let label = 'Sub District'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if (val) {
                    this.$http.get("/adm/division/filter", {
                        params: {
                            conditions: 'sub_district_id.e:' + val,
                            fields:'sub_district_id,sub_district_name,district_id,district_name,city_id,city_name,area_name,area_id',
                            groupby:'sub_district_id',
                        }
                    }).then(response => {
                        this.data_value = response.data.data[0]
                        this.items.push(response.data.data[0]);
                    });
                } else {
                    this.data_value = null
                }
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted() {
            if(this.sub_district_id){
                this.autoSelectByID(this.sub_district_id)
            }
        },
        watch: {
            search: {
                handler: function (val) {
                    if (val) {
                        this.remoteSearch()
                    }else{
                        if(!this.sub_district_id){
                            this.search = ''
                            this.remoteSearch()
                        }
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.data_value = null;
                    if (val) this.remoteSearch()
                },
                deep: true
            },
            area_id: {
                handler: function (val) {
                    this.data_value = null;
                    if (val) this.remoteSearch()
                },
                deep: true
            },
            sub_district_id: {
                handler: function (val) {
                    if (val) { // ini untuk auto select
                        this.autoSelectByID(val)
                    } else {
                        this.data_value = null
                    }

                },
                deep: true
            },
            refs: {
                handler: function (val) {
                    if(val){
                        let idx = val.split('-')[0];
                        let length = val.split(',')[1];
                        if (idx == length) {
                            this.focusInput()
                        }
                    }
                },
                deep: true
            }
        },
    };
</script>