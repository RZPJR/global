<template>
    <v-autocomplete
        v-model="users"
        :items="items"
        :placeholder="placeholder"
        :loading="isLoading"
        item-text="name"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        return-object
        clearable
        outlined
        :dense="dense"
        :class="dense?'':'rounded-form'"
    >
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.employee_code }} - {{ data.item.name }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.employee_code }} - {{ data.item.name }}
        </template>
        <template v-slot:label>
            <div v-if="label">
               <span v-if="!norequired">{{ label }}<span style="color:red">*</span></span>
               <span v-else>{{ label }}</span>
            </div>
            <div v-else>
               <span v-if="!norequired">Supervisor<span style="color:red">*</span></span>
               <span v-else>Supervisor</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectUser',
        data() {
            return {
                items: [],
                isLoading: false,
                placeholder : '',
                search:'',
                users:null
            };
        },
        props: ['user','disabled','clear','label',"dense", 'norequired','role_id','error'],
        methods: {
            remoteSearch(search) {
                let role = ""
                if(this.role_id){
                    role = this.role_id
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                // ini ke endpoint get all
                this.$http.get("/account/v1/user",{params:{
                    page:1,
                    per_page:10,
                    search:search,
                    role_id:role
                }}).then(response => {
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Supervisor'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                }).catch(e => {
                    this.items = []
                });
            },
            autoSelectByID(val) {
                if(val){
                    this.isLoading = true
                    // ini ke endpoint detail
                    this.$http.get("/account/v1/user/"+val.id).then(response => {
                        this.items.push(response.data.data)
                        this.users = response.data.data
                        this.isLoading = false
                    }).catch(e => {
                        this.items = []
                        this.isLoading = false
                    });
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
                    } else if(!this.user){
                        this.remoteSearch('')
                    }

                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.users = null
                },
                deep: true
            },
            role_id: {
                handler: function (val) {
                    this.users = null
                },
                deep: true
            },
            user: {
                handler: function (val) {
                    this.users = null
                    if(val){ // ini untuk auto select
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
        },
    };
</script>