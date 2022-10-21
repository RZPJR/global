<template>
    <div>
        <v-autocomplete
            v-model="decline_types"
            :items="items"
            :loading="isLoading"
            item-text="value_name"
            name="DeclineType"
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
                    {{ data.item.value_name }}
                </div>
            </template>
            <template slot="item" slot-scope="data">
                {{ data.item.value_name }}
            </template>
            <template v-slot:label>
                <div v-if="label">
                    <span v-if="!norequired">{{ label }}<span style="color:red">*</span></span>
                    <span v-else>{{ label }}</span>
                </div>
                <div v-else>
                    <span v-if="!norequired">Decline Type<span style="color:red">*</span></span>
                    <span v-else>Decline Type</span>
                </div>
            </template>
        </v-autocomplete>
    </div>
</template>
<script>
    export default {
        name: 'SelectDeclineType',
        data() {
            return {
                items: [],
                placeholder : '',
                isLoading: false,
                search:'',
                dataname:'',
                decline_types:null
            };
        },
        props: ['decline_type','disabled','clear','label','error', 'norequired', 'dense'],
        methods: {
            remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.post("/customer/prospect_customer/decline_type", {})
                    .then(response => {
                    if(response){
                        this.items = response.data.data
                    }
                    if(this.items === null){
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Decline Type'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
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
                    } else if(!this.decline_type){
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.decline_types = null;
                    if(val)this.remoteSearch('')
                },
                deep: true
            },
            decline_type: {
                handler: function (val) {
                    if(val){ // ini untuk auto select
                        this.decline_types=val
                    } 
                },
                deep: true
            },
        },
    };
</script>
