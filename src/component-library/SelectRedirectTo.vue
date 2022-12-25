<template>
  <v-autocomplete
    v-model="redirect_to2"
    :items="items"
    :loading="isLoading"
    item-text="value_name"
    :search-input.sync="search"
    @change="selected"
    :disabled="disabled"
    return-object
    outlined
    :placeholder="placeholder"
    dense
    class="multi"
    required
    :error-messages="error"
    clearable
  >
    <template v-slot:label
      ><div v-if="label">
        <span v-if="!norequired"
          >{{ label }}<span style="color: red">*</span></span
        >
        <span v-else>{{ label }}</span>
      </div>
      <div v-else>
        <span v-if="!norequired"
          >Redirect To<span class="text-red">*</span></span
        >
        <span v-else>Redirect To</span>
      </div>
    </template>
    <template slot="item" slot-scope="data">
      {{ data.item.value_name }}
    </template>
  </v-autocomplete>
</template>
<script>
export default {
  name: "SelectRedirectTo",
  data() {
    return {
      items: [],
      placeholder: "",
      isLoading: false,
      search: "",
      redirect_to2: "",
    };
  },
  props: [
    "table",
    "redirect_to",
    "attribute",
    "disabled",
    "clear",
    "error",
    "dense",
    "norequired",
    "label",
  ],
  methods: {
    remoteSearch() {
      // render data
      this.items = [];
      this.placeholder = "Loading items...";
      this.isLoading = true;
      this.$http
        .get("/configuration/v1/glossary", {
          params: {
            perpage: 10,
            attribute:this.attribute,
            table: this.table,
          },
        })
        .then((response) => {
          if (response.data.data && response.data.data != null) {
            this.items = response.data.data;
          } else {
            this.items = [];
          }
          this.isLoading = false;
          let label = "Redirect To";
          if (this.label) label = this.label;
          this.placeholder = "Select " + label;
        });
    },
    selected(event) {
      // send event select
      this.$emit("selected", event);
    },
    autoSelectByID(val) {
      // auto fill
      if (val) {
        this.redirect_to2 = val;
      }
    },
  },
  mounted() {
    this.remoteSearch();
  },
  watch: {
    redirect_to2: {
      // watch perubahan untuk auto select
      handler: function () {
        this.search = "";
      },
      deep: true,
    },
    redirect_to: {
      handler: function (val) {
        if (val !== null) {
          // ini untuk auto select
          this.autoSelectByID(val);
        }
      },
      deep: true,
    },
  },
};
</script>
