<template>
    <v-autocomplete
        v-model="glossary"
        :items="items"
        :loading="isLoading"
        :placeholder="placeholder"
        item-text="value_name"
        :menu-props="menuProps"
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
        <template v-slot:label>
            <span v-if="!norequired">Skills<span class="text-red">*</span></span>
            <span v-else>Skills</span>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.value_name }}
        </template>
    </v-autocomplete>
</template>

<script>
    export default {
        name: 'MultiSelectGlossary',
        data() {
            return {
                items: [],
                placeholder: '',
                isLoading: false,
                glossary: [],
                menuProps: {
                    disabled: false
                },
                search: '',
            };
        },
        props: ['skill', 'disabled', 'clear', 'label', 'error', 'aux_data', 'norequired', 'attribute', 'dense'],
        methods: {
            remoteSearch(search) {
                this.placeholder = "Loading items..."
                this.isLoading = true
                // ini ke endpoint get all
                this.$http.get("/config/glossary", {
                    params: {
                        perpage: 10,
                        conditions: 'table:vehicle_profiles|attribute:skills' + search,
                        orderby: '-id',
                    }
                }).then(response => {
                    if (response.data.data) {
                        response.data.data.forEach((value, index) => {
                            this.items.push(response.data.data[index])
                        });
                    }
                    this.isLoading = false
                    let label = 'Skills'
                    if (this.label)
                        label = this.label
                    this.placeholder = "Select " + label
                });
            },
            autoSelectByID(val) { // select by ID
                if (val) {
                    this.glossary = []
                    for (let i = 0; i < val.length; i++) {
                        this.glossary.push(val[i])
                    }
                }
            },
            selected(event) { // props selected
                this.$emit('selected', event);
            },
        },
        watch: {
            search: {
                handler: function(val) { // search
                    if (val) {
                        if (this.computedCounterValue < this.maxSelected) {
                            this.remoteSearch(val)
                        }
                    } else if (!this.skill) {
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function(val) { // clear
                    this.glossary = null
                    this.remoteSearch('')
                },
                deep: true
            },
            skill: {
                handler: function(val) {
                    if (val !== null) { // ini untuk auto select
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
            glossary: { // auto select
                handler: function(val) {
                    this.search = ''
                },
                deep: true
            },
        },
    };
</script>
