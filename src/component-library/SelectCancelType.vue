<template>
    <div>
        <v-autocomplete
            v-model="cancel_types"
            :items="items"
            :loading="isLoading"
            item-text="name"
            name="CancelType"
            :search-input.sync="search"
            placeholder="Select Cancel Type"
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
                    {{ data.item.name }}
                </div>
            </template>
            <template slot="item" slot-scope="data">
                {{ data.item.name }}
            </template>
            <template v-slot:label>
                <div v-if="label">
                    <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
                    <span v-else>{{ label }}</span>
                </div>
                <div v-else>
                    <span v-if="!norequired">Cancel Type<span :class="disabled?'':'text-red'">*</span></span>
                    <span v-else>Cancel Type</span>
                </div>
            </template>
        </v-autocomplete>
    </div>
</template>
<script>
    export default {
        name: 'SelectCancelType',
        data() {
            return {
                items: [
                    {
                        name : "Fullfiled",
                        value : 1,
                    },
                    {
                        name : "Regular",
                        value : 2,
                    }
                ],
                isLoading: false,
                search:'',
                dataname:'',
                cancel_types:null
            };
        },
        props: ['cancel_type','disabled','clear','label','error', 'norequired',"dense"],
        methods: {
            remoteSearch() {
                this.items =[
                    {
                        name : "Unfulfilled",
                        value : 1,
                    },
                    {
                        name : "Regular",
                        value : 2,
                    }
                ]
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val)
                    } else if(!this.cancel_type){
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.cancel_types = null;
                    if(val)this.remoteSearch('')
                },
                deep: true
            },
            cancel_type: {
                handler: function (val) {
                    if(val){ // ini untuk auto select
                        this.cancel_types=val
                    } 
                },
                deep: true
            },
        },
    };
</script>
