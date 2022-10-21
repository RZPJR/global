<template>
    <v-autocomplete
        v-model="pickers"
        :items="items"
        :placeholder="placeholder"
        :loading="isLoading"
        item-value='code'
        item-text='name'
        :no-filter="true"
        :dense="dense"
        :class="dense?'':'rounded-form'"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        return-object
        outlined
        :error-messages="error"
        clearable
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
               <span v-if="!norequired">Picker<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>Picker</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectPicker',
        data() {
            return {
                items: [],
                placeholder : '',
                isLoading: false,
                search:'',
                pickers:null
            };
        },
        props: ['picker','disabled','clear','error','label', "norequired", "warehouse", "dense"],
        methods: {
            remoteSearch(search) {
                let warehouse = ''
                if (this.warehouse) {
                    warehouse = '|warehouse.id.e:'+this.warehouse
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/user/helper",{params:{
                    conditions:'status:1|name.icontains:'+search+warehouse+'|role_id.e:1703936',
                    orderby:'-id',
                }}).then(response => {
                    if(response){
                        this.items = response.data.data
                    }
                    if(this.items === null){
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Picker'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.pickers = val
                } else {
                    this.pickers = null
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
                    } else if(!this.picker){
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) { // ini untuk clear data
                    if (val == true) {
                        this.pickers = null
                    }
                },
                deep: true
            },
            picker:{
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