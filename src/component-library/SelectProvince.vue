<template>
    <v-autocomplete
        v-model="provinces"
        :placeholder="placeholder"
        :items="items"
        :loading="isLoading"
        item-text="province_name"
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
                {{ data.item.province_name }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.province_name }}
        </template>
        <template v-slot:label>
            <div v-if="label">
               <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>{{ label }}</span>
            </div>
            <div v-else>
               <span v-if="!norequired">Province<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>Province</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectProvince',
        data() {
            return {
                items: [],
                placeholder : '',
                isLoading: false,
                search:'',
                provinces:null
            };
        },
        props: ['province','disabled','clear','error','area_id','province_id','update',"label", 'norequired', "dense"],
        methods: {
            remoteSearch(search) {
                let area_id = ''
                if(this.area_id){
                    area_id = "area_id.e:" + this.area_id
                }
                this.items = []
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/adm/division/filter",{params:{
                    conditions:'province_name.icontains:'+search+area_id,
                    fields:'province_id,province_name',
                    groupby:'province_id',
                }}).then(response => {
                    let arr = []
                    if (response.data.data != null) {
                        arr = response.data.data
                    }
                    for (let i = 0; i < arr.length; i++) {
                        this.items.push({
                            province_id : arr[i].province_id,
                            province_name : arr[i].province_name
                        })
                    }
                    this.isLoading = false
                    let label = 'Province'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.provinces = val
                }

            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        created() {
            this.remoteSearch('');
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val)
                    } else{
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.provinces = null
                },
                deep: true
            },
            province:{
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if(val !== null && val !== ''){
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
            area_id: { // ini fungsi untuk request by area_id
                handler: function (val) {
                    if(val !== null && val !== ''){ // ini untuk auto select
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
        },
    };
</script>