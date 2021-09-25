<template>
  <div>
    <CRow>
      <CCol sm="6">
        <CCard>
          <CCardHeader>
            <strong>Sezonlar</strong>
            <div class="card-header-actions">
              <small v-text="mode === 'new' ? 'Yeni' : 'Düzenle'"></small>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="12">
                <CInput
                  v-model="formData.name"
                  label="Sezon Adı"
                  placeholder="Sezon Adı"
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
                />
              </CCol>

              <CCol sm="6">
                <CSelect
                  :value.sync="formData.transferActive"
                  label="Transfer Durumu"
                  :options="
                    transferStatuses.map((p) => ({
                      value: p.id,
                      label: p.name,
                    }))
                  "
                />
              </CCol>

              <CCol sm="6">
                <CInput
                  v-model="formData.startDate"
                  label="Başlangıç Zamanı"
                  placeholder="Başlangıç Zamanı"
                  type="date"
                />
              </CCol>

              <CCol sm="6">
                <CInput
                  v-model="formData.endDate"
                  label="Bitiş Zamanı"
                  placeholder="Bitiş Zamanı"
                  type="date"
                />
              </CCol>

              <CCol sm="6">
                <CInput
                  v-model="formData.transferStartDate"
                  label="Transfer Başlangıç Zamanı"
                  placeholder="Transfer Başlangıç Zamanı"
                  type="date"
                />
              </CCol>

              <CCol sm="6">
                <CInput
                  v-model="formData.transferFinishDate"
                  label="Transfer Bitiş Zamanı"
                  placeholder="Transfer Bitiş Zamanı"
                  type="date"
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
              Sezonlar
            </slot>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              :columnFilter="true"
              :hover="true"
              :striped="true"
              :items="seasons"
              :fields="[
                {
                  key: 'id',
                  label: 'ID',
                },
                {
                  key: 'province',
                  label: 'İl',
                },
                {
                  key: 'name',
                  label: 'Sezon Adı',
                },
                {
                  key: 'transferActive',
                  label: 'Transfer Durumu',
                },
                {
                  key: 'startDate',
                  label: 'Başlangıç Zamanı',
                },
                {
                  key: 'endDate',
                  label: 'Bitiş Zamanı',
                },
                {
                  key: 'transferStartDate',
                  label: 'Transfer Başlangıç Zamanı',
                },
                {
                  key: 'transferFinishDate',
                  label: 'Transfer Bitiş Zamanı',
                },
                {
                  key: 'actions',
                  label: 'Aksiyonlar',
                },
              ]"
              :items-per-page="10"
              pagination
            >
              <template #transferActive="{ item }">
                <td>{{ item.transferActive ? "Aktif" : "Pasif" }}</td>
              </template>
              <template #province="{ item }">
                <td>{{ item.province.name }}</td>
              </template>
              <template #startDate="{ item }">
                <td>{{ item.startDate | moment("DD.MM.YYYY") }}</td>
              </template>
              <template #endDate="{ item }">
                <td>{{ item.endDate | moment("DD.MM.YYYY") }}</td>
              </template>
              <template #transferStartDate="{ item }">
                <td>{{ item.transferStartDate | moment("DD.MM.YYYY") }}</td>
              </template>
              <template #transferFinishDate="{ item }">
                <td>{{ item.transferFinishDate | moment("DD.MM.YYYY") }}</td>
              </template>
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
  name: "Seasons",
  components: {},
  data() {
    return {
      mode: "new",
      seasons: [],
      transferStatuses: [
        { id: "false", name: "Pasif" },
        { id: "true", name: "Aktif" },
      ],
      provinces: [
        {
          id: "loading",
          name: "İller Yükleniyor",
        },
      ],
      id: null,
      formData: {
        name: "",
        startDate: "",
        endDate: "",
        transferStartDate: "",
        transferFinishDate: "",
        provinceId: "",
        transferActive: false,
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
      this.id = i.id;
      delete this.formData.id;
    },
    clean() {
      this.mode = "new";
      this.formData = {
        name: "",
        startDate: "",
        endDate: "",
        transferStartDate: "",
        transferFinishDate: "",
        provinceId: "",
        transferActive: false,
      };
      this.id = null;
    },
    update: function (id) {
      this.$axios
        .put(`/seasons/${id}`, this.formData)
        .then(() => {
          this.getSeasons().then(({ data }) => {
            this.seasons = data;
          });
          this.clean();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    create: function () {
      this.$axios
        .post("/seasons", this.formData)
        .then(() => {
          this.getSeasons().then(({ data }) => {
            this.seasons = data;
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
          .delete(`/seasons/${id}`)
          .then(() => {
            this.getSeasons().then(({ data }) => {
              this.seasons = data;
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    getSeasons: function () {
      const provinceFilter =
        this.user.role === "SuperAdmin"
          ? ""
          : `&provinceId=${this.user.provinceId}`;
      return this.$axios
        .get(`/seasons?associations=province&status=1${provinceFilter}`)
        .then((res) => {
          return res;
        });
    },
    getProvinces: function () {
      return this.$axios.get("/provinces").then((res) => {
        return res;
      });
    },
  },
  mounted() {
    this.getSeasons().then(({ data }) => {
      this.seasons = data;
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
      }
    });
  },
};
</script>
