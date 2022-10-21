<template>
    <v-autocomplete
        ref="city"
        class="rounded-form-sm"
        v-model="customers"
        :items="items"
        :loading="isLoading"
        :placeholder="placeholder"
        item-value='city_id'
        item-text="city_name"
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
                {{ data.item.city_name }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.city_name }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectCityTable',
        data() {
            return {
                items: [],
                isLoading: false,
                search: '',
                placeholder : '',
                customers: {
                    city_id: '',
                    city_name: '',
                },
            };
        },
        props: ['city_id', 'disabled', 'clear', 'label', 'error', 'norequired', "refs", "update", 'area_id'],
        methods: {
            focusInput() {
                if(this.$refs.city_id){this.$refs.city_id.focus();}
            },
            // For get data from API
            remoteSearch(search) {
                let area_id = ''
                if(this.area_id){
                    area_id = "|area_id.e:" + this.area_id
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/adm/division/filter", {
                    params: {
                        perpage: 38,
                        conditions:'city_name.icontains:'+search+area_id,
                        fields:'city_id,city_name',
                        groupby:'city_id',
                    }
                }).then(response => {
                    this.loading = false;
                    this.items = []
                    let array = response.data.data
                    if (array != null) {
                        for (let i = 0; i < array.length; i++) {
                            this.items.push(array[i]);
                        }
                    }
                    this.isLoading = false
                    let label = 'City'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if (val) {
                    this.$http.get("/adm/division/filter", {
                        params: {
                            conditions: 'city_id.e:' + val,
                            fields:'city_id,city_name',
                            groupby:'city_id',
                        }
                    }).then(response => {
                        this.customers = response.data.data[0]
                        this.items.push(response.data.data[0]);
                    });
                } else {
                    this.customers = null
                }
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted() {
            if (!this.update) {
                this.remoteSearch('');
            }
        },
        watch: {
            search: {
                handler: function (val) {
                    if (val) {
                        this.remoteSearch(val)
                    }else{
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.customers = null;
                    if (val) this.remoteSearch('')
                },
                deep: true
            },
            area_id: {
                handler: function (val) {
                    this.customers = null;
                    if (val) this.remoteSearch('')
                },
                deep: true
            },
            city_id: {
                handler: function (val) {
                    if (val) { // ini untuk auto select
                        this.autoSelectByID(val)
                    } else {
                        this.customers = null
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