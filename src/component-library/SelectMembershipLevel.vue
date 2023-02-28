<template>
    <v-autocomplete
        v-model="levels"
        :items="items"
        :loading="isLoading"
        item-text="name"
        item-value="id"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        return-object
        outlined
        :placeholder="placeholder"
        dense
        required
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
           <span v-if="!norequired">
                {{label}}<span class="text-red">*</span>
            </span>
           <span v-else>
                {{label}}
            </span>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectMembershipLevel',
        data() {
            return {
                items: [],
                placeholder: '',
                isLoading: false,
                search: '',
                levels: null
            };
        },
        props: ['level', 'disabled', 'clear', 'error', "dense", 'attribute', 'label', 'norequired'],
        methods: {
            remoteSearch() {
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/campaign/v1/membership/level", {params:{
                    status:1
                }}).then(response => {
                    this.items = []
                    if (response.data.data && response.data.data !== null && response.data.data !== []) {
                        this.items = response.data.data
                    }
                    this.isLoading = false
                    let label = 'Membership Level'
                    if (this.label) label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) { // auto select by ID
                if (val) {
                    this.levels = val
                } else {
                    this.levels = null
                }
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted() {
            this.remoteSearch();
        },
        watch: {
            search: { // untuk search
                handler: function(val) {
                    if (val) {
                        this.remoteSearch(val)
                    } else if (!this.level) {
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: { // untuk clear
                handler: function(val) {
                    this.levels = null
                    this.remoteSearch('', true)
                },
                deep: true
            },
            level: { // props
                handler: function(val) {
                    if (val) { // for auto select
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
        },
    };
</script>
