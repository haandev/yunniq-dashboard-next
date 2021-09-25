<template>
  <div>
    <CRow>
      <CCol sm="6">
        <CCard>
          <CCardHeader>
            <strong>Personel Listesi</strong>
            <div class="card-header-actions">
              <small v-text="mode === 'new' ? 'Yeni' : 'Düzenle'"></small>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="4">
                <img class="crop-image pick-logo-team" :src="uploaded" alt="Image not found"/>

              </CCol>
              <CCol sm="8">
                <CRow>
                  <CCol sm="6">
                    <CInput
                        v-model="formData.name"
                        label="Adı"
                        placeholder="Adı"
                    />
                  </CCol>

                  <CCol sm="6">
                    <CInput
                        label="Soyadı"
                        v-model="formData.surname"
                        placeholder="Soyadı"
                    />
                  </CCol>

                  <CCol sm="6">
                    <CSelect
                        :value.sync="formData.role"
                        label="Görevi"
                        :options="roles"
                    />
                  </CCol>

                  <CCol sm="6">
                    <CSelect
                        :value.sync="formData.provinceId"
                        label="İl"
                        :options="provinces.map(p => ({
                          value: p.id,
                          label: p.name
                        }))"
                    />
                  </CCol>

                  <CCol sm="12">
                    <CTextarea
                        label="Biyografi"
                        v-model="formData.bio"
                        placeholder="Biyografi"
                    />
                  </CCol>

                </CRow>
              </CCol>
            </CRow>

            <hr/>
            <CRow>
              <CCol sm="12" class="text-right">
                <CButton
                    v-if="mode !== 'new'"
                    @click="update(id)"
                    size="sm"
                    color="primary"
                    class="mr-1"
                >Kaydet
                </CButton
                >
                <CButton
                    v-else
                    @click="create()"
                    size="sm"
                    color="primary"
                    class="mr-1"
                >Yeni Ekle
                </CButton
                >
                <CButton
                    @click="clean()"
                    size="sm"
                    variant="outline"
                    color="primary"
                    class="mr-1"
                >Temizle
                </CButton
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
              <CIcon name="cil-grid"/>
              Ekip
            </slot>
          </CCardHeader>
          <CCardBody>
            <CDataTable
                :columnFilter="true"
                :hover="true"
                :striped="true"
                :items="systemTeamUsers"
                :fields="[
                {
                  key: 'id',
                  label: 'ID',
                },
                {
                  key: 'photoUrl',
                  label: 'Fotoğraf',
                },
                {
                  key: 'name',
                  label: 'Adı',
                },
                {
                  key: 'surname',
                  label: 'Soyadı',
                },
                                {
                  key: 'role',
                  label: 'Görevi',
                },
                {
                  key: 'bio',
                  label: 'Biyografi',
                },
                {
                  key: 'province',
                  label: 'İl',
                },
                {
                  key: 'actions',
                  label: 'Aksiyonlar',
                },
              ]"
                :items-per-page="10"
                pagination
            >
              >
              <template #photoUrl="{item}">
                <td>
                  <img class="list-image"
                       :src="item.photoUrl ? `${$axios.defaults.baseURL}/uploads/${item.photoUrl}` : 'img/avatars/logo.png'"
                       alt="Image not found"
                       onerror="this.onerror=null;this.src='img/avatars/logo.png';"/>
                </td>
              </template>
              <template #province="{item}">
                <td>{{
                    item.province.name
                  }}
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
                  >Düzenle
                  </CButton
                  >
                  <CButton
                      @click="remove(item.id)"
                      size="sm"
                      variant="outline"
                      color="danger"
                  >Sil
                  </CButton
                  >
                </td>
              </template>
            </CDataTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <avatar-cropper
        @uploaded="handleUploaded"
        trigger=".pick-logo-team"
        :labels="{cancel:'Vazgeç',submit:'Onayla'}"
        :uploadUrl="`${$axios.defaults.baseURL}/file`"
    />
  </div>
</template>

<script>
import AvatarCropper from "vue-avatar-cropper";
import { mapState } from "vuex";

export default {
  name: "SystemTeamUsers",
  components: {AvatarCropper},
  data() {
    return {
      mode: "new",
      systemTeamUsers: [],
      provinces: [],
      roles: [
        {value: '', label: 'Görev Seçilmedi'},
        {value: 'Hakem', label: 'Hakem'},
        {value: 'Gözlemci', label: 'Gözlemci'},
      ],
      id: null,
      formData: {
        name: "",
        surname: "",
        role: "",
        photoUrl: "",
        bio: "",
        provinceId: "",
      },
      uploaded: 'img/avatars/logo.png',
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    edit(i) {
      this.mode = "edit";
      this.formData = {...i};
      this.uploaded = i.photoUrl ?
          `${this.$axios.defaults.baseURL}/uploads/${i.photoUrl}` :
          'img/avatars/logo.png';
      this.id = i.id;
      delete this.formData.id;
    },
    clean() {
      this.mode = "new";
      this.formData = {
        name: "",
        surname: "",
        role: "",
        photoUrl: "",
        bio: "",
        provinceId: "",
      };
      this.uploaded = 'img/avatars/logo.png';
      this.id = null;
    },
    update: function (id) {
      this.$axios
          .put(`/systemTeamUsers/${id}`, this.formData)
          .then(() => {
            this.getSystemTeamUsers().then(({data}) => {
              this.systemTeamUsers = data;
            });
            this.clean();
          })
          .catch((err) => {
            console.log(err);
          });
    },
    create: function () {
      this.$axios
          .post("/systemTeamUsers", this.formData)
          .then(() => {
            this.getSystemTeamUsers().then(({data}) => {
              this.systemTeamUsers = data;
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
            .delete(`/systemTeamUsers/${id}`)
            .then(() => {
              this.getSystemTeamUsers().then(({data}) => {
                this.systemTeamUsers = data;
              });
            })
            .catch((err) => {
              console.log(err);
            });
      }
    },
    getSystemTeamUsers: function () {
      const provinceFilter =
        this.user.role === "SuperAdmin"
          ? ""
          : `provinceId=${this.user.provinceId}`;
      return this.$axios.get(`/systemTeamUsers?associations=province&${provinceFilter}`).then((res) => {
        return res;
      });
    },
    getProvinces: function () {
      return this.$axios.get('/provinces').then(res => {
        return res
      })
    },
    handleUploaded(e) {
      this.formData.photoUrl = e.fileName
      this.uploaded = `${this.$axios.defaults.baseURL}/uploads/${e.fileName}`
    }
  },
  mounted() {
    this.getProvinces().then(({data}) => {
      this.provinces = [{
        id: '0',
        name: 'İl Seçilmedi'
      }, ...data]
    });
    this.getSystemTeamUsers().then(({data}) => {
      this.systemTeamUsers = data;
    });
  },
};
</script>
<style>
.list-image {
  width: 35px;
}

.crop-image {
  max-width: 100%;
}
</style>