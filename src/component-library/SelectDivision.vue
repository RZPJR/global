<template>
  <v-autocomplete
    v-model="divisions"
    :items="items"
    :loading="isLoading"
    item-text="name"
    name="division"
    :search-input.sync="search"
    :placeholder="placeholder"
    @change="selected"
    :disabled="disabled"
    return-object
    clearable
    outlined
    :dense="dense"
    :class="dense ? '' : 'rounded-form'"
    :error-messages="error"
  >
    <template slot="selection" slot-scope="data">
      <div class="select-item">
        {{ data.item.code }} - {{ data.item.name }}
      </div>
    </template>
    <template v-slot:label>
      <div v-if="label">
        <span v-if="!norequired"
          >{{ label }}<span :class="disabled ? '' : 'text-red'">*</span></span
        >
        <span v-else>{{ label }}</span>
      </div>
      <div v-else>
        <span v-if="!norequired"
          >Division<span :class="disabled ? '' : 'text-red'">*</span></span
        >
        <span v-else>Division</span>
      </div>
    </template>
    <template slot="item" slot-scope="data">
      {{ data.item.code }} - {{ data.item.name }}
    </template>
  </v-autocomplete>
</template>
<script>
export default {
  name: "SelectDivision",
  data() {
    return {
      items: [],
      placeholder: "",
      isLoading: false,
      search: "",
      divisions: null,
    };
  },
  props: [
    "division",
    "disabled",
    "clear",
    "label",
    "error",
    "area_id",
    "norequired",
    "dense",
  ],
  methods: {
    remoteSearch(search) {
      this.placeholder = "Loading items...";
      this.isLoading = true;
      // to endpoint get list division
      this.$http
        .get("/account/v1/division", {
          params: {
            perpage: 20,
            status:1,
            search:search
          },
        })
        .then((response) => {
          this.items = response.data.data;
          if (this.items === null) {
            this.items = [];
          }
          this.isLoading = false;
          let label = "Division";
          if (this.label) label = this.label;
          this.placeholder = "Select " + label;
        });
    },
    autoSelectByID(val) {
      if (val) {
        // ini ke endpoint detail
        this.$http.get("/account/v1/division/" + val.id).then((response) => {
          this.items.push(response.data.data);
          this.divisions = response.data.data;
        });
      }
    },
    selected(event) {
      this.$emit("selected", event);
    },
  },
  mounted() {
  },
  watch: {
    search: {
      handler: function (val) {
        if (val) {
          this.remoteSearch(val);
        } else {
          this.remoteSearch("");
        }
      },
      deep: true,
    },
    clear: {
      handler: function (val) {
        this.divisions = null;
        this.remoteSearch("", "");
      },
      deep: true,
    },
    division: {
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
