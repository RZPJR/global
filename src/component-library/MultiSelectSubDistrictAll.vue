<template>
    <v-autocomplete
        v-model="sub_districts"
        :items="items"
        :loading="isLoading"
        :placeholder="placeholder"
        item-text="name"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        return-object
        clearable
        outlined
        chips
        multiple
        deletable-chips
        class="multi"
        :dense="dense"
        :error-messages="error"
    >
        <template slot="item" slot-scope="data">
            {{ data.item.name }}
        </template>
        <template v-slot:label>
            <div v-if="label">
                <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
                <span v-else>{{ label }}</span>
            </div>
            <div v-else>
                <span v-if="!norequired">Sub District<span :class="disabled?'':'text-red'">*</span></span>
                <span v-else>Sub District</span>
            </div>
        </template>
    </v-autocomplete>
</template>

<script>
    export default {
        name: 'MultiSelectSubDistrictAll',
        data() {
            return {
                items: [],
                placeholder: '',
                isLoading: false,
                sub_districts: [],
                search: '',
            };
        },
        props: ['sub_district', 'disabled', 'clear', 'label', 'error', 'aux_data', 'norequired','district_id', 'city_id','area_id', 'warehouse', 'dense'],
        methods: {
            remoteSearch(search) {
                let warehouse
                if (this.warehouse) {
                    warehouse = "|warehouse_id.e:" + this.warehouse
                } else {
                    warehouse = ''
                }
                let area_id
                if (this.area_id) {
                    area_id = "|warehouse.area.id.e:" + this.area_id
                } else {
                    area_id = ""
                }
                let city_id
                if (this.city_id) {
                    city_id = "|subdistrict.district.city.id.e:" + this.city_id
                } else {
                    city_id = ""
                }
                let district_id
                if (this.district_id) {
                    district_id = "|subdistrict.district.id.e:" + this.district_id
                } else {
                    district_id = ""
                }
                this.items = []
                this.isLoading = true
                this.placeholder = "Loading items..."
                // ini ke endpoint get all
                this.$http.get("/config/warehouse/coverage", {
                    params: {
                        perpage: 10,
                        conditions: 'subdistrict.name.icontains:' + search + warehouse + city_id + district_id + area_id,
                        embeds: 'warehouse,warehouse.area,subdistrict,subdistrict.district,subdistrict.district.city,subdistrict.district.city.province',
                    }
                }).then(response => {
                    let arr = []
                    if (response.data.data != null) {
                        arr = response.data.data
                    }
                    for (let i = 0; i < arr.length; i++) {
                        this.items.push({
                            id: arr[i].sub_district.id,
                            name: arr[i].sub_district.name
                        })
                    }
                    this.isLoading = false
                    let label = 'Sub District'
                    if (this.label)
                        label = this.label
                    this.placeholder = "Select " + label
                }).then(() => { // looping untuk multi select
                    if (this.sub_districts) {
                        for (let i = 0; i < this.sub_districts.length; i++) {
                            let item = false
                            this.items.forEach(e => {
                                if (e.id == this.sub_districts[i].id) {
                                    item = true
                                }
                            })
                            if (item == false) {
                                this.items.push(this.sub_districts[i])
                            }
                        }
                    } else {
                        this.sub_districts = null
                    }
                })
            },
            autoSelectByID(val) { // untuk get by ID
                if (val) {
                    this.sub_districts = []
                    for (let i = 0; i < val.length; i++) {
                        let item = false
                        this.items.forEach(e => {
                            if (e.id == val[i].id) {
                                item = true
                            }
                        })
                        if (item == false) {
                            this.items.push(val[i])
                        }
                        this.sub_districts.push(val[i])
                    }
                }
            },
            selected(event) { // untuk selected komponen
                this.$emit('selected', event);
            },
        },
        watch: {
            search: { // untuk search
                handler: function(val) {
                    if (val) {
                        this.remoteSearch(val)
                    } else {
                        this.remoteSearch('', this.warehouse, this.city_id, this.district_id, this.area_id)
                    }
                },
                deep: true
            },
            clear: {
                handler: function(val) { // untuk clear
                    this.sub_districts = null
                    this.remoteSearch('', this.warehouse, this.city_id, this.district_id, this.area_id)
                },
                deep: true
            },
            sub_district: {
                hahandler: function(val) {
                    if (val) { // ini untuk auto select
                        this.autoSelectByID(val)
                    } else {
                        this.sub_districts = null
                    }
                },
                deep: true
            },
            sub_districts: { // untuk search
                handler: function(val) {
                    this.search = ''
                },
                deep: true
            },
            warehouse: { // untuk props warehouse
                handler: function(val) {
                    this.sub_districts = null
                    if (val !== null && val !== '') { // ini untuk auto select
                        this.remoteSearch('')
                    } else {
                        this.sub_districts = null
                    }
                },
                deep: true
            },
            area_id: { // untuk props area
                handler: function(val) {
                    this.sub_districts = null
                    if (val !== null && val !== '') { // ini untuk auto select
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            city_id: { // untuk props city
                handler: function(val) {
                    if (val !== null && val !== '') { // ini untuk auto select
                        this.remoteSearch('')
                    } 
                },
                deep: true
            },
            district_id: { // untuk props district
                handler: function(val) {
                    if (val !== null && val !== '') { // ini untuk auto select
                        this.remoteSearch('')
                    } 
                },
                deep: true
            },
        },
    };
</script>
