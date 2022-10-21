<template>
    <v-autocomplete
        v-model="branches"
        :items="items"
        :loading="isLoading"
        item-text="name"
        item-value='code'
        :no-filter="true"
        :search-input.sync="search"
        :placeholder="placeholder"
        @change="selected"
        :class="dense?'':'rounded-form'"
        :disabled="disabled"
        return-object
        :dense="dense"
        outlined
        :error-messages="error"
        clearable
        @click:clear="remoteSearch('')"
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
               <span v-if="!norequired">Branch<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>Branch</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectBranch',
        data() {
            return {
                items: [],
                isLoading: false,
                search:'',
                placeholder : '',
                branches:null
            };
        },
        props: ['branch','disabled','clear','error', 'label', "norequired", "merchant", "dense"],
        methods: {
            remoteSearch(search) {
                let merchant = ''
                if (this.merchant) {
                    merchant = '|merchant.id.e:'+this.merchant
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/customer/branch/filter",{params:{
                    perpage:10,
                    embeds:'area_id,warehouse_id,subdistrict,merchant',
                    conditions:'status:1|name.icontains:'+search+'%2COr.code.icontains:'
                    +search+merchant,
                }}).then(response => {
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                    if (this.branch) {
                        this.autoSelectByID(this.branch)
                    }
                    this.isLoading = false
                    let label = 'Branch'
                    if (this.label)
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.$http.get("/customer/branch/filter",{params:{
                        embeds:'area_id,warehouse_id,subdistrict,merchant',
                        conditions:'id.e:'+val.id,
                    }}).then(response => {
                        this.items.push(response.data.data[0])
                        this.branches = response.data.data[0]
                    });
                }

            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted() {
            // this.remoteSearch('');
            if (this.branch) {
                this.autoSelectByID(this.branch)
            }
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val)
                    } else if(!this.branch){
                        this.remoteSearch('')
                    }

                },
                deep: true
            },
            clear: {
                handler: function (val) { // ini untuk clear data
                    this.branches = null
                },
                deep: true
            },
            branch:{
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if(val){
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
            merchant:{
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                     this.remoteSearch('');
                },
                deep: true
            }
        },
    };
</script>