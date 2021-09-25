<template>
  <div>
    <CRow>
      <CCol sm="6">
        <CCard>
          <CCardHeader>
            <strong>Ligler </strong>
            <div class="card-header-actions">
              <small v-text="mode === 'new' ? 'Yeni' : 'Düzenle'"></small>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="6">
                <CInput
                  :value.sync="formData.name"
                  label="Lig Adı"
                  placeholder="Lig Adı"
                />
              </CCol>
              <CCol sm="6">
                <CSelect
                  :value.sync="formData.leagueTypeId"
                  label="Lig Tipi"
                  :options="
                    leagueTypes.map((p) => ({
                      value: p.id,
                      label: p.name,
                    }))
                  "
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="6">
                <CSelect
                  :value.sync="formData.status"
                  label="Durum"
                  :options="[
                    {
                      value: 0,
                      label: 'Pasif',
                    },
                    {
                      value: 1,
                      label: 'Aktif',
                    },
                  ]"
                />
              </CCol>
              <CCol sm="6">
                <CSelect
                  :value.sync="formData.provinceId"
                  label="İl"
                  :disabled="this.user.role !== 'SuperAdmin'"
                  :options="
                    provinces.map((p) => ({
                      value: p.id,
                      label: p.name,
                    }))
                  "
                  @change="provinceChanged()"
                />
              </CCol>
              <CCol sm="6">
                <CSelect
                  :value.sync="formData.districtId"
                  label="İlçe"
                  :options="
                    districts.map((p) => ({
                      value: p.id,
                      label: p.name,
                    }))
                  "
                />
              </CCol>
              <CCol sm="6">
                <CSelect
                  :value.sync="formData.seasonId"
                  label="Sezon"
                  :options="
                    seasons.map((p) => ({
                      value: p.id,
                      label: p.name,
                    }))
                  "
                />
              </CCol>
            </CRow>
            <hr />
            <CRow>
              <CCol sm="12" class="text-right">
                <CButton
                  v-if="mode !== 'new'"
                  @click="update(id)"
                  size="sm"
                  color="primary"
                  class="mr-1"
                  >Kaydet</CButton
                >
                <CButton
                  v-else
                  @click="create()"
                  size="sm"
                  color="primary"
                  class="mr-1"
                  >Yeni Ekle</CButton
                >
                <CButton
                  @click="clean()"
                  size="sm"
                  variant="outline"
                  color="primary"
                  class="mr-1"
                  >Temizle</CButton
                >
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader>
            <slot name="header">
              <CIcon name="cil-grid" />
              Ligler
            </slot>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              :columnFilter="true"
              :hover="true"
              :striped="true"
              :items="leagues"
              :fields="[
                {
                  key: 'id',
                  label: 'ID',
                },
                {
                  key: 'name',
                  label: 'Lig Adı',
                },
                {
                  key: 'leagueType',
                  label: 'Lig Tipi',
                },
                {
                  key: 'province',
                  label: 'İl',
                },
                {
                  key: 'district',
                  label: 'İlçe',
                },
                {
                  key: 'season',
                  label: 'Sezon',
                },
                {
                  key: 'status',
                  label: 'Durum',
                },
                {
                  key: 'actions',
                  label: 'Aksiyonlar',
                },
              ]"
              :items-per-page="10"
              pagination
            >
              <template #leagueType="{ item }">
                <td>{{ item.leagueType.name }}</td>
              </template>
              <template #province="{ item }">
                <td>{{ item.province.name }}</td>
              </template>
              <template #district="{ item }">
                <td>{{ item.district.name }}</td>
              </template>
              <template #season="{ item }">
                <td>{{ item.season.name }}</td>
              </template>
              <template #status="{ item }"
                ><td>
                  {{ item.status == 0 ? "Pasif" : "Aktif" }}
                </td></template
              >
              <template #actions="{ item }">
                <td>
                  <CButton
                    @click="edit(item)"
                    size="sm"
                    variant="outline"
                    color="primary"
                    class="mr-1"
                    >Düzenle
                  </CButton>
                  <CButton
                    @click="remove(item.id)"
                    size="sm"
                    variant="outline"
                    color="danger"
                    >Sil</CButton
                  >
                </td>
              </template>
            </CDataTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Leagues",
  components: {},
  data() {
    return {
      mode: "new",
      leagueTypes: [
        {
          id: "loading",
          name: "Lig Tipleri Yükleniyor",
        },
      ],
      provinces: [
        {
          id: "loading",
          name: "İller Yükleniyor",
        },
      ],
      districts: [
        {
          id: "loading",
          name: "İlçeler Yükleniyor",
        },
      ],
      seasons: [
        {
          id: "loading",
          name: "Sezonlar Yükleniyor",
        },
      ],
      leagues: [],
      id: null,
      formData: {
        name: "",
        seasonId: "",
        provinceId: "",
        districtId: "",
        status: "",
      },
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    edit(i) {
      this.mode = "edit";
      this.formData = { ...i };
      this.formData.password = "";
      this.id = i.id;
      delete this.formData.id;
    },
    clean() {
      this.mode = "new";
      this.formData = {
        name: "",
        seasonId: "",
        provinceId: "",
        districtId: "",
        status: "",
      };
      this.id = null;
    },
    update: function (id) {
      this.$axios
        .put(`/leagues/${id}`, this.formData)
        .then(() => {
          this.getLeagues().then(({ data }) => {
            this.leagues = data;
          });
          this.clean();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    create: function () {
      this.$axios
        .post("/leagues", this.formData)
        .then(() => {
          this.getLeagues().then(({ data }) => {
            this.leagues = data;
          });
          this.clean();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    remove: function (id) {
      if (confirm("Silmek istediğinize emin misiniz")) {
        this.$axios
          .delete(`/leagues/${id}`)
          .then(() => {
            this.getLeagues().then(({ data }) => {
              this.leagues = data;
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    getProvinces: function () {
      return this.$axios.get("/provinces").then((res) => {
        return res;
      });
    },
    getDistricts: function () {
      const provinceFilter =
        this.user.role === "SuperAdmin"
          ? ""
          : `?provinceId=${this.user.provinceId}`;
      return this.$axios.get(`/districts${provinceFilter}`).then((res) => {
        return res;
      });
    },
    getSeasons: function () {
      const provinceFilter =
        this.user.role === "SuperAdmin"
          ? ""
          : `?provinceId=${this.user.provinceId}`;
      return this.$axios.get(`/seasons${provinceFilter}`).then((res) => {
        return res;
      });
    },
    getLeagueTypes: function () {
      return this.$axios.get("/leagueTypes").then((res) => {
        return res;
      });
    },
    getLeagues: function () {
      const provinceFilter =
        this.user.role === "SuperAdmin"
          ? ""
          : `&provinceId=${this.user.provinceId}`;
      return this.$axios
        .get(`/leagues?associations=province,leagueType,district,season&status=1${provinceFilter}`)
        .then((res) => {
          return res;
        });
    },
    provinceChanged() {
      this.getDistricts().then(({ data }) => {
        this.districts = [
          {
            id: "",
            name: "İlçe Seçilmedi",
          },
          ...data,
        ];
      });
    },
  },
  mounted() {
    this.getSeasons().then(({ data }) => {
      this.seasons = [
        {
          id: "",
          name: "Sezon Seçilmedi",
        },
        ...data,
      ];
    });
    this.getProvinces().then(({ data }) => {
      this.provinces = [
        {
          id: "",
          name: "İl Seçilmedi",
        },
        ...data,
      ];

      if (this.user.role !== "SuperAdmin") {
        this.formData.provinceId = this.user.provinceId;
        this.provinceChanged();
      }
    });
    this.getLeagueTypes().then(({ data }) => {
      this.leagueTypes = [
        {
          id: "",
          name: "Lig Tipi Seçilmedi",
        },
        ...data,
      ];
    });
    this.getLeagues().then(({ data }) => {
      this.leagues = data;
    });
  },
};
</script>
