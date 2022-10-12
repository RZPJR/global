<template>
    <v-autocomplete
        v-model="supervisors"
        :items="items"
        :placeholder="placeholder"
        :loading="isLoading"
        item-text="name"
        name="supervisor"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        return-object
        clearable
        outlined
        :dense="dense"
        :class="dense?'':'rounded-form'"
        :error-messages="error"
    >
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.code }} - {{ data.item.name }}
            </div>
        </template>
        <template v-slot:label>
           <span v-if="!norequired">Supervisor<span :class="disabled?'':'text-red'">*</span></span>
           <span v-else>Supervisor</span>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.code }} - {{ data.item.name }}
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectSupervisor',
        data() {
            return {
                items: [],
                isLoading: false,
                search:'',
                placeholder : '',
                supervisors:null
            };
        },
        props: ['supervisor','disabled','clear','error','filtered','norequired','reload', 'dense'],
        methods: {
            remoteSearch(search) {
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/user/supervisor/filter",{params:{
                    perpage:10,
                    conditions:'parent.status:1|parent.name.icontains:'+search,
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
                });
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
                    } else {
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) { // ini untuk clear data
                    this.supervisor = null
                    this.remoteSearch('','')
                },
                deep: true
            },
            reload: {
                handler:function (val) {
                    this.remoteSearch('', true)
                }
            }
        },
    };
</script>