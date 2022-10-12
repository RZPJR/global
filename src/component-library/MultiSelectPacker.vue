<template>
    <v-autocomplete
        v-model="packers"
        :items="items"
        :placeholder="placeholder"
        :loading="isLoading"
        item-text="name"
        :search-input.sync="search"
        :menu-props="menuProps"
        @input="adjustOptions"
        @change="selected"
        :disabled="disabled"
        return-object
        clearable
        outlined
        chips
        multiple
        deletable-chips
        :class="dense?'':'rounded-form'"
        :dense="dense"
        :error-messages="error"
    >
        <template v-slot:label>
            <span v-if="!norequired">Packer<span style="color:red">*</span></span>
            <span v-else>Packer</span>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.code }} - {{ data.item.name }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'MultiSelectPacker',
        data() {
            return {
                items: [],
                placeholder : '',
                isLoading: false,
                search:'',
                menuProps: {
                    disabled: false
                },
                packers: []
            };
        },
        props: ['packer','disabled','clear','label','error', 'norequired', 'warehouse', 'dense'],
        methods: {
            remoteSearch(search) {
                let warehouse = ''
                if (this.warehouse) {
                    warehouse = '|warehouse.id.e:'+this.warehouse
                }
                this.items = []
                this.placeholder="Loading items..."
                this.isLoading = true
                // ini ke endpoint get all
                this.$http.get("/user/helper",{params:{
                        perpage:10,
                        conditions:'status:1|name.icontains:'+search+warehouse+'|role_id.e:1638400',
                        orderby:'-id',
                    }}).then(response => {
                    if(response.data.data){
                        response.data.data.forEach((value, index) =>{
                            this.items.push(response.data.data[index])
                        });
                    }
                    this.isLoading = false
                    let label = 'Packer'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.packers= []
                    for (let i = 0; i < val.length; i++) {
                        this.packers.push(val[i])
                    }
                }
            },
            selected(event) {
                this.$emit('selected', event);
            },
            adjustOptions() {
                if (this.computedCounterValue) {
                    this.menuProps.disabled = true
                } else {
                    this.menuProps.disabled = false
                }
            },
        },
        mounted() {
            // this.remoteSearch('');
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val)
                    } else {
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.packers = null
                    this.remoteSearch('')
                },
                deep: true
            },
            packer: {
                handler: function (val) {
                    if(val){ // ini untuk auto select
                        this.autoSelectByID(val)
                    } else {
                        this.packers = null
                    }
                },
                deep: true
            },
            warehouse: {
                handler: function (val) {
                    this.remoteSearch('')
                },
                deep: true
            },
        },
    };
</script>
