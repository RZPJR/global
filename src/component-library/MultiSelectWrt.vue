<template>
    <div>
        <v-row>
            <v-col cols="12">
                <v-autocomplete
                    v-model="wrts"
                    :items="items"
                    :loading="isLoading"
                    :placeholder="placeholder"
                    item-value="code"
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
                        {{data.item.code}} - {{ data.item.name }}
                    </template>
                    <template v-slot:label>
                        <div v-if="label">
                            <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
                            <span v-else>{{ label }}</span>
                        </div>
                        <div v-else>
                            <span v-if="!norequired">WRT<span :class="disabled?'':'text-red'">*</span></span>
                            <span v-else>WRT</span>
                        </div>
                    </template>
                </v-autocomplete>
            </v-col>
            <v-col cols="12" md="2" v-if="checkbox">
                <v-checkbox 
                    :disabled="disabled"
                    class="-mt40"
                    label="Select All WRT" 
                    v-model="all_wrt"
                    @click="allWrt(all_wrt)"
                ></v-checkbox>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    export default {
        name: 'MultiSelectWrt',
        data() {
            return {
                disabledWrt: true,
                all_wrt: false,
                items: [],
                placeholder: '',
                isLoading: false,
                wrts: [],
                search: '',
            };
        },
        props: ['wrt', 'disabled', 'clear', 'label', 'checkbox', 'error', 'aux_data', 'norequired', 'area_id', 'dense'],
        methods: {
            remoteSearch(search) {
                let area_id = ''
                if (this.area_id) {
                    area_id = '|area_id.id.e:' + this.area_id
                }
                this.placeholder = "Loading items..."
                this.isLoading = true
                // ini ke endpoint get all
                this.$http.get("/config/wrt", {
                    params: {
                        conditions: 'status:1|name.icontains:' + search + '%2COr.code.icontains:' + search + area_id,
                        orderby: 'name'
                    }
                }).then(response => {
                    this.disabledWrt = this.disabled
                    if (response.data.data) {
                        this.items = response.data.data
                    } else {
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'WRT'
                    if (this.label)
                        label = this.label
                    this.placeholder = "Select " + label
                });
            },
            autoSelectByID(val) { // auto select by ID 
                if (val) {
                    this.wrts = []
                    for (let i = 0; i < val.length; i++) {
                        this.wrts.push(val[i])
                    }
                }
            },
            selected(event) { // select komponen
                this.$emit('selected', event);
                if (event.length - 1) { // disable checkbox ketika clear 1 item
                    this.all_wrt = false
                }
            },
            allWrt(d) { // checkbox untuk select all wrt
                if (d == true) {
                    this.wrts = this.items
                    this.disabledWrt = true
                    this.$emit('selected', this.items)
                } else {
                    this.wrts = []
                    this.disabledWrt = false
                    this.$emit('selected', this.wrts)
                }
            },
        },
        watch: {
            search: { // untuk search
                handler: function(val) {
                    if (val) {
                        if (this.computedCounterValue < this.maxSelected) {
                            this.remoteSearch(val)
                        }
                    } else if (!this.wrt) {
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: { // untuk clear
                handler: function(val) { // untuk clear
                    this.wrts = null;
                    this.all_wrt = false;
                    this.remoteSearch('', this.area_id)
                },
                deep: true
            },
            wrt: { // perubahan untuk auto select 
                handler: function(val) {
                    if (val !== null) { // ini untuk auto select
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
            wrts: { // untuk search
                handler: function(val) {
                    this.search = ''
                },
                deep: true
            },
            area_id: { // ini untuk props area
                handler: function(val) {
                    this.wrts = null
                    this.all_wrt = false                    
                    if (val) {
                        this.remoteSearch('', val)
                    } 
                },
                deep: true
            },
        },
    };
</script>