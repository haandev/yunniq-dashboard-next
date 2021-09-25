<template>
  <div>
    <CRow>
      <CCol sm="6">
        <CCard>
          <CCardHeader>
            <strong>İl</strong>
            <div class="card-header-actions">
              <small v-text="mode === 'new' ? 'Yeni' : 'Düzenle'"></small>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="6">
                <CInput
                  v-model="formData.name"
                  label="İl Adı"
                  placeholder="İl Adı"
                />
              </CCol>

              <CCol sm="6">
                <CInput
                  label="Plaka Kodu"
                  v-model="formData.plateCode"
                  placeholder="Plaka Kodu"
                />
              </CCol>

              <CCol sm="6">
                <CInput
                  label="Facebook Adresi"
                  v-model="formData.facebook"
                  placeholder="Facebook Adresi"
                />
              </CCol>

              <CCol sm="6">
                <CInput
                  label="Twitter Adresi"
                  v-model="formData.twitter"
                  placeholder="Twitter Adresi"
                />
              </CCol>

              <CCol sm="6">
                <CInput
                  label="Instagram Adresi"
                  v-model="formData.instagram"
                  placeholder="Instagram Adresi"
                />
              </CCol>

              <CCol sm="6">
                <CInput
                  label="Instagram Adresi"
                  v-model="formData.instagram"
                  placeholder="Instagram Adresi"
                />
              </CCol>

              <CCol sm="6">
                <CInput
                  label="Youtube Adresi"
                  v-model="formData.youtube"
                  placeholder="Youtube Adresi"
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
                  v-else-if="user.role === 'SuperAdmin'"
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
            <slot name="header"> <CIcon name="cil-grid" /> İller </slot>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              :columnFilter="true"
              :hover="true"
              :striped="true"
              :items="provinces"
              :fields="[
                {
                  key: 'id',
                  label: 'ID',
                },
                {
                  key: 'name',
                  label: 'İl Adı',
                },
                {
                  key: 'plateCode',
                  label: 'Plaka No',
                },
                {
                  key: 'actions',
                  label: 'Aksiyonlar',
                },
              ]"
              :items-per-page="10"
              pagination
            >
              <template #province="{ item }"
                ><td>
                  {{ provinces.find((p) => p.id === item.provinceId).name }}
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
                    >Düzenle</CButton
                  >
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
  name: "Provinces",
  components: {},
  computed: {
    ...mapState(["user"]),
  },
  data() {
    return {
      mode: "new",
      provinces: [],
      id: null,
      formData: {
        name: "",
        plateCode: "",
        facebook: '',
        twitter: '',
        instagram: '',
        youtube: ''
      },
    };
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
        plateCode: "",
      };
      this.id = null;
    },
    update: function (id) {
      this.$axios
        .put(`/provinces/${id}`, this.formData)
        .then(() => {
          this.getProvinces().then(({ data }) => {
            this.provinces = data;
          });
          this.clean();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    create: function () {
      this.$axios
        .post("/provinces", this.formData)
        .then(() => {
          this.getProvinces().then(({ data }) => {
            this.provinces = data;
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
          .delete(`/provinces/${id}`)
          .then(() => {
            this.getProvinces().then(({ data }) => {
              this.provinces = data;
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    getProvinces: function () {
      const provinceFilter =
        this.user.role === "SuperAdmin" ? "" : `?id=${this.user.provinceId}`;
      return this.$axios.get(`/provinces${provinceFilter}`).then((res) => {
        return res;
      });
    },
  },
  mounted() {
    this.getProvinces().then(({ data }) => {
      this.provinces = data;
    });
  },
};
</script>
