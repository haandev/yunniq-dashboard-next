<template>
  <div>
    <CRow>
      <CCol sm="6">
        <CCard>
          <CCardHeader>
            <strong>Sistem Kullanıcısı </strong>
            <div class="card-header-actions">
              <small v-text="mode === 'new' ? 'Yeni' : 'Düzenle'"></small>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="6">
                <CInput
                  :value.sync="formData.username"
                  label="Kullanıcı Adı"
                  placeholder="Kullanıcı Adı"
                />
              </CCol>

              <CCol sm="6">
                <CInput
                  label="Parola"
                  :value.sync="formData.password"
                  placeholder="Parola"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="6">
                <CSelect
                  :value.sync="formData.role"
                  label="Rol"
                  :options="[
                    { value: '', label: 'Sistem Kullanıcısı Seçilmedi' },
                    {
                      value: 'SuperAdmin',
                      label: 'Super Admin',
                    },
                    {
                      value: 'IlTemsilcisi',
                      label: 'İl Temsilcisi',
                    },
                  ]"
                />
              </CCol>
              <CCol sm="6">
                <CSelect
                  :value.sync="formData.provinceId"
                  label="Yeki Alanı"
                  :options="
                    provinces.map((p) => ({
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
              <CIcon name="cil-grid" /> Sistem Kullanıcıları
            </slot>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              :columnFilter="true"
              :hover="true"
              :striped="true"
              :items="systemUsers"
              :fields="[
                {
                  key: 'id',
                  label: 'ID',
                },
                {
                  key: 'username',
                  label: 'Kullanıcı Adı',
                },
                {
                  key: 'role',
                  label: 'Rol',
                },
                {
                  key: 'province',
                  label: 'Yetki Alanı',
                },
                {
                  key: 'actions',
                  label: 'Aksiyonlar',
                },
              ]"
              :items-per-page="10"
              pagination
            >
              <template #province="{ item }">
                <td>
                  {{ item.province? item.province.name : '' }}
                </td>
              </template>
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
export default {
  name: "SystemUsers",
  components: {},
  data() {
    return {
      mode: "new",
      provinces: [
        {
          id: "loading",
          name: "İller Yükleniyor",
        },
      ],
      systemUsers: [],
      id: null,
      formData: {
        username: "",
        password: "",
        provinceId: "",
        role: "Moderator",
      },
    };
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
        username: "",
        password: "",
        provinceId: "",
        role: "Moderator",
      };
      this.id = null;
    },
    update: function (id) {
      this.formData.password === "" && delete this.formData.password;
      this.$axios
        .put(`/systemUsers/${id}`, this.formData)
        .then(() => {
          this.getSystemUsers().then(({ data }) => {
            this.systemUsers = data;
          });
          this.clean();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    create: function () {
      this.$axios
        .post("/systemUsers", this.formData)
        .then(() => {
          this.getSystemUsers().then(({ data }) => {
            this.systemUsers = data;
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
          .delete(`/systemUsers/${id}`)
          .then(() => {
            this.getSystemUsers().then(({ data }) => {
              this.systemUsers = data;
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
    getSystemUsers: function () {
      return this.$axios.get("/systemUsers?associations=province").then((res) => {
        return res;
      });
    },
  },
  mounted() {
    this.getProvinces().then(({ data }) => {
      this.provinces = [
        {
          id: "0",
          name: "İl Seçilmedi",
        },
        ...data,
      ];
    });
    this.getSystemUsers().then(({ data }) => {
      this.systemUsers = data;
    });
  },
};
</script>
