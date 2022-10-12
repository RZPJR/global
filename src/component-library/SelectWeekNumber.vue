<template>
    <div>
        <v-tooltip top>
            <template v-slot:activator="{ on: tooltip }">
                <div v-on="{ ...tooltip }">
                    <v-autocomplete
                        v-model="weeks"
                        :items="items"
                        :loading="isLoading"
                        item-text="name"
                        name="WeekNumber"
                        :search-input.sync="search"
                        placeholder="Select Week"
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
                                <span v-if="!norequired">Week<span :class="disabled?'':'text-red'">*</span></span>
                                <span v-else>Week</span>
                            </div>
                        </template>
                    </v-autocomplete>
                </div>
            </template>
            <span>
                Week Number of the Current Year ({{year}})
            </span>
        </v-tooltip>
    </div>
</template>
<script>
    export default {
        name: 'SelectWeekNumber',
        data() {
            return {
                items: [],
                isLoading: false,
                search:'',
                dataname:'',
                weeks:null
            };
        },
        computed : {
            year() {
                return this.$moment(new Date(Date.now() + ( 3600 * 1000 * 7))).year()
            }
        },
        props: ['week','disabled','clear','label','error', 'norequired', 'dense'],
        methods: {
            remoteSearch() {
                let week = this.$moment(new Date(Date.now() + ( 3600 * 1000 * 7))).isoWeeksInYear()
                let year = this.$moment(new Date(Date.now() + ( 3600 * 1000 * 7))).year()
                for(let i = 1; i < week+1; i++) {
                    if (year == '2021') {
                        let x=i+1
                        if (x>46) {
                            this.items.push(
                                {
                                    name : "Week "+x,
                                    value : x,
                                    start : this.getFirstDateWeek(i, year),
                                    end : this.getEndDateWeek(i, year)
                                }
                            );
                            
                        }
                    } else {
                        this.items.push(
                            {
                                name : "Week "+i,
                                value : i,
                                start : this.getFirstDateWeek(i, year),
                                end : this.getEndDateWeek(i, year)
                            }
                        );
                    }
                }
            },
            getFirstDateWeek(w, y) {
                var simple = new Date(y, 0, 1 + (w - 1) * 7);
                var dow = simple.getDay();
                var ISOweekStart = simple;
                if (dow <= 4)
                    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
                else
                    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
                return this.$moment(ISOweekStart).format('YYYY-MM-DD');
            },
            getEndDateWeek(w, y) {
                var simple = new Date(y, 0, 1 + (w - 1) * 7);
                var dow = simple.getDay();
                var ISOweekEnd = simple;
                if (dow <= 4)
                    ISOweekEnd.setDate(simple.getDate() - simple.getDay() + 6);
                else
                    ISOweekEnd.setDate(simple.getDate() + 13 - simple.getDay());
                return this.$moment(ISOweekEnd).format('YYYY-MM-DD');
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
                    } else if(!this.week){
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.weeks = null;
                    if(val)this.remoteSearch('')
                },
                deep: true
            },
        },
    };
</script>
