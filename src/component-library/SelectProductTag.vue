<template>
  <v-autocomplete
    v-model="product_tags"
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
    :dense="dense"
    :class="dense ? '' : 'rounded-form'"
  >
    <template v-slot:label>
      <div class="select-item">
        <span v-if="required"
          >Item Category<span :class="disabled ? '' : 'text-red'">*</span></span
        >
        <span v-else>Item Category</span>
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
  name: "SelectProductTag",
  data() {
    return {
      items: [],
      placeholder: "",
      isLoading: false,
      search: "",
      product_tags: null,
    };
  },
  props: ["product_tag", "disabled", "clear", "error", "dense", "required"],
  methods: {
    remoteSearch(search) {
      this.placeholder = "Loading items...";
      this.isLoading = true;
      this.$http
        .get("/catalog/v1/item_category", {
          params: {
            status: '1',
            perpage: 10,
            conditions: "status:1|name.icontains:" + search,
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
          let label = "Item Category";
          if (this.label) label = this.label;
          this.placeholder = "Select " + label;
        });
    },
    autoSelectByID(val) {
      if (val) {
        // ini ke endpoint detail
        this.$http
          .get("/catalog/v1/item_category", {
            params: {
              conditions: "id.e:" + val.id,
            },
          })
          .then((response) => {
            this.items.push(response.data.data[0]);
            this.product_tags = response.data.data[0];
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
        this.product_tags = null;
        if (val) this.remoteSearch("");
      },
      deep: true,
    },
    product_tag: {
      handler: function (val) {
        // watch perubahan untuk auto select (biasa di pakai di page update)
        if (val) {
          this.autoSelectByID(val);
        }
      },
      deep: true,
    },
  },
};
</script>
