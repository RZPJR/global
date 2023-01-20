<template>
    <v-autocomplete
        v-model="sales_group"
        :items="items"
        :placeholder="placeholder"
        :loading="isLoading"
        item-text="name"
        item-value="code"
        name="salesGroup"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        :dense="dense"
        :class="dense?'':'rounded-form'"
        return-object
        clearable
        outlined
        :error-messages="error"
    >
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.code }} - {{ data.item.description }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.code }} - {{ data.item.description }}
        </template>
        <template v-slot:label>
            <div v-if="label">
                <!-- <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span> -->
                <span v-if="!norequired">{{ label }}<span style="color:red">*</span></span>
                <span v-else>{{ label }}</span>
            </div>
            <div v-else>
                <!-- <span v-if="!norequired">Sales Group<span :class="disabled?'':'text-red'">*</span></span> -->
                <span v-if="!norequired">Territory<span style="color:red">*</span></span>
                <span v-else>Territory</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectSalesGroup',
        data() {
            return {
                items: [],
                isLoading: false,
                placeholder : '',
                search:'',
                sales_group:null
            };
        },
        props: ['salesgroup_id','disabled','clear','label','error', 'norequired', "dense"],
        methods: {
            remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true
                // For get data from api
                this.$http.get("/bridge/v1/territory",{params:{
                    search:search,
                }
                }).then(response => {
                    if(response)
                    this.items=response.data.data
                    if(this.items === null)
                    this.items = []
                    this.isLoading = false
                    let label = 'Territory'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.$http.get("/bridge/v1/territory").then(response => {
                        this.items.push(response.data.data[0])
                        this.isLoading = false
                        this.sales_group = response.data.data[0]
                    });
                }
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted(){
            if(this.salesgroup_id > 0){
                this.autoSelectByID(this.salesgroup_id)
            }
        },
        watch: {
            search: {
                handler: function (val) {
                    if (val) {
                        this.remoteSearch(val);
                    } else{
                        this.remoteSearch("");
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.sales_group = null;
                    if(!val) this.remoteSearch('')
                },
                deep: true
            },
            salesgroup_id: { // for get specific data by id
                handler: function (val) {
                    if(val) this.autoSelectByID(val)
                },
                deep: true
            },
            sales_group: { // for get all data when clear or empty search
                handler: function (val) {
                    if(!val) this.remoteSearch('')
                },
                deep: true
            },
        },
    };
</script>
