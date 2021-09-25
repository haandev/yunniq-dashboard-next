<template>
  <div>
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader>
            <strong>Oyuncu</strong>
            <div class="card-header-actions">
              <small v-text="modePlayer === 'new' ? 'Yeni' : 'Düzenle'"></small>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="2">
                <img
                  class="crop-image pick-logo-player"
                  :src="uploaded"
                  alt="Image not found"
                />
              </CCol>
              <CCol sm="10">
                <CRow>
                  <CCol sm="3">
                    <CInput
                      :value.sync="playerFormData.firstname"
                      label="Adı"
                      placeholder="Adı"
                    />
                  </CCol>
                  <CCol sm="3">
                    <CInput
                      :value.sync="playerFormData.lastname"
                      label="Soyadı"
                      placeholder="Soyadı"
                    />
                  </CCol>
                  <CCol sm="3">
                    <CInput
                      :value.sync="playerFormData.mail"
                      label="Eposta"
                      placeholder="Eposta"
                    />
                  </CCol>
                  <CCol sm="3">
                    <CInput
                      :value.sync="playerFormData.phone"
                      label="Telefon"
                      placeholder="Telefon"
                    />
                  </CCol>

                  <CCol sm="3">
                    <CSelect
                      :value.sync="playerFormData.position1Id"
                      label="Pozisyon 1"
                      :options="
                        positions.map((p) => ({
                          value: p.id,
                          label: p.name,
                        }))
                      "
                    />
                  </CCol>
                  <CCol sm="3">
                    <CSelect
                      :value.sync="playerFormData.position2Id"
                      label="Pozisyon 2"
                      :options="
                        positions.map((p) => ({
                          value: p.id,
                          label: p.name,
                        }))
                      "
                    />
                  </CCol>

                  <CCol sm="3">
                    <CSelect
                      :value.sync="playerFormData.provinceId"
                      :options="
                        provinces.map((p) => ({
                          value: p.id,
                          label: p.name,
                        }))
                      "
                      label="İl"
                    />
                  </CCol>
                  <CCol sm="3">
                    <CSelect
                      :value.sync="playerFormData.teamId"
                      label="Takımı"
                      :options="
                        teams.map((p) => ({
                          value: p.id,
                          label: p.name,
                        }))
                      "
                    />
                  </CCol>
                  <CCol sm="3">
                    <CSelect
                      :value.sync="playerFormData.foot"
                      label="Ayak"
                      :options="[
                        {
                          value: 0,
                          label: 'Sol',
                        },
                        {
                          value: 1,
                          label: 'Sağ',
                        },
                      ]"
                    />
                  </CCol>
                  <CCol sm="3">
                    <CInput
                      :value.sync="playerFormData.teamNumber"
                      label="Forma Numarası"
                      placeholder="Forma Numarası"
                    />
                  </CCol>
                  <CCol sm="3">
                    <CInput
                      :value.sync="playerFormData.height"
                      label="Boy"
                      placeholder="Boy"
                    />
                  </CCol>
                  <CCol sm="3">
                    <CInput
                      :value.sync="playerFormData.weight"
                      label="Ağırlık"
                      placeholder="Ağırlık"
                    />
                  </CCol>
                  <CCol sm="3">
                    <CInput
                      :value.sync="playerFormData.birthday"
                      label="Doğum Tarihi"
                      type="date"
                      placeholder="Doğum Tarihi"
                    />
                  </CCol>
                  <CCol sm="3">
                    <CInput
                      :value.sync="playerFormData.tckn"
                      label="TCKN"
                      placeholder="TCKN"
                    />
                  </CCol>

                  <CCol sm="3">
                    <CInput
                      :value.sync="playerFormData.password"
                      label="Parola"
                      placeholder="Parola"
                    />
                  </CCol>
                  <CCol sm="3">
                    <CSelect
                      :value.sync="playerFormData.status"
                      label="Durumu"
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
                </CRow>
              </CCol>
            </CRow>

            <hr />
            <CRow>
              <CCol sm="12" class="text-right">
                <CButton
                  v-if="modePlayer !== 'new'"
                  @click="updatePlayer(id)"
                  size="sm"
                  color="primary"
                  class="mr-1"
                  >Kaydet</CButton
                >
                <CButton
                  v-else
                  @click="createPlayer()"
                  size="sm"
                  color="primary"
                  class="mr-1"
                  >Yeni Ekle</CButton
                >
                <CButton
                  @click="cleanPlayer()"
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
            <strong>Oyuncular</strong>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              :columnFilter="true"
              :hover="true"
              :striped="true"
              :items="teamPlayers"
              :fields="[
                {
                  key: 'id',
                  label: 'ID',
                },
                {
                  key: 'imageImg',
                  label: 'Img',
                },
                {
                  key: 'firstname',
                  label: 'Ad',
                },
                {
                  key: 'lastname',
                  label: 'Soyad',
                },
                {
                  key: 'position1Str',
                  label: 'Pozisyon 1',
                },
                {
                  key: 'position2Str',
                  label: 'Pozisyon 2',
                },
                {
                  key: 'actions',
                  label: 'Aksiyonlar',
                },
              ]"
              :items-per-page="10"
              pagination
            >
              <template #imageImg="{ item }"
                ><td>
                  <img
                    class="list-image"
                    :src="
                      item.image
                        ? `${$axios.defaults.baseURL}/uploads/${item.image}`
                        : 'img/avatars/logo.png'
                    "
                    alt="Image not found"
                    onerror="this.onerror=null;this.src='img/avatars/logo.png';"
                  /></td
              ></template>
              <template #position1Str="{ item }">
                <td>
                  {{
                    positions.find((p) => p.id === item.position1Id) &&
                    positions.find((p) => p.id === item.position1Id).name
                  }}
                </td>
              </template>
              <template #position2Str="{ item }">
                <td>
                  {{
                    positions.find((p) => p.id === item.position2Id) &&
                    positions.find((p) => p.id === item.position2Id).name
                  }}
                </td>
              </template>
              <template #actions="{ item }">
                <td>
                  <CButton
                    @click="editPlayer(item)"
                    size="sm"
                    variant="outline"
                    color="primary"
                    class="mr-1"
                    >Düzenle</CButton
                  >
                  <CButton
                    @click="removePlayer(item.id)"
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

        <avatar-cropper
          @uploaded="handleUploadedPlayer"
          trigger=".pick-logo-player"
          :labels="{ cancel: 'Vazgeç', submit: 'Onayla' }"
          :uploadUrl="`${$axios.defaults.baseURL}/file`"
        />
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
<style>
.list-image {
  width: 35px;
}
.crop-image {
  max-width: 100%;
}
</style>
<script>
import AvatarCropper from "vue-avatar-cropper";
import { mapState } from "vuex";

export default {
  name: "Teams",
  components: { AvatarCropper },
  data() {
    return {
      mode: "new",
      modePlayer: "new",
      provinces: [{ id: 0, name: "" }],
      positions: [{ id: 0, name: "" }],
      districts: [{ id: 0, name: "" }],
      teams: [{ id: 0, name: "" }],
      id: null,
      uploaded: "https://via.placeholder.com/250",
      teamPlayers: [],
      playerFormData: {},
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    editPlayer(i) {
      this.modePlayer = "edit";
      this.playerFormData = {...i};
      this.uploaded = i.image
          ? `${this.$axios.defaults.baseURL}/uploads/${i.image}`
          : "img/avatars/logo.png";
      this.playerFormData.birthday = i.birthday?.split("T")?.[0];
      this.playerFormData.teamId=i.teamId;
      this.id = i.id;
      delete this.playerFormData.id;
    },
    cleanPlayer() {
      this.modePlayer = "new";
      this.playerFormData = {
        provinceId: this.playerFormData.provinceId,
        teamId: this.id,
      };
      this.uploaded = "https://via.placeholder.com/250";
    },
    updatePlayer: function (id) {
      this.playerFormData.password === "" &&
        delete this.playerFormData.password;
      this.$axios
        .put(`/users/${id}`, this.playerFormData)
        .then(() => {
          this.getUsers().then(({ data }) => {
            this.teamPlayers = data;
          });
          this.cleanPlayer();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    createPlayer: function () {
      this.$axios
        .post("/users", this.playerFormData)
        .then(() => {
          this.getUsers().then(({ data }) => {
            this.teamPlayers = data;
          });
          this.cleanPlayer();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    removePlayer: function (id) {
      if (confirm("Silmek istediğinize emin misiniz")) {
        this.$axios
          .delete(`/users/${id}`)
          .then(() => {
            this.getUsers().then(({ data }) => {
              this.teamPlayers = data;
            });
            this.cleanPlayer();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    getUserById: async function (id) {
      const user = await this.$axios.get(`/users/${id}`);
      return user;
    },
    getTeams: function () {
      return this.$axios.get("/teams").then((res) => {
        return res;
      });
    },
    getUsers: function () {
      const provinceFilter =
        this.user.role === "SuperAdmin"
          ? ""
          : `provinceId=${this.user.provinceId}`;
      return this.$axios.get(`/users?${provinceFilter}`).then((res) => {
        return res;
      });
    },
    getPositions: function () {
      return this.$axios.get("/positions").then((res) => {
        return res;
      });
    },
    getProvinces: function () {
      return this.$axios.get("/provinces").then((res) => {
        return res;
      });
    },
    getDistricts: function () {
      return this.$axios.get("/districts").then((res) => {
        return res;
      });
    },
    handleUploaded(e) {
      this.playerFormData.image = e.fileName;
      this.uploaded = `${this.$axios.defaults.baseURL}/uploads/${e.fileName}`;
    },
    handleUploadedPlayer(e) {
      this.playerFormData.image = e.fileName;
      this.uploaded = `${this.$axios.defaults.baseURL}/uploads/${e.fileName}`;
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
    this.getPositions().then(({ data }) => {
      this.positions = data;
    });
    this.getDistricts().then(({ data }) => {
      this.districts = [
        {
          id: "0",
          name: "İlçe Seçilmedi",
        },
        ...data,
      ];
    });
    this.getUsers().then(({ data }) => {
      this.teamPlayers = data;
    });
    this.getTeams().then(({ data }) => {
      this.teams = data;
    });
  },
};
</script>
