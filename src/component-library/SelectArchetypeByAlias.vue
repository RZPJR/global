<template>
    <v-autocomplete
        v-model="archetypes"
        :items="items"
        :loading="isLoading"
        item-text="name"
        label="Type"
        :search-input.sync="search"
        placeholder="Select Type"
        @change="selected"
        :disabled="disabled"
        return-object
        clearable
        outlined
        class="rounded-form"
    >
        <template slot="selection" slot-scope="data">
            {{ data.item.name_id }}
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.name_id }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectArchetypeByAlias',
        data() {
            return {
                items: [],
                isLoading: false,
                search:'',
                archetypes:null
            };
        },
        props: ['archetype','disabled','clear','label'],
        methods: {
            remoteSearch(search) {
                // ini ke endpoint get all
                this.$http.get("/customer/archetype/filter?embeds=business_type_id",{params:{
                        perpage:20,
                        conditions:'status:1|name_id.icontains:'+search,
                    }}).then(response => {
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                    this.isLoading = false
                });
            },
            autoSelectByID(val) {
                if(val){
                    // ini ke endpoint detail
                    this.$http.get("/customer/archetype/filter?embeds=business_type_id",{params:{
                        conditions:'id.e:'+val.id,
                    }}).then(response => {
                        this.items.push(response.data.data[0])
                        this.archetypes = response.data.data[0]
                    });
                }

            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted() {
            // this.remoteSearch('', true);
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val, this.business_type_id,this.aux_data)
                    } else if(!this.archetype){
                        this.remoteSearch('', this.business_type_id,this.aux_data);
                    }

                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.archetypes = null
                    this.remoteSearch('',true)
                },
                deep: true
            },
            archetype: {
                handler: function (val) {
                    if(val){ // ini untuk auto select
                        this.autoSelectByID(val)
                    }

                },
                deep: true
            },
        },
    };
</script>