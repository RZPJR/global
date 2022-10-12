<template>
    <v-autocomplete
        v-model="suppliers"
        :items="items"
        :placeholder="placeholder"
        :loading="isLoading"
        item-text="name"
        :dense="dense"
        :class="dense?'':'rounded-form'"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        return-object
        outlined
        :error-messages="error"
        clearable
        @blur="onBlur()"
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
               <span v-if="!norequired">Supplier<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>Supplier</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectSupplier',
        data() {
            return {
                items: [],
                isLoading: false,
                placeholder : '',
                search:'',
                suppliers:null
            };
        },
        props: ['supplier','disabled','clear','error','label', "norequired", "dense",'suppliertype'],
        methods: {
            remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true
                let suppliertype = ''
                if(this.suppliertype)
                suppliertype = '|suppliertype.e:' + this.suppliertype
                this.$http.get("/purchase/supplier/filter",{params:{
                    perpage:10,
                    embeds: 'suppliertype',
                    conditions:'status:1|name.icontains:'+search+suppliertype,
                }}).then(response => {
                    if(response.data.data){
                        this.items = response.data.data
                    }
                    if(this.items === null){
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Supplier'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                }).catch(error => {
                    this.items = []
                    this.isLoading = false
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.$http.get("/purchase/supplier/filter",{params:{
                            conditions:'id.e:'+val.id,
                        }}).then(response => {
                        this.items.push(response.data.data[0])
                        this.suppliers = response.data.data[0]
                    });
                }
            },
            selected(event) {
                this.$emit('selected', event);
            },
            onBlur() {
                if (!this.suppliers || this.suppliers == null) {
                    this.search = ''
                }
            }
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val)
                    } else if(!this.supplier){
                        this.remoteSearch('')
                    }

                },
                deep: true
            },
            clear: {
                handler: function (val) { // ini untuk clear data
                    this.suppliers = null
                },
                deep: true
            },
            supplier:{
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if(val){
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            }
        },
    };
</script>