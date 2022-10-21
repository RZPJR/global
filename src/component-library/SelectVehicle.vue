<template>
    <v-autocomplete
        v-model="vehicles"
        :items="items"
        :placeholder="placeholder"
        :loading="isLoading"
        item-text="name"
        :dense="dense"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        return-object
        outlined
        :error-messages="error"
        clearable
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
                <span v-if="!norequired">
                    {{ label }} <span :class="disabled ? '' : 'text-red'">*</span>
                </span>
                <span v-else>{{ label }}</span>
            </div>
            <div v-else>
                <span v-if="!norequired">
                    Vehicle Profile <span :class="disabled ? '' : 'text-red'">*</span>
                </span>
                <span v-else>Vehicle Profile</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectVehicle',
        data() {
            return {
                items: [],
                isLoading: false,
                placeholder: '',
                search: '',
                vehicles: null
            };
        },
        props: ['vehicle', 'disabled', 'clear', 'error', 'label', "norequired", "dense"],
        methods: {
            remoteSearch(search) {
                this.placeholder = "Loading items..."
                this.isLoading = true
                this.$http2.get("/config/vehicle_profiles", {
                    params: {
                        perpage: 10,
                        conditions: 'status:1|Or.name.icontains:' + search + '%2COr.code.icontains:'
                            + search + '|status:1',
                        orderby: '-id',
                    }
                }).then(response => {
                    let arr = []
                    if (response.data.data != null) {
                        arr = response.data.data
                    }
                    for (let i = 0; i < arr.length; i++) {
                        this.items.push({
                            id: arr[i].id,
                            code: arr[i].code,
                            name: arr[i].name,
                        })
                    }
                    this.isLoading = false
                    let label = 'Vehicle'
                    if (this.label)
                        label = this.label
                    this.placeholder = "Select " + label
                });
            },
            autoSelectByID(val) {
                if (val.id) {
                    this.$http2.get("/config/vehicle_profiles", {
                        params: {
                            conditions: 'id.e:' + val.id,
                        }
                    }).then(response => {
                        this.items.push(response.data.data[0])
                        this.vehicles = response.data.data[0]
                    });
                }

            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        watch: {
            search: {
                handler: function(val) {
                    if (val) {
                        this.remoteSearch(val)
                    } else if (!this.vehicle) {
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function(val) { // ini untuk clear data
                    if (val == true) {
                        this.vehicles = null
                    }
                },
                deep: true
            },
            vehicle: {
                handler: function(val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if (val) {
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
        },
    };
</script>


