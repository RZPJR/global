<template>
    <v-autocomplete
        v-model="customer_classes"
        :items="items"
        :loading="isLoading"
        :item-text="textList"
        name="customer_class"
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
        <template v-slot:label>
            <span v-if="!norequired">
                {{ label }}<span :class="disabled?'':'text-red'">*</span>
            </span>
            <span v-else>
                {{ label }}
            </span>
        </template>
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.id }} - {{ data.item.description }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.id }} - {{ data.item.description }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectCustomerClass',
        data() {
            return {
                items: [],
                isLoading: false,
                search: '',
                customer_classes: null,
                placeholder : '',
            };
        },
        props: ['customer_class','disabled','clear','label','error', 'norequired', 'dense'],
        methods: {
            // For show dropdown suggestion search by code or description
            textList(item){
                return item.id + ' — ' + item.description
            },
            remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true
                // ini ke endpoint get all
                this.$http.get("/crm/v1/customer_class",{params:{
                    page:1,
                    per_page:10,
                    search: search
                }}).then(response => {
                    if (response.data.data && response.data.data !== null && response.data.data !== []) {
                        this.items = response.data.data
                    }
                    this.isLoading = false
                    let label = 'Customer Class'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.customer_classes = val
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
                    } else if(!this.customer_class){
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.customer_classes = null
                    this.remoteSearch('')
                },
                deep: true
            },
            customer_class: {
                handler: function (val) {
                    if(val !== null){ // ini untuk auto select
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            }
        },
    };
</script>