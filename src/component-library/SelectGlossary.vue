<template>
    <v-autocomplete
        v-model="glossarys"
        :items="items"
        :loading="isLoading"
        item-text="value_name"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        return-object
        outlined
        :placeholder="placeholder"
        :dense="dense"
        required
        clearable
        :error-messages="error"
    >
        <!-- Label -->
        <template v-slot:label>
            <span v-if="!norequired">{{ label }}<span class="text-red">*</span></span>
            <span v-else>{{ label }}</span>
        </template>
        <!-- Selected -->
        <template slot="item" slot-scope="data">{{ data.item.value_name }}</template>
        <!-- Option -->
        <template slot="selection" slot-scope="data">
            <div class="select-item">{{ data.item.value_name }}</div>
        </template>
    </v-autocomplete>
</template>
<script>
export default {
    name: "SelectGlossary",
    data() {
        return {
            items: [],
            placeholder: "",
            isLoading: false,
            search: "",
            glossarys: null,
        };
    },
    props: [ "glossary", "disabled", "clear", "error", "dense", "table", "attribute", "label", "norequired", ],
    methods: {
        async remoteSearch() {
            let table = "";
            if (this.table) table = this.table;

            let attribute = "";
            if (this.attribute) attribute = this.attribute;

            this.placeholder = "Loading items...";
            this.isLoading = true;
            
            await this.$http.get("/configuration/v1/glossary", {
                params: {
                    perpage: 10,
                    table: table,
                    attribute: attribute,
                    search: this.search,
                },
            }).then((response) => {
                this.items = [];
                if (response.data.data && response.data.data !== null && response.data.data !== []) {
                    this.typeHandler(response.data.data);
                }
                this.isLoading = false;
                let label = "Glossary";
                if (this.label) label = this.label;
                this.placeholder = "Select " + label;
            });
        },
        autoSelectByID(val) {
            if (val) {
                this.glossarys = val;
            } else {
                this.glossarys = null;
            }
        },
        selected(event) {
            this.$emit("selected", event);
        },
        typeHandler(val) {
            const sortedArray = val.sort(function(a, b) {
                return a.value_int - b.value_int
            });
            switch (this.label) {
                case 'Routing Profile':
                    sortedArray.forEach((element) => {
                        this.items.push({
                            id: element.id,
                            value: element.value_int,
                            value_name: element.value_name == "bike" ? "No Highway" : "Highway",
                        });
                    });
                    break;
                default:
                    sortedArray.forEach((element) => {
                        this.items.push({
                            id: element.id,
                            value: element.value_int,
                            value_name: this.capitalizeFirstLetterEveryWords(element.value_name.replace(/_/g, ' ')),
                        });
                    });
                    break;
            }
        },
    },
    mounted() {
        this.remoteSearch();
    },
    watch: {
        search: {
            handler: function (val) {
                if (val) {
                    this.remoteSearch(val);
                } else if (!this.glossary) {
                    this.remoteSearch("");
                }
            },
            deep: true,
        },
        clear: {
            handler: function (val) {
                this.glossarys = null;
                this.remoteSearch("", true);
            },
            deep: true,
        },
        glossary: {
            handler: function (val) {
                if (val) {
                    this.autoSelectByID(val);
                }
            },
            deep: true,
        },
    },
};
</script>
