<template>
    <v-autocomplete
        v-model="times"
        :items="items"
        :placeholder="`Select ${label}`"
        :loading="isLoading"
        item-text="value"
        :dense="dense"
        :class="dense?'':'rounded-form'"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        maxlength="5"
        onkeypress="return event.charCode >= 48 && event.charCode <= 58"
        return-object
        outlined
        prepend-inner-icon="mdi-clock-outline"
        :error-messages="error"
        clearable
    >
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item }}
        </template>
        <template v-slot:label>
            <div v-if="label">
               <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>{{ label }}</span>
            </div>
            <div v-else>
               <span v-if="!norequired">Time Internal<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>Time Internal</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectTimeInterval',
        data() {
            return {
                items: [],
                isLoading: false,
                search:'',
                times:null
            };
        },
        props: ['time','disabled','clear','error','label', "norequired", "dense"],
        methods: {
            remoteSearch() {
                for(let hour = 0; hour < 24; hour++) {
                    this.items.push(this.$moment({ hour }).format('HH:mm'));
                    this.items.push(
                        this.$moment({
                            hour,
                            minute: 30
                        }).format('HH:mm')
                    );
                }
            },
            autoSelectByID(val) {
                this.times = val
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted() {
            this.remoteSearch();
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
                    this.times = null
                },
                deep: true
            },
            time:{
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