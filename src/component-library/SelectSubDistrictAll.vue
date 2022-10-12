<template>
    <v-autocomplete
        v-model="sub_districts"
        :items="items"
        :loading="isLoading"
        :placeholder="placeholder"
        item-text="concat_address"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        return-object
        outlined
        :error-messages="error"
        :dense="dense"
        :class="dense?'':'rounded-form'"
        clearable
    >
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.concat_address }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.concat_address }}
        </template>
        <template v-slot:label>
            Sub District<span :class="disabled?'':'text-red'">*</span>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectSubDistrictAll',
        data() {
            return {
                items: [],
                isLoading: false,
                placeholder : '',
                search:'',
                sub_districts:null
            };
        },
        props: ['sub_district','disabled','clear','error', "dense"],
        methods: {
            remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/sub_district/filter",{params:{
                    perpage:10,
                    embeds : 'district.city.province_id',
                    conditions:'concat_address.icontains:'+search,
                }}).then(response => {
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Sub District'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    // ini ke endpoint detail
                    this.$http.get("/sub_district/filter",{params:{
                        conditions:'id.e:'+val.id,
                        embeds : 'district.city.province_id',
                    }}).then(response => {
                        this.items.push(response.data.data[0])
                        this.sub_districts = response.data.data[0]
                    });
                }
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted() {
            // this.remoteSearch('');
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val)
                    } else if(!this.sub_district){
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) { // ini untuk clear data
                    this.sub_districts = null
                },
                deep: true
            },
            sub_district:{
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if(val){
                        let self = this
                        setTimeout(function(){
                            self.autoSelectByID(val)
                        }, 1000);
                    }
                },
                deep: true
            }
        },
    };
</script>