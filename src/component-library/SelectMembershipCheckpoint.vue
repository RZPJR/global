<template>
    <v-autocomplete
        v-model="checkpoints"
        :items="items"
        :loading="isLoading"
        item-text="checkpoint"
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
                {{ data.item.checkpoint }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.checkpoint }}
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
        name: 'SelectMembershipCheckpoint',
        data() {
            return {
                items: [],
                placeholder: '',
                isLoading: false,
                search: '',
                checkpoints: null
            };
        },
        props: ['checkpoint', 'disabled', 'clear', 'error', "dense", 'label', 'norequired', 'level'],
        methods: {
            remoteSearch() {
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/campaign/v1/membership/checkpoint", {params:{
                    status:1,
                    level: this.level
                }}).then(response => {
                    this.items = []
                    if (response.data.data && response.data.data !== null && response.data.data !== []) {
                        this.items = response.data.data
                    }
                    this.isLoading = false
                    let label = 'Membership Checkpoint'
                    if (this.label) label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) { // auto select by ID
                if (val) {
                    this.checkpoints = val
                } else {
                    this.checkpoints = null
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
                    } else if (!this.checkpoint) {
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: { // untuk clear
                handler: function(val) {
                    this.checkpoints = null
                    this.remoteSearch('', true)
                },
                deep: true
            },
            checkpoint: { // props
                handler: function(val) {
                    if (val) { // for auto select
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
            level: { // ini fungsi untuk request by membership level
                handler: function (val) {
                    if(val){ // ini untuk auto select
                        this.remoteSearch('')
                    }else{
                        this.checkpoints = null
                    }
                },
                deep: true
            },
        },
    };
</script>
