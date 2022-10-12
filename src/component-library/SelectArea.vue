<template>
    <v-autocomplete
        v-model="areas"
        :items="items"
        :loading="isLoading"
        item-text="name"
        :name="dataname"
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
                {{ data.item.code }} - {{ data.item.name }}
            </div>
        </template>
        <template v-slot:label>
            <div v-if="label">
                <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
                <span v-else>{{ label }}</span>
            </div>
            <div v-else>
                <span v-if="!norequired">Area<span :class="disabled?'':'text-red'">*</span></span>
                <span v-else>Area</span>
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.code }} - {{ data.item.name }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectArea',
        data() {
            return {
                items: [],
                isLoading: false,
                search:'',
                dataname:'',
                placeholder : '',
                areas:null
            };
        },
        props: ['area','disabled','clear','label','error','aux_data', 'norequired', 'name', "dense"],
        methods: {
            remoteSearch(search) {
                let aux_data = '';
                if (this.aux_data){
                    aux_data = '|aux_data.in:'+this.aux_data;
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                // ini ke endpoint get all
                this.$http.get("/config/area/filter",{params:{
                    perpage:10,
                    conditions:'status:1|name.icontains:'+search + aux_data,
                }}).then(response => {
                    if(response){
                        this.items = response.data.data
                    }
                    if(this.items === null){
                        this.items = []
                    }
                    if (this.area){
                        this.autoSelectByID(this.area)
                    }
                    this.isLoading = false
                    let label = 'Area'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val.id){
                    this.$http.get("/config/area/filter",{params:{
                        conditions:'id.e:'+val.id,
                    }}).then(response => {
                        this.items.push(response.data.data[0])
                        this.areas = response.data.data[0]
                    });
                }
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted() {
            // this.remoteSearch('',this.aux_data);
            if(this.area){
                this.autoSelectByID(this.area)
            }
            if (!this.name) {
                this.dataname = 'area'
            } else {
                this.dataname = this.name
            }
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val)
                    } else if(!this.area){
                        this.remoteSearch('',this.aux_data)
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.areas = null
                },
                deep: true
            },
            area: {
                handler: function (val) {
                    if(val){ // ini untuk auto select
                        this.autoSelectByID(val)
                    } else {
                        this.areas = null
                    }
                },
                deep: true
            },
            aux_data: {
                handler: function (val) {
                    if(val !== null){
                        this.remoteSearch(this.search)
                    }
                },
                deep: true
            },
        },
    };
</script>