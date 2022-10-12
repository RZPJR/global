<template>
    <div>
        <div v-if="exist">
            <v-autocomplete
                ref="vehicle"
                class="rounded-form-sm"
                v-model="vehicles"
                :items="items"
                :loading="isLoading"
                :placeholder="placeholder"
                item-value='code'
                item-text='name'
                :name="name"
                :no-filter="true"
                :search-input.sync="search"
                @change="selected"
                :disabled="disabled"
                return-object
                outlined
                full-width
                :error-messages="error"
                dense
                style="margin-bottom:-24px"
            >
                <template slot="selection" slot-scope="data">
                    {{ data.item.code }} - {{ data.item.name }}
                </template>
                <template slot="item" slot-scope="data">
                    {{ data.item.code }} - {{ data.item.name }}
                </template>
            </v-autocomplete>
        </div>
        <div v-else>
            <v-tooltip top>
                <template v-slot:activator="{ on: tooltip }">
                    <div v-on="{ ...tooltip }">
                        <v-text-field
                            :name="name"
                            outlined
                            disabled
                            class="mt-2 rounded-form-sm"
                            style="margin-bottom:-20px"
                            v-model="vehicle_text"
                            :error-messages="error"
                            dense
                        />
                    </div>
                </template>
                <span>{{vehicle_text}}</span>
            </v-tooltip>
        </div>
    </div>
</template>
<script>
	export default {
		name: 'SelectVehicleTable',
		data() {
			return {
				items: [],
				placeholder: '',
				isLoading: false,
				search: '',
				searchtyping: false,
				vehicles: [{
					code: '',
					name: '',
				}],
				exist: true,
				vehicle_text: ""
			};
		},
		props: ['vehicle', 'disabled', 'clear', 'label', 'error', 'norequired', "warehouse", "refs", "pb", "sb", "prefixValue", "name", "update", "minSearch"],
		methods: {
			checkExist() { // check apakah ada itemnya
				if (this.vehicles) {
					for (let i = 0; i < this.items.length; i++) {
						if (this.items[i].id == this.vehicles.id) {
							this.exist = true
							break;
						} else {
							this.exist = false
						}
					}
				}
			},
			focusInput() { // untuk focus input
				if (this.$refs.vehicle) {
					this.$refs.vehicle.focus();
				}
			},
			remoteSearch(search) {
				this.placeholder = "Loading items..."
				this.isLoading = true
				// ini ke endpoint get all
				this.$http2.get("/config/vehicle_profiles", {
					params: {
						perpage: 10,
						conditions: 'Or.name.icontains:' + search + '%2COr.code.icontains:'
							+ search + '|status:1',
						orderby: '-id'
					}
				}).then(response => {
					this.isLoading = false
					let label = 'Vehicle'
					if (this.label)
						label = this.label
					this.placeholder = "Select " + label
					this.items = []
					let arr = []
					if (response.data.data != null) {
						arr = response.data.data
					}
					for (let i = 0; i < arr.length; i++) {
						this.items.push(arr[i])
					}
					if (this.arr) {
						this.autoSelectByID(this.arr)
					}
					if (!this.searchtyping) {
						if (this.items.length == 0) {
							this.exist = false
						} else {
							this.exist = true
						}
					}
				});
			},
			autoSelectByID(val) { // untuk get by ID
				if (val) {
					this.vehicles = val
				} else {
					this.vehicles = null
				}
			},
			selected(event) { // untuk komponen select
				this.$emit('selected', event);
			}
		},
		mounted() {
			if (this.prefixValue) {
				this.vehicles = this.prefixValue
			}

			if (!this.update) {
				if (this.minSearch) {
					if (this.vehicles.length > 1) {
						this.remoteSearch("")
					} else {
						this.items = []
					}
				} else {
					this.remoteSearch("")
				}
			}

		},
		watch: {
			search: { // untuk search
				handler: function(val) {
					if (val) {
						if (this.minSearch) {
							if (val.length > 1) {
								this.remoteSearch(val)
							} else {
								this.items = []
							}
						} else {
							this.remoteSearch(val)
						}
					}
					this.searchtyping = true
				},
				deep: true
			},
			clear: { // untuk clear
				handler: function(val) {
					this.vehicles = [];
					if (val) this.remoteSearch('')
				},
				deep: true
			},
			vehicle: {
				handler: function(val) {
					if (val) { // ini untuk auto select
						this.autoSelectByID(val)
					} else {
						this.vehicles = []
					}

				},
				deep: true
			},
			vehicles: {
				handler: function(val) { // untuk props
					if (val) {
						this.vehicle_text = val.code + ' - ' + val.name
					}
					if (this.prefixValue) {
						this.exist = true
					} else if (!this.searchtyping) {
						this.checkExist()
					}
				},
				deep: true
			},
			items: { // untuk items
				handler: function(val) {
					if (val) {
						if (this.prefixValue) {
							this.exist = true
						} else if (!this.searchtyping) {
							this.checkExist()
						}
					}
				},
				deep: true
			},
			warehouse: { // untuk props filter
				handler: function(val) {
					this.remoteSearch('')
				},
				deep: true

			},
			refs: {
				handler: function(val) {
					if (val) {
						let idx = val.split('-')[0];
						let length = val.split(',')[1];
						if (idx == length) {
							this.focusInput()
						}
					}
				},
				deep: true
			}
		},
	};
</script>