<template>
  <v-autocomplete
    v-model="product_sections"
    :items="items"
    :placeholder="placeholder"
    :loading="isLoading"
    item-text="name"
    :search-input.sync="search"
    @change="selected"
    :disabled="disabled"
    return-object
    outlined
    :error-messages="error"
    clearable
    :dense="true"
  >
    <template v-slot:label>
      <div class="select-item">
        <span v-if="required"
          >Item Section<span :class="disabled ? '' : 'text-red'">*</span></span
        >
        <span v-else>Item Section</span>
      </div>
    </template>
    <template slot="selection" slot-scope="data">
      <div class="select-item">
        {{ data.item.name }}
      </div>
    </template>
    <template slot="item" slot-scope="data">
      {{ data.item.name }}
    </template>
  </v-autocomplete>
</template>
<script>
export default {
  name: "SelectProductSection",
  data() {
    return {
      items: [],
      placeholder: "",
      isLoading: false,
      search: "",
      product_sections: null,
    };
  },
  props: [
    "product_section",
    "area",
    "archetype",
    "disabled",
    "clear",
    "error",
    "required",
  ],
  methods: {
    remoteSearch(search) {
      // For get data list product section
      if (search == null) {
        search = "";
      }
      this.placeholder = "Loading items...";
      let area = "";
      if (this.area) {
        area = String(this.area);
      }
      let archetype = "";
      if (this.archetype) {
        archetype = String(this.archetype);
      }
      this.isLoading = true;
      this.$http
        .get("/campaign/v1/item_section", {
          params: {
            per_page: 10,
            orderby: "-id",
            region_id: area,
            archetype_id: archetype,
            status: "1,5",
          },
        })
        .then((response) => {
          if (response.data.data) {
            this.items = response.data.data;
          } else {
            this.items = [];
          }
          if (this.items === null) {
            this.items = [];
          }
          this.isLoading = false;
          let label = "Item Section";
          if (this.label) label = this.label;
          this.placeholder = "Select " + label;
        });
    },
    autoSelectByID(val) {
      // untuk auto fill when update
      if (val) {
        this.$http
          .get("/campaign/v1/item_section", {
            params: {
              conditions: "id.e:" + val.id,
            },
          })
          .then((response) => {
            this.items.push(response.data.data[0]);
            this.product_sections = response.data.data[0];
          });
      }
    },
    selected(event) {
      this.$emit("selected", event);
    },
  },
  watch: {
    search: {
      handler: function (val) {
        if (val) {
          this.remoteSearch(val);
        } else if (!this.product_tag) {
          this.remoteSearch("");
        }
      },
      deep: true,
    },
    clear: {
      handler: function (val) {
        // ini untuk clear data
        this.product_sections = null;
        if (val) this.remoteSearch("");
      },
      deep: true,
    },
    product_section: {
      handler: function (val) {
        // watch perubahan untuk auto select (biasa di pakai di page update)
        if (val) {
          this.autoSelectByID(val);
        }
      },
      deep: true,
    },
    area: {
      handler: function (val) {
        // watch perubahan untuk auto select (biasa di pakai di page update)
        if (val) {
          this.remoteSearch(this.search);
        }
      },
      deep: true,
    },
    archetype: {
      handler: function (val) {
        // watch perubahan untuk auto select (biasa di pakai di page update)
        if (val) {
          this.remoteSearch(this.search);
        }
      },
      deep: true,
    },
  },
};
</script>
