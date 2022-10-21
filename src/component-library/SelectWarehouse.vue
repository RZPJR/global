<template>
    <v-autocomplete
        v-model="warehouses"
        :items="items"
        :placeholder="placeholder"
        :loading="isLoading"
        item-text="name"
        :name="dataname"
        :search-input.sync="search"
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
        <template slot="item" slot-scope="data">
            {{ data.item.code }} - {{ data.item.name }}
        </template>
        <template v-slot:label>
            <div v-if="label">
                <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
                <span v-else>{{ label }}</span>
            </div>
            <div v-else>
                <span v-if="!norequired">Warehouse<span :class="disabled?'':'text-red'">*</span></span>
                <span v-else>Warehouse</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectWarehouse',
        data() {
            return {
                items: [],
                placeholder : '',
                isLoading: false,
                search:'',
                dataname:'',
                warehouses:null
            };
        },
        props: ['warehouse','disabled','clear','label','error','area_id','update', 'norequired', 'aux_data', 'subdistrict_id', "name", "dense"],
        methods: {
            remoteSearch(search,area_id) {
                if(area_id !== '' && area_id !== undefined && area_id != 65536){
                    area_id = "|area_id.e:"+area_id
                }else{
                    area_id = ''
                }
                let aux = ''
                if (this.aux_data) {
                    aux = '|aux_data:' +this.aux_data
                }

                let subdistrictId = ''
                if (this.subdistrict_id) {
                    subdistrictId = '|subdistrict.id.e:' +this.subdistrict_id
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                // ini ke endpoint get all
                this.$http.get("/config/warehouse/filter",{params:{
                    perpage:10,
                    conditions:'status:1|name.icontains:'+search+area_id+aux+subdistrictId,
                }}).then(response => {
                    if(response){
                        this.items = response.data.data
                    }
                    if(this.items == null){
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Warehouse'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                this.$http.get("/config/warehouse/filter",{params:{
                        conditions:'id.e:'+val.id,
                    }}).then(response => {
                        if (response.data.data === null) {
                            this.items = []
                            this.warehouses = null
                        }
                        this.items.push(response.data.data[0])
                        this.warehouses = response.data.data[0]
                });
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        created() {
            // this.remoteSearch('', '');
            if (!this.name) {
                this.dataname = 'warehouse'
            } else {
                this.dataname = this.name
            }
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val,this.area_id)
                    } else if(!this.warehouse){
                        this.remoteSearch('',this.area_id)
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.warehouses = null;
                    if(val)this.remoteSearch('','')
                },
                deep: true
            },
            warehouse: {
                handler: function (val) {
                    if(val){ // ini untuk auto select
                        this.autoSelectByID(val)
                    } else {
                        this.warehouses = null
                    }
                },
                deep: true
            },
            area_id: { // ini fungsi untuk request by area_id
                handler: function (val) {
                    if(val){ // ini untuk auto select
                        this.remoteSearch('',val)
                    } else {
                        this.warehouses = null
                    }
                },
                deep: true
            },
            subdistrict_id: {
                handler: function (val) {
                    if(val){ // ini untuk auto select
                        this.remoteSearch('',this.area_id)
                    } else {
                        this.warehouses = null
                    }
                },
                deep: true
            },
        },
    };
</script>
