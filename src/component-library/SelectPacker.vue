<template>
    <v-autocomplete
        v-model="packers"
        :items="items"
        :loading="isLoading"
        item-value='code'
        item-text='name'
        :no-filter="true"
        :placeholder="placeholder"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        return-object
        :dense="dense"
        :class="dense?'':'rounded-form'"
        outlined
        :error-messages="error"
        clearable
    >
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.name }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
             {{ data.item.name }}
        </template>
        <template v-slot:label>
            <div v-if="label">
               <span v-if="!norequired">{{ label }}<span style="color:red">*</span></span>
               <span v-else>{{ label }}</span>
            </div>
            <div v-else>
               <span v-if="!norequired">Packer<span style="color:red">*</span></span>
               <span v-else>Packer</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectPacker',
        data() {
            return {
                items: [],
                isLoading: false,
                placeholder : '',
                search:'',
                packers:null
            };
        },
        props: ['packer','disabled','clear','error','label', "norequired", "warehouse", "dense"],
        methods: {
            remoteSearch(search) {
                let warehouse = ''
                if (this.warehouse) {
                    warehouse = '|warehouse.id.e:'+this.warehouse
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/user/helper",{params:{
                    conditions:'status:1|name.icontains:'+search+warehouse+'|role_id.e:1638400',
                    orderby:'-id',
                }}).then(response => {
                    if(response){
                        this.items = response.data.data
                    }
                    if(this.items === null){
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Area'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.packers = val
                } else {
                    this.packers = null
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
                        this.remoteSearch(val)
                    } else if(!this.packer){
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) { // ini untuk clear data
                    if (val == true) {
                        this.packers = null
                    }
                },
                deep: true
            },
            packer:{
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if(val){
                        this.autoSelectByID(val)
                    } else {
                        this.warehouses = null
                    }
                },
                deep: true
            },
            warehouse:{
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                     this.remoteSearch('');
                },
                deep: true
            }
        },
    };
</script>