<template>
  <v-select
    v-model="glossarys"
    :items="items"
    :loading="isLoading"
    item-text="name"
    item-value="id"
    :search-input.sync="search"
    @change="selected"
    :disabled="disabled"
    return-object
    outlined
    :placeholder="placeholder"
    :dense="dense"
    :class="dense ? '' : 'rounded-form'"
    required
    :error-messages="error"
  >
    <template slot="selection" slot-scope="data">
      <div class="select-item">
        {{ data.item.value_name }}
      </div>
    </template>
    <template slot="item" slot-scope="data">
      {{ data.item.value_name }}
    </template>
    <template v-slot:label>
      <span v-if="!norequired">
        {{ label }}<span class="text-red">*</span>
      </span>
      <span v-else>
        {{ label }}
      </span>
    </template>
  </v-select>
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
  props: [
    "glossary",
    "disabled",
    "clear",
    "error",
    "dense",
    "table",
    "attribute",
    "label",
    "norequired",
  ],
  methods: {
    remoteSearch() {
      let table = "";
      if (this.table) {
        table = this.table;
      }
      let attribute = "";
      if (this.attribute) {
        attribute = this.attribute;
      }
      this.items = [];
      this.placeholder = "Loading items...";
      this.isLoading = true;
      this.$http
        .get("/configuration/v1/glossary", {
          params: {
            perpage: 10,
            table: table,
            attribute: attribute,
          },
        })
        .then((response) => {
          if (this.label == "Application") {
            // if label = Application
            let array = response.data.data;
            if (array != null) {
              array.forEach((element) => {
                this.items.push({
                  id: element.id,
                  value: element.value_int,
                  value_name: this.capitalizeFirstLetter(element.value_name),
                });
              });
              this.items.unshift({
                value: 0,
                value_name: "All",
              });
            }
          } else if (this.label == "Routing Profile") {
            // jika label = 'Routing Profile'
            let array = response.data.data;
            if (array != null) {
              array.forEach((element) => {
                this.items.push({
                  id: element.id,
                  value: element.value_int,
                  value_name:
                    element.value_name == "bike" ? "No Highway" : "Highway",
                });
              });
            }
          }
          this.isLoading = false;
          let label = "Glossary";
          if (this.label) label = this.label;
          this.placeholder = "Select " + label;
        });
    },
    autoSelectByID(val) {
      // auto select by ID
      if (val) {
        this.glossarys = val;
      } else {
        this.glossarys = null;
      }
    },
    selected(event) {
      this.$emit("selected", event);
    },
  },
  mounted() {
    this.remoteSearch();
  },
  watch: {
    search: {
      // untuk search
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
      // untuk clear
      handler: function (val) {
        this.glossarys = null;
        this.remoteSearch("", true);
      },
      deep: true,
    },
    glossary: {
      // props
      handler: function (val) {
        if (val) {
          // for auto select
          this.autoSelectByID(val);
        }
      },
      deep: true,
    },
  },
};
</script>
