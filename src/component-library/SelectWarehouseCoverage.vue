<template>
    <v-autocomplete
        v-model="warehouses"
        :items="items"
        :placeholder="placeholder"
        :loading="isLoading"
        item-text="name"
        name="warehouse"
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
        <template slot="item" slot-scope="data">
            {{ data.item.code }} - {{ data.item.name }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectWarehouseCoverage',
        data() {
            return {
                items: [],
                placeholder : '',
                isLoading: false,
                search:'',
                warehouses:null
            };
        },
        props: ['warehouse','disabled','clear','label','error','subdistrict_id','update', 'norequired', 'aux_data', "dense"],
        methods: {
            remoteSearch(search) {
                let subdistrictID = ''
                if(this.subdistrict_id){
                    subdistrictID = "|subdistrict.id.e:" + this.subdistrict_id
                }
                this.items = []
                this.placeholder="Loading items..."
                this.isLoading = true

                this.$http.get("/config/warehouse/coverage/filter",{params:{
                    perpage:10,
                    embeds:"warehouse,subdistrict,warehouse.area,warehouse.subdistrict",
                    conditions:'warehouse.status:1|warehouse.name.icontains:'+search+subdistrictID,
                }}).then(response => {
                    this.items = []
                    let array = response.data.data
                    if (array != null) {
                        for (let i = 0; i < array.length; i++) {
                            this.items.push(array[i].warehouse)
                            // if ( array[i].main_warehouse == 1 && this.subdistrict_id) {
                            //     this.warehouses = array[i].warehouse
                            // }
                        }
                    }
                    this.isLoading = false
                    let label = 'Warehouse'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                // this.$http.get("/config/warehouse/coverage/filter",{params:{
                //         embeds:"warehouse,subdistrict,warehouse.area,warehouse.subdistrict",
                //         conditions:'warehouse.id.e:'+val.id,
                //     }}).then(response => {
                //     this.items.push(response.data.data[0].warehouse)
                //     this.warehouses = response.data.data[0].warehouse
                // });
                if(val){
                    this.items.push(val)
                    this.warehouses = val
                }
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        created() {
            // this.remoteSearch('', '');
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val)
                    } else if(!this.warehouse){
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.warehouses = null;
                    if(val)this.remoteSearch('')
                },
                deep: true
            },
            warehouse: {
                handler: function (val) {
                    if(val !== null && val !== ''){ // ini untuk auto select
                        this.autoSelectByID(val)
                    } else {
                        this.warehouses = null
                    }

                },
                deep: true
            },
            subdistrict_id: { // ini fungsi untuk request by area_id
                handler: function (val) {
                    if(val){ // ini untuk auto select
                        this.remoteSearch('')
                    } else {
                        this.warehouses = null
                    }
                },
                deep: true
            },
        },
    };
</script>
