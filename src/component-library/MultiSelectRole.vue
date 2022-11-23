<template>
    <div>
        <v-row>
            <v-col cols="12">
                <v-autocomplete
                    v-model="roles"
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
                        {{ data.item.name }}
                    </template>
                    <template v-slot:label>
                        <div v-if="label">
                            <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
                            <span v-else>{{ label }}</span>
                        </div>
                        <div v-else>
                            <span v-if="!norequired">Role<span :class="disabled?'':'text-red'">*</span></span>
                            <span v-else>Role</span>
                        </div>
                    </template>
                </v-autocomplete>
            </v-col>
            <v-col cols="12" md="2" v-if="checkbox">
                <v-checkbox 
                    :disabled="disabled"
                    class="-mt40"
                    label="Select All Role" 
                    v-model="all_role"
                    @click="allRole(all_role)"
                ></v-checkbox>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    export default {
        name: 'MultiSelectRole',
        data() {
            return {
                disabledRole: true,
                all_role: false,
                items: [],
                placeholder: '',
                isLoading: false,
                roles: [],
                search: '',
            };
        },
        props: ['role', 'disabled', 'clear', 'label', 'checkbox', 'error', 'aux_data', 'norequired', 'dense', 'division_id'],
        methods: {
            remoteSearch(search) {
                if(division_id !== '' && division_id !== undefined){
                    division_id = "|division_id:" + division_id
                }else{
                    division_id = ''
                }
                this.placeholder = "Loading items..."
                this.isLoading = true
                // ini ke endpoint get all
                this.$http.get("/role", {
                    params: {
                        conditions: 'status:1|name.icontains:' + search + division_id,
                        orderby: '-id'
                    }
                }).then(response => {
                    this.disabledRole = this.disabled
                    if (response.data.data) {
                        this.items = response.data.data
                    } else {
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Role'
                    if (this.label)
                        label = this.label
                    this.placeholder = "Select " + label
                });
            },
            autoSelectByID(val) { // auto select by ID 
                if (val) {
                    this.roles = []
                    for (let i = 0; i < val.length; i++) {
                        this.roles.push(val[i])
                    }
                }
            },
            selected(event) { // select komponen
                this.$emit('selected', event);
                if (event.length - 1) { // disable checkbox ketika clear 1 item
                    this.all_role = false
                }
            },
            allRole(d) { // checkbox untuk select all role
                if (d == true) {
                    this.roles = this.items
                    this.disabledRole = true
                    this.$emit('selected', this.items)
                } else {
                    this.roles = []
                    this.disabledRole = false
                    this.$emit('selected', this.roles)
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
                    } else if (!this.role) {
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: { // untuk clear
                handler: function(val) { // untuk clear
                    this.roles = null;
                    this.all_role = false;
                    this.remoteSearch('', this.area_id)
                },
                deep: true
            },
            role: { // perubahan untuk auto select 
                handler: function(val) {
                    if (val !== null) { // ini untuk auto select
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
            roles: { // untuk search
                handler: function(val) {
                    this.search = ''
                },
                deep: true
            },
            division_id: { // ini fungsi untuk request by division_id
                handler: function (val) {
                    if(val !== null){ // ini untuk auto select
                        this.roles = null
                        this.remoteSearch('',val)
                    }

                },
                deep: true
            },
        },
    };
</script>