<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-autocomplete
          v-model="roles"
          :items="items"
          :loading="is_loading"
          :placeholder="placeholder"
          item-value="code"
          item-text="name"
          :search-input.sync="search"
          @change="selected"
          :disabled="disabled"
          return-object
          clearable
          outlined
          small-chips
          multiple
          deletable-chips
          class="multi"
          :dense="dense"
          :error-messages="error"
        >
          <template slot="item" slot-scope="data">
            {{ data.item.name }}
          </template>
          <template v-slot:label>
            <div v-if="label">
              <span v-if="!norequired"
                >{{ label
                }}<span :class="disabled ? '' : 'text-red'">*</span></span
              >
              <span v-else>{{ label }}</span>
            </div>
            <div v-else>
              <span v-if="!norequired"
                >Role<span :class="disabled ? '' : 'text-red'">*</span></span
              >
              <span v-else>Role</span>
            </div>
          </template>
        </v-autocomplete>
      </v-col>
      <v-col cols="12" md="2" v-if="checkbox">
        <v-checkbox
          :disabled="disabled"
          class="-mt40"
          label="Select All Role"
          v-model="all_role"
          @click="allRole(all_role)"
        ></v-checkbox>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "MultiSelectRole",
  data() {
    return {
      disabled_role: true,
      all_role: false,
      items: [],
      placeholder: "",
      is_loading: false,
      roles: [],
      search: "",
    };
  },
  props: [
    "role",
    "disabled",
    "clear",
    "label",
    "checkbox",
    "error",
    "aux_data",
    "norequired",
    "dense",
    "division_id",
    "main_role",
  ],
  methods: {
    remoteSearch(search, div) {
      let division_id = "";
      if (div !== "" && div !== undefined && div !== null) {
        division_id = "|division_id:" + div;
      }
      this.placeholder = "Loading items...";
      this.is_loading = true;
      // ini ke endpoint get all
      this.$http
        .get("/account/v1/role", {
          params: {
            conditions: "status:1|name.icontains:" + search + division_id,
            orderby: "-id",
          },
        })
        .then((response) => {
          this.disabled_role = this.disabled;
          this.items = [];
          if (response.data.data) {
            this.items = response.data.data;
            if (this.main_role) {
              this.items = this.items.filter((e) => e.id != this.main_role);
            }
          }
          this.is_loading = false;
          let label = "Role";
          if (this.label) label = this.label;
          this.placeholder = "Select " + label;
        });
    },
    autoSelectByID(val) {
      // auto select by ID
      if (val) {
        this.roles = [];
        for (let i = 0; i < val.length; i++) {
          this.roles.push(val[i]);
        }
      }
    },
    selected(event) {
      // select komponen
      this.$emit("selected", event);
      if (event.length - 1) {
        // disable checkbox ketika clear 1 item
        this.all_role = false;
      }
    },
    allRole(d) {
      // checkbox untuk select all role
      if (d == true) {
        this.roles = this.items;
        this.disabled_role = true;
        this.$emit("selected", this.items);
      } else {
        this.roles = [];
        this.disabled_role = false;
        this.$emit("selected", this.roles);
      }
    },
  },
  watch: {
    search: {
      // untuk search
      handler: function (val) {
        if (val) {
          if (this.computed_counter_value < this.max_selected) {
            this.remoteSearch(val, this.division_id);
          }
        } else if (!this.role) {
          this.remoteSearch("", this.division_id);
        }
      },
      deep: true,
    },
    clear: {
      handler: function (val) {
        this.roles = null;
        this.all_role = false;
        this.remoteSearch("", this.division_id);
      },
      deep: true,
    },
    main_role: {
      handler: function (val) {
        if (val !== null) {
          this.remoteSearch("", this.division_id);
        }
      },
      deep: true,
    },
    role: {
      handler: function (val) {
        if (val !== null) {
          this.autoSelectByID(val);
        }
      },
      deep: true,
    },
    roles: {
      // untuk search
      handler: function (val) {
        this.remoteSearch("", this.division_id);
      },
      deep: true,
    },
    division_id: {
      handler: function (val) {
        if (val !== null) {
          this.remoteSearch("", val);
        }
      },
      deep: true,
    },
  },
};
</script>
