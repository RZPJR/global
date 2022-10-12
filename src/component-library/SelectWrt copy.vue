<template>
    <v-autocomplete
        v-model="wrts"
        :items="items"
        :placeholder="placeholder"
        :loading="isLoading"
        item-value='code'
        item-text='name'
        :no-filter="true"
        :class="dense?'':'rounded-form'"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        return-object
        outlined
        :dense="dense"
        :error-messages="error"
        clearable
    >
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.code }} - {{ data.item.name }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.code }} - ({{ data.item.name }})
        </template>
        <template v-slot:label>
            <div v-if="label">
               <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>{{ label }}</span>
            </div>
            <div v-else>
               <span v-if="!norequired">WRT<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>WRT</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectWrt',
        data() {
            return {
                items: [],
                placeholder : '',
                isLoading: false,
                search:'',
                wrts:null
            };
        },
        props: ['wrt','disabled','clear','error','label', "norequired", "area", "dense"],
        methods: {
            remoteSearch(search) {
                let area = ''
                if (this.area) {
                    area = '|area_id.id.e:'+this.area
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/config/wrt",{params:{
                    conditions:'status:1|name.icontains:'+search+'%2COr.code.icontains:'+search+area,
                    orderby:'-id',
                }}).then(response => {
                    if(response){
                        this.items = response.data.data
                    }
                    if(this.items === null){
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'WRT'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.wrts = val
                } else {
                    this.wrts = null
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
                    } else if(!this.wrt){
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) { // ini untuk clear data
                    if (val == true) {
                        this.wrts = null
                    }
                },
                deep: true
            },
            wrt:{
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if(val){
                        this.autoSelectByID(val)
                    } else {
                        this.warehouses = null
                    }
                },
                deep: true
            },
            area:{
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                     this.remoteSearch('');
                },
                deep: true
            }
        },
    };
</script>