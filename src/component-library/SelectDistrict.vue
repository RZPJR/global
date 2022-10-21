<template>
    <v-autocomplete
        v-model="districts"
        :items="items"
        :loading="isLoading"
        item-text="district_name"
        :dense="dense"
        :class="dense?'':'rounded-form'"
        :search-input.sync="search"
        @change="selected"
        :placeholder="placeholder"
        :disabled="disabled"
        return-object
        outlined
        :error-messages="error"
        clearable
    >
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.district_name }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.district_name }}
        </template>
        <template v-slot:label>
            <div v-if="label">
               <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>{{ label }}</span>
            </div>
            <div v-else>
               <span v-if="!norequired">District<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>District</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectDistrict',
        data() {
            return {
                items: [],
                placeholder : '',
                isLoading: false,
                search:'',
                districts:null,
            };
        },
        props: ['district','disabled','clear','error','area_id','city_id', 'district_id',"label", 'norequired', "dense"],
        methods: {
            remoteSearch(search) {
                let area_id = ''
                if(this.area_id){
                    area_id = "|area_id.e:" + this.area_id
                }
                let province_id = ''
                if(this.province_id){
                    province_id = "|province_id.e:" + this.province_id
                }
                let city_id = ''
                if(this.city_id){
                    city_id = "|city_id.e:" + this.city_id
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                this.items = []
                this.$http.get("/adm/division/filter",{params:{
                    perpage:50,
                    conditions:'district_name.icontains:'+search+area_id+province_id+city_id,
                    fields:'district_id,district_name',
                    groupby:'district_id'
                }}).then(response => {
                    let arr = []
                    if (response.data.data != null) {
                        arr = response.data.data
                    }
                    for (let i = 0; i < arr.length; i++) {
                        this.items.push({
                            district_id : arr[i].district_id,
                            district_name : arr[i].district_name
                        })
                    }
                    this.isLoading = false
                    let label = 'District'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.districts = val
                }
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted() {
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
                    this.districts = null
                    if(val)this.remoteSearch('')
                },
                deep: true
            },
            district:{
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if(val !== null){
                        this.autoSelectByID(val)
                        let self = this
                        setTimeout(function(){
                            self.remoteSearch('')
                        }, 4000);
                    }
                },
                deep: true
            },
            city_id: { // ini fungsi untuk request by area_id
                handler: function(val) {
                    this.districts = null
                    if (val) { // ini untuk auto select
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            province_id: { // ini fungsi untuk request by area_id
                handler: function (val) {
                    if(val !== null && val !== ''){ // ini untuk auto select
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            area_id: { // ini fungsi untuk request by area_id
                handler: function(val) {
                    this.districts = null
                    if (val !== null && val !== '') { // ini untuk auto select
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
        },
    };
</script>