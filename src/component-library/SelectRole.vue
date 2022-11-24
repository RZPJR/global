<template>
  <v-autocomplete
    v-model="roles"
    :placeholder="placeholder"
    :items="items"
    :loading="isLoading"
    item-text="name"
    :search-input.sync="search"
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
        {{ data.item.name }}
      </div>
    </template>
    <template v-slot:label>
      <div v-if="label">
        <span v-if="!no_required"
          >{{ label }}<span :class="disabled ? '' : 'text-red'">*</span></span
        >
        <span v-else>{{ label }}</span>
      </div>
      <div v-else>
        <span v-if="!no_required"
          >Role<span :class="disabled ? '' : 'text-red'">*</span></span
        >
        <span v-else>Role</span>
      </div>
    </template>
    <template slot="item" slot-scope="data">
      {{ data.item.name }}
    </template>
  </v-autocomplete>
</template>
<script>
export default {
  name: "SelectRole",
  data() {
    return {
      items: [],
      placeholder: "",
      isLoading: false,
      search: "",
      roles: null,
    };
  },
  props: [
    "role",
    "disabled",
    "clear",
    "label",
    "division_id",
    "error",
    "no_required",
    "is_helper",
    "dense",
    "main_role",
  ],
  methods: {
    remoteSearch(search, division_id) {
      let division = "";
      if (
        division_id !== "" &&
        division_id !== undefined &&
        division_id !== null
      ) {
        division = "|division_id:" + division_id;
      }

      let is_helper = "";
      if (this.is_helper) {
        is_helper = "|code__in:ROL0022.ROL0023.ROL0049.ROL0055";
      }
      this.placeholder = "Loading items...";
      this.isLoading = true;

      // ini ke endpoint get all
      this.$http
        .get("/role", {
          params: {
            conditions:
              "status:1|name.icontains:" + search + division + is_helper,
            orderby: "-id",
          },
        })
        .then((response) => {
          this.items = [];
          if (this.items !== null) {
            this.items = response.data.data;
          }
          this.isLoading = false;
          let label = "Role";
          if (this.label) label = this.label;
          this.placeholder = "Select " + label;
        });
    },
    autoSelectByID(val) {
      if (val) {
        this.$http.get("/role/" + val.id).then((response) => {
          this.items.push(response.data.data);
          this.roles = response.data.data;
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
          this.remoteSearch(val, this.division_id);
        } else if (!this.role) {
          this.remoteSearch("", this.division_id);
        }
      },
      deep: true,
    },
    clear: {
      handler: function (val) {
        this.roles = null;
        this.remoteSearch("", "");
      },
      deep: true,
    },
    role: {
      handler: function (val) {
        if (val !== null) {
          // ini untuk auto select
          this.autoSelectByID(val);
        }
      },
      deep: true,
    },
    division_id: {
      // ini fungsi untuk request by division_id
      handler: function (val) {
        if (val !== null) {
          // ini untuk auto select
          this.roles = null;
          this.remoteSearch("", val);
        }
      },
      deep: true,
    },
  },
};
</script>
