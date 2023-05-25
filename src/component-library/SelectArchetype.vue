<template>
    <v-autocomplete
        v-model="archetypes"
        :items="items"
        :loading="isLoading"
        :item-text="textList"
        name="archetype"
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
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.code }} - {{ data.item.description }}
            </div>
        </template>
        <template v-slot:label>
            <span v-if="!norequired">
                {{ label }}<span :class="disabled?'':'text-red'">*</span>
            </span>
            <span v-else>
                {{ label }}
            </span>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.code }} - {{ data.item.description }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectArchetype',
        data() {
            return {
                items: [],
                isLoading: false,
                search: '',
                archetypes: null,
                placeholder : '',
            };
        },
        props: ['archetype','disabled','clear','label','error', 'norequired', 'dense','customer_type_id'],
        methods: {
            remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true

                //Getting data from endpoint
                this.$http.get("/crm/v1/archetype",{params:{
                    page: 1,
                    per_page: 10,
                    search: search,
                    customer_type_id: this.customer_type_id
                }}).then(response => {
                    this.items = [];
                    if (response.data.data && response.data.data !== null && response.data.data !== []) {
                        this.items = response.data.data
                    }
                    let label = 'Archetype'
                    if (this.label) 
                    	label = this.label
                    this.isLoading = false
                    this.placeholder = "Select "+ label
                });
            },
            textList(item){
                return item.description
            },
            autoSelectByID(val) {
                if(val){
                    this.archetypes = val
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
                    } else if(!this.archetype){
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.archetypes = null
                    this.remoteSearch('')
                },
                deep: true
            },
            archetype: {
                handler: function (val) {
                    if(val !== null){ // ini untuk auto select
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
			customer_type_id: { // ini fungsi untuk request by customer type
				handler: function (val) {
					if (val) {
						this.remoteSearch('');
					}
				},
				deep: true,
			},
        },
    };
</script>