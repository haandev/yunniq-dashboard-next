<template>
  <div>
    <CRow>
      <CCol sm="6">
        <CCard>
          <CCardHeader>
            <strong>Anket</strong>
            <div class="card-header-actions">
              <small v-text="mode === 'new' ? 'Yeni' : 'Düzenle'"></small>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="8">
                <CRow>
                  <CCol sm="6">
                    <CInput
                      :value.sync="formData.name"
                      label="Anket Adı"
                      placeholder="Anket Adı"
                    />
                  </CCol>

                  <CCol sm="12">
                    <CInput
                      :value.sync="formData.description"
                      label="Anket Sorusu"
                      placeholder="Anket Sorusu"
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol sm="6">
                    <CSelect
                      :value.sync="formData.provinceId"
                      label="İl"
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
                      :value.sync="formData.status"
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
      <CCol sm="6" v-if="!!id">
        <CCard>
          <CCardHeader>
            <strong>Opsiyon</strong>
            <div class="card-header-actions">
              <small v-text="modeOption === 'new' ? 'Yeni' : 'Düzenle'"></small>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="4">
                <img
                  class="crop-image pick-logo-option"
                  :src="uploadedOption"
                  alt="Image not found"
                />
              </CCol>
              <CCol sm="8">
                <CRow>
                  <CCol sm="12">
                    <CInput
                      :value.sync="optionFormData.value"
                      label="Anket Şıkkı"
                      placeholder="Anket Şıkkı"
                    />
                  </CCol>
                </CRow>
              </CCol>
            </CRow>

            <hr />
            <CRow>
              <CCol sm="12" class="text-right">
                <CButton
                  v-if="modeOption !== 'new'"
                  @click="updateOption(optionFormData.id)"
                  size="sm"
                  color="primary"
                  class="mr-1"
                  >Kaydet</CButton
                >
                <CButton
                  v-else
                  @click="createOption()"
                  size="sm"
                  color="primary"
                  class="mr-1"
                  >Ekle</CButton
                >
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
        <CCard>
          <CCardHeader>
            <strong>Opsiyonlar</strong>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              :hover="true"
              :striped="true"
              :items="pollOptions"
              :fields="[
                {
                  key: 'id',
                  label: 'ID',
                },
                {
                  key: 'imageImg',
                  label: 'Resim',
                },
                {
                  key: 'value',
                  label: 'Değeri',
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
                    v-if="item.image"
                    class="list-image"
                    :src="
                      item.image
                        ? `${$axios.defaults.baseURL}/uploads/${item.image}`
                        : 'https://www.pasliga.com/anasayfa/img/pasliga-logo.png'
                    "
                    alt="Image not found"
                    onerror="this.onerror=null;this.src='https://www.pasliga.com/anasayfa/img/pasliga-logo.png';"
                  /></td
              ></template>

              <template #actions="{ item }">
                <td>
                  <CButton
                    @click="editOption(item)"
                    size="sm"
                    variant="outline"
                    color="primary"
                    >Düzenle</CButton
                  >
                  <CButton
                    @click="removeOption(item.id)"
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
          @uploaded="handleUploadedOption"
          trigger=".pick-logo-option"
          :labels="{ cancel: 'Vazgeç', submit: 'Onayla' }"
          :uploadUrl="`${$axios.defaults.baseURL}/file`"
        />
      </CCol>
    </CRow>
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader>
            <slot name="header"> <CIcon name="cil-grid" /> Anket Listesi </slot>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              :columnFilter="true"
              :hover="true"
              :striped="true"
              :items="polls"
              :fields="[
                {
                  key: 'id',
                  label: 'ID',
                },
                {
                  key: 'name',
                  label: 'Anket Adı',
                },
                {
                  key: 'description',
                  label: 'Anket Sorusu',
                },
                {
                  key: 'province',
                  label: 'İl',
                },
                {
                  key: 'statusStr',
                  label: 'Durumu',
                },
                {
                  key: 'actions',
                  label: 'Aksiyonlar',
                },
              ]"
              :items-per-page="10"
              pagination
            >
              <template #statusStr="{ item }"
                ><td>
                  {{ item.status === 0 ? "Pasif" : "Aktif" }}
                </td></template
              >
              <template #province="{ item }">
                <td>
                  {{ item.province ? item.province.name : "Anasayfa" }}
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

export default {
  name: "Polls",
  components: { AvatarCropper },
  data() {
    return {
      mode: "new",
      modeOption: "new",
      provinces: [],
      positions: [],
      districts: [],
      polls: [],
      id: null,
      uploaded: "https://via.placeholder.com/250",
      uploadedOption: "https://via.placeholder.com/250",
      pollOptions: [
        {
          value: "0",
          firstname: "Henüz",
          lastname: "Oyuncu Yok",
        },
      ],
      ProvinceOptions: [],
      formData: {},
      UserData: {},
      optionFormData: {},
    };
  },

  methods: {
    edit(i) {
      this.mode = "edit";
      this.formData = { ...i };
      this.formData.password = "";
      this.id = i.id;
      delete this.formData.id;
      this.getOptionsByPoll(this.id).then((res) => {
        this.pollOptions = res.data;
      });
      this.optionFormData = {
        provinceId: i.provinceId,
        pollId: i.id,
      };
      console.log(this.optionFormData);
    },
    editOption(i) {
      this.modeOption = "edit";
      this.optionFormData = i;
      this.uploadedOption = `${this.$axios.defaults.baseURL}/uploads/${i.image}`;
      console.log(i);
    },
    cleanOption() {
      this.modeOption = "new";
      this.optionFormData = {
        ...this.optionFormData,
        provinceId: this.formData.provinceId,
        teamId: this.id,
        value: '',
      };
      this.uploadedOption = "https://via.placeholder.com/250";
    },
    updateOption: function (id) {
      this.$axios
        .put(`/pollOptions/${id}`, this.optionFormData)
        .then(() => {
          this.getOptionsByPoll(this.id).then(({ data }) => {
            this.pollOptions = data;
          });
          this.cleanOption();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    createOption: function () {
      const image = this.formData.logo ? this.formData.logo : null;
      this.$axios
        .post("/pollOptions", {
          pollId: this.optionFormData.pollId,
          value: this.optionFormData.value,
          image,
        })
        .then(() => {
          this.getOptionsByPoll(this.id).then(({ data }) => {
            this.pollOptions = data;
          });
          this.cleanOption();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    removeOption: async function (id) {
      this.$axios
        .delete("/pollOptions/" + id)
        .then(() => {
          this.getOptionsByPoll(this.id).then(({ data }) => {
            this.pollOptions = data;
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    clean: function () {
      this.mode = "new";
      this.formData = {};
      (this.pollOptions = [{}]),
        (this.uploaded = "https://via.placeholder.com/250");
      this.uploadedOption = "https://via.placeholder.com/250";
      this.id = null;
    },
    update: function (id) {
      this.$axios
        .put(`/polls/${id}`, this.formData)
        .then(() => {
          this.getPolls().then(({ data }) => {
            this.polls = data;
          });
          this.clean();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    create: function () {
      this.$axios
        .post("/polls", this.formData)
        .then(() => {
          this.getPolls().then(({ data }) => {
            this.polls = data;
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
          .delete(`/polls/${id}`)
          .then(() => {
            this.getPolls().then(({ data }) => {
              this.polls = data;
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    getPolls: function () {
      return this.$axios.get("/polls?associations=province").then((res) => {
        return res;
      });
    },
    getOptionsByPoll: function (id) {
      return this.$axios.get(`/pollOptions?pollId=${id}`).then((res) => {
        return res;
      });
    },
    getProvinces: function () {
      return this.$axios.get("/provinces").then((res) => {
        return res;
      });
    },

    handleUploaded(e) {
      this.formData.logo = e.fileName;
      this.uploaded = `${this.$axios.defaults.baseURL}/uploads/${e.fileName}`;
    },
    handleUploadedOption(e) {
      this.formData.logo = e.fileName;
      this.uploadedOption = `${this.$axios.defaults.baseURL}/uploads/${e.fileName}`;
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

    this.getPolls().then(({ data }) => {
      const reqs = data.map(async (team) => {
        const captain = await this.getUserById(team.captainId);
        if (team.captainId) {
          team.captain = `${captain.data.firstname} ${captain.data.lastname}`;
        } else {
          team.captain = "Kaptan Bulunamadı";
        }
        console.log(captain);
        return captain;
      });
      Promise.allSettled(reqs).then(() => {
        console.log("done");
        this.polls = data;
      });
    });
  },
};
</script>
