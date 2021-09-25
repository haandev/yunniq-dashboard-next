<template>
  <div>
    <CRow>
      <CCol sm="4">
        <CCard>
          <CCardHeader>
            <strong>Fotoğraf</strong>
            <div class="card-header-actions">
              <small v-text="mode === 'new' ? 'Yeni' : 'Düzenle'"></small>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="12">
                <img
                  class="crop-image pick-logo-team"
                  :src="uploaded"
                  alt="Image not found"
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
      <CCol sm="8">
        <CCard>
          <CCardHeader>
            <slot name="header"> <CIcon name="cil-grid" /> Fotoğraflar </slot>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              :columnFilter="true"
              :hover="true"
              :striped="true"
              :items="matchImages"
              :fields="[
                {
                  key: 'id',
                  label: 'ID',
                },
                {
                  key: 'image',
                  label: 'Resim',
                },
                {
                  key: 'actions',
                  label: 'Aksiyonlar',
                },
              ]"
              :items-per-page="10"
              pagination
            >
              <template #image="{ item }">
                <td>
                  <img
                    class="list-image"
                    :src="`${$axios.defaults.baseURL}/uploads/${item.image}`"
                  />
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
    <avatar-cropper
      @uploaded="handleUploaded"
      trigger=".pick-logo-team"
      :labels="{ cancel: 'Vazgeç', submit: 'Onayla' }"
      :uploadUrl="`${$axios.defaults.baseURL}/file`"
    />
  </div>
</template>

<script>
import AvatarCropper from "vue-avatar-cropper";

export default {
  name: "MatchImages",
  props: ["matchId"],
  components: {
    AvatarCropper,
  },
  data() {
    return {
      mode: "new",
      matchImages: [],
      id: null,
      formData: {
        image: "",
      },
      uploaded: "img/avatars/logo.png",
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
        matchId: "",
        image: "",
      };
      this.uploaded = "img/avatars/logo.png";
      this.id = null;
    },
    create: function () {
      this.$axios
        .post("/matches/image", { ...this.formData, matchId: this.matchId })
        .then(() => {
          this.getMatchImages().then(({ data }) => {
            this.matchImages = data;
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
          .delete(`/matches/image/${id}`)
          .then(() => {
            this.getMatchImages().then(({ data }) => {
              this.matchImages = data;
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    handleUploaded(e) {
      this.formData.image = e.fileName;
      this.uploaded = `${this.$axios.defaults.baseURL}/uploads/${e.fileName}`;
    },
    getMatchImages: function () {
      return this.$axios
        .get(`/matches/image?matchId=${this.matchId}`)
        .then((res) => {
          return res;
        });
    },
  },
  watch: {
    matchId() {
      if (this.matchId) {
        this.clean();
        this.getMatchImages().then(({ data }) => {
          this.matchImages = data;
        });
      }
    },
  },
};
</script>
<style scoped>
.list-image {
  width: 35px;
}

.crop-image {
  max-width: 100%;
}
</style>